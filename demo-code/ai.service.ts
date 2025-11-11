import { Injectable, signal } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as webllm from '@mlc-ai/web-llm';

export type AIProvider = 'gemini' | 'webllm' | 'auto';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StreamChunk {
  text: string;
  done: boolean;
}

/**
 * Universal AI Service that supports multiple providers
 * Automatically selects the best provider based on context
 */
@Injectable({
  providedIn: 'root'
})
export class AIService {
  private geminiAI?: GoogleGenerativeAI;
  private geminiModel?: any;
  private webllmEngine?: webllm.MLCEngine;

  // State
  readonly isGeminiReady = signal(false);
  readonly isWebLLMReady = signal(false);
  readonly currentProvider = signal<AIProvider>('auto');
  readonly initProgress = signal('');

  constructor() {}

  /**
   * Initialize Gemini with API key
   */
  async initGemini(apiKey: string): Promise<void> {
    try {
      this.geminiAI = new GoogleGenerativeAI(apiKey);
      this.geminiModel = this.geminiAI.getGenerativeModel({
        model: 'gemini-pro'
      });
      this.isGeminiReady.set(true);
      console.log('✅ Gemini initialized');
    } catch (error) {
      console.error('Failed to initialize Gemini:', error);
      throw error;
    }
  }

  /**
   * Initialize Web-LLM (on-device)
   */
  async initWebLLM(
    modelId: string = 'Llama-3.1-8B-Instruct-q4f32_1',
    onProgress?: (progress: webllm.InitProgressReport) => void
  ): Promise<void> {
    try {
      this.initProgress.set('Loading Web-LLM model...');

      this.webllmEngine = await webllm.CreateMLCEngine(modelId, {
        initProgressCallback: (report) => {
          this.initProgress.set(report.text);
          onProgress?.(report);
        },
      });

      this.isWebLLMReady.set(true);
      this.initProgress.set('Web-LLM ready!');
      console.log('✅ Web-LLM initialized');
    } catch (error) {
      console.error('Failed to initialize Web-LLM:', error);
      throw error;
    }
  }

  /**
   * Automatically select the best available provider
   */
  private selectProvider(): 'gemini' | 'webllm' {
    const preferred = this.currentProvider();

    if (preferred === 'gemini' && this.isGeminiReady()) {
      return 'gemini';
    }

    if (preferred === 'webllm' && this.isWebLLMReady()) {
      return 'webllm';
    }

    // Auto mode: prefer Gemini if online, WebLLM if offline
    if (preferred === 'auto') {
      if (navigator.onLine && this.isGeminiReady()) {
        return 'gemini';
      }
      if (this.isWebLLMReady()) {
        return 'webllm';
      }
    }

    throw new Error('No AI provider available');
  }

  /**
   * Generate a response (non-streaming)
   */
  async generate(
    prompt: string,
    provider?: AIProvider
  ): Promise<string> {
    const selectedProvider = provider || this.selectProvider();

    if (selectedProvider === 'gemini') {
      return this.generateWithGemini(prompt);
    } else {
      return this.generateWithWebLLM(prompt);
    }
  }

  /**
   * Generate a streaming response
   */
  async *generateStream(
    messages: AIMessage[],
    provider?: AIProvider
  ): AsyncGenerator<StreamChunk> {
    const selectedProvider = provider || this.selectProvider();

    if (selectedProvider === 'gemini') {
      yield* this.streamWithGemini(messages);
    } else {
      yield* this.streamWithWebLLM(messages);
    }
  }

  /**
   * Chat with conversation history (streaming)
   */
  async *chat(
    messages: AIMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      provider?: AIProvider;
    }
  ): AsyncGenerator<StreamChunk> {
    const selectedProvider = options?.provider || this.selectProvider();

    if (selectedProvider === 'gemini') {
      yield* this.chatWithGemini(messages, options);
    } else {
      yield* this.chatWithWebLLM(messages, options);
    }
  }

  // ============ Gemini-specific methods ============

  private async generateWithGemini(prompt: string): Promise<string> {
    if (!this.geminiModel) {
      throw new Error('Gemini not initialized');
    }

    const result = await this.geminiModel.generateContent(prompt);
    return result.response.text();
  }

  private async *streamWithGemini(
    messages: AIMessage[]
  ): AsyncGenerator<StreamChunk> {
    if (!this.geminiModel) {
      throw new Error('Gemini not initialized');
    }

    // Convert messages to Gemini format
    const prompt = messages
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const result = await this.geminiModel.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      yield {
        text: chunk.text(),
        done: false
      };
    }

    yield { text: '', done: true };
  }

  private async *chatWithGemini(
    messages: AIMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): AsyncGenerator<StreamChunk> {
    if (!this.geminiModel) {
      throw new Error('Gemini not initialized');
    }

    // Use chat mode for better conversation handling
    const chat = this.geminiModel.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 1024,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      yield {
        text: chunk.text(),
        done: false
      };
    }

    yield { text: '', done: true };
  }

  // ============ Web-LLM-specific methods ============

  private async generateWithWebLLM(prompt: string): Promise<string> {
    if (!this.webllmEngine) {
      throw new Error('Web-LLM not initialized');
    }

    const completion = await this.webllmEngine.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0]?.message?.content || '';
  }

  private async *streamWithWebLLM(
    messages: AIMessage[]
  ): AsyncGenerator<StreamChunk> {
    if (!this.webllmEngine) {
      throw new Error('Web-LLM not initialized');
    }

    const completion = await this.webllmEngine.chat.completions.create({
      messages: messages as any,
      stream: true,
    });

    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        yield {
          text: delta,
          done: false
        };
      }
    }

    yield { text: '', done: true };
  }

  private async *chatWithWebLLM(
    messages: AIMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): AsyncGenerator<StreamChunk> {
    if (!this.webllmEngine) {
      throw new Error('Web-LLM not initialized');
    }

    const completion = await this.webllmEngine.chat.completions.create({
      messages: messages as any,
      stream: true,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 512,
    });

    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        yield {
          text: delta,
          done: false
        };
      }
    }

    yield { text: '', done: true };
  }

  /**
   * Check if any provider is ready
   */
  isReady(): boolean {
    return this.isGeminiReady() || this.isWebLLMReady();
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): AIProvider[] {
    const providers: AIProvider[] = [];

    if (this.isGeminiReady()) {
      providers.push('gemini');
    }

    if (this.isWebLLMReady()) {
      providers.push('webllm');
    }

    return providers;
  }
}
