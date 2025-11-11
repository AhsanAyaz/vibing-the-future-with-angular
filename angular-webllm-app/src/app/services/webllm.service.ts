import { Injectable, signal, computed } from '@angular/core';
import * as webllm from '@mlc-ai/web-llm';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ModelLoadProgress {
  progress: number;
  text: string;
  timeElapsed: number;
}

export type ModelStatus = 'uninitialized' | 'loading' | 'ready' | 'error';

/**
 * WebLLM Service - Manages the Web-LLM engine and provides AI capabilities
 *
 * Uses Service Worker for better performance and persistence:
 * - Keeps UI thread responsive during model operations
 * - Maintains model persistence across page visits
 * - Better memory management
 *
 * This runs 100% in the browser with complete privacy
 */
@Injectable({
  providedIn: 'root'
})
export class WebLLMService {
  private engine?: webllm.MLCEngineInterface;
  private serviceWorkerRegistration?: ServiceWorkerRegistration;

  // State signals
  readonly status = signal<ModelStatus>('uninitialized');
  readonly loadProgress = signal<ModelLoadProgress>({
    progress: 0,
    text: 'Not started',
    timeElapsed: 0
  });
  readonly error = signal<string | null>(null);

  // Computed
  readonly isReady = computed(() => this.status() === 'ready');
  readonly isLoading = computed(() => this.status() === 'loading');

  // Configuration
  // Using MLC-compiled Llama 3.1 8B model optimized for WebGPU inference
  // This model achieves 80-90% of native performance in-browser
  private readonly DEFAULT_MODEL = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';
  private conversationHistory: Message[] = [];

  /**
   * Initialize the Web-LLM engine with Service Worker
   */
  async initialize(modelId: string = this.DEFAULT_MODEL): Promise<void> {
    if (this.status() === 'ready') {
      console.log('Model already initialized');
      return;
    }

    try {
      this.status.set('loading');
      this.error.set(null);

      // Register service worker if not already registered
      if ('serviceWorker' in navigator && !this.serviceWorkerRegistration) {
        try {
          this.serviceWorkerRegistration = await navigator.serviceWorker.register(
            new URL('/sw.ts', import.meta.url),
            { type: 'module' }
          );
          console.log('Service Worker registered successfully');

          // Wait for service worker to be ready
          await navigator.serviceWorker.ready;
        } catch (swError) {
          console.warn('Service Worker registration failed, falling back to main thread:', swError);
          // Fallback to main thread if service worker fails
          return this.initializeMainThread(modelId);
        }
      }

      const startTime = Date.now();

      // Create engine using Service Worker
      this.engine = await webllm.CreateServiceWorkerMLCEngine(modelId, {
        initProgressCallback: (progress: webllm.InitProgressReport) => {
          const timeElapsed = (Date.now() - startTime) / 1000;
          this.loadProgress.set({
            progress: progress.progress,
            text: progress.text,
            timeElapsed
          });
        },
      });

      this.status.set('ready');
      console.log('✅ Web-LLM initialized successfully with Service Worker');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.error.set(errorMessage);
      this.status.set('error');
      console.error('Failed to initialize Web-LLM:', err);
      throw err;
    }
  }

  /**
   * Fallback: Initialize the Web-LLM engine on main thread
   */
  private async initializeMainThread(modelId: string): Promise<void> {
    const startTime = Date.now();

    this.engine = await webllm.CreateMLCEngine(modelId, {
      initProgressCallback: (progress: webllm.InitProgressReport) => {
        const timeElapsed = (Date.now() - startTime) / 1000;
        this.loadProgress.set({
          progress: progress.progress,
          text: progress.text,
          timeElapsed
        });
      },
    });

    this.status.set('ready');
    console.log('✅ Web-LLM initialized successfully on main thread');
  }

  /**
   * Generate a completion (non-streaming)
   */
  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    this.ensureReady();

    const messages: Message[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const completion = await this.engine!.chat.completions.create({
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || '';
  }

  /**
   * Generate a streaming completion
   */
  async *generateStream(
    prompt: string,
    systemPrompt?: string
  ): AsyncGenerator<string> {
    this.ensureReady();

    const messages: Message[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const completion = await this.engine!.chat.completions.create({
      messages: messages as any,
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    });

    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        yield delta;
      }
    }
  }

  /**
   * Chat with conversation history (streaming)
   */
  async *chat(
    message: string,
    options?: {
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
      includeHistory?: boolean;
    }
  ): AsyncGenerator<string> {
    this.ensureReady();

    const messages: Message[] = [];

    // Add system prompt if provided
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }

    // Add conversation history if requested
    if (options?.includeHistory) {
      messages.push(...this.conversationHistory);
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    const completion = await this.engine!.chat.completions.create({
      messages: messages as any,
      stream: true,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    });

    let fullResponse = '';

    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullResponse += delta;
        yield delta;
      }
    }

    // Update conversation history
    if (options?.includeHistory) {
      this.conversationHistory.push({ role: 'user', content: message });
      this.conversationHistory.push({ role: 'assistant', content: fullResponse });
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory(): Message[] {
    return [...this.conversationHistory];
  }

  /**
   * Reset the service
   */
  async reset(): Promise<void> {
    this.conversationHistory = [];
    this.status.set('uninitialized');
    this.loadProgress.set({ progress: 0, text: 'Not started', timeElapsed: 0 });
    this.error.set(null);
    this.engine = undefined;
  }

  /**
   * Ensure the model is ready
   */
  private ensureReady(): void {
    if (!this.engine || this.status() !== 'ready') {
      throw new Error('Web-LLM is not initialized. Call initialize() first.');
    }
  }

  /**
   * Get available models
   */
  getAvailableModels(): string[] {
    return [
      'Llama-3.1-8B-Instruct-q4f32_1',
      'Llama-3.2-3B-Instruct-q4f32_1',
      'Phi-3-mini-4k-instruct-q4f16_1',
      'gemma-2-2b-it-q4f16_1',
    ];
  }
}
