import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as webllm from '@mlc-ai/web-llm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-webllm-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <h2>💻 On-Device Web-LLM Chat</h2>
        <span class="status" [class.ready]="isReady()">
          {{ getStatusText() }}
        </span>
      </div>

      @if (!isReady()) {
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <h3>{{ loadingMessage() }}</h3>
          <p>{{ initProgress() }}</p>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPercent()"></div>
          </div>
          <small>First time setup downloads ~4GB model (cached for future use)</small>
        </div>
      }

      @if (isReady()) {
        <div class="messages-container">
          @for (msg of messages(); track msg.id) {
            <div class="message" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'">
              <div class="message-header">
                <strong>{{ msg.role === 'user' ? 'You' : 'AI' }}</strong>
                <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <div class="message-content">{{ msg.content }}</div>
            </div>
          }

          @if (isGenerating()) {
            <div class="message assistant loading">
              <div class="message-content">
                <span class="typing-indicator">●●●</span>
              </div>
            </div>
          }
        </div>

        <div class="input-container">
          <input
            type="text"
            [(ngModel)]="input"
            (keyup.enter)="send()"
            [disabled]="isGenerating()"
            placeholder="Type your message... (100% private, runs in your browser)"
            class="chat-input"
          />
          <button
            (click)="send()"
            [disabled]="!input.trim() || isGenerating()"
            class="send-button"
          >
            {{ isGenerating() ? 'Thinking...' : 'Send' }}
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-width: 800px;
      margin: 0 auto;
      background: #f5f5f5;
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #1976d2;
      color: white;
    }

    .status {
      font-size: 0.9rem;
      color: #ffeb3b;
    }

    .status.ready {
      color: #90EE90;
    }

    .loading-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      text-align: center;
    }

    .loading-spinner {
      width: 60px;
      height: 60px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #1976d2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    .progress-bar {
      width: 100%;
      max-width: 400px;
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin: 1rem 0;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #1976d2, #42a5f5);
      transition: width 0.3s ease;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message {
      padding: 1rem;
      border-radius: 8px;
      max-width: 70%;
      animation: slideIn 0.3s ease-out;
    }

    .message.user {
      align-self: flex-end;
      background: #1976d2;
      color: white;
    }

    .message.assistant {
      align-self: flex-start;
      background: white;
      border: 1px solid #ddd;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      opacity: 0.8;
    }

    .message-content {
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .typing-indicator {
      animation: pulse 1.5s infinite;
    }

    .input-container {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      background: white;
      border-top: 1px solid #ddd;
    }

    .chat-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .send-button {
      padding: 0.75rem 1.5rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }

    .send-button:hover:not(:disabled) {
      background: #1565c0;
    }

    .send-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
  `]
})
export class WebLLMChatComponent {
  messages = signal<Message[]>([]);
  input = '';
  isReady = signal(false);
  isGenerating = signal(false);
  loadingMessage = signal('Initializing Web-LLM...');
  initProgress = signal('');
  progressPercent = signal(0);

  private engine!: webllm.MLCEngine;

  async ngOnInit() {
    await this.initializeWebLLM();
  }

  private async initializeWebLLM() {
    try {
      this.loadingMessage.set('Loading AI model...');

      const initProgressCallback = (progress: webllm.InitProgressReport) => {
        this.initProgress.set(progress.text);
        this.progressPercent.set(progress.progress * 100);
        console.log('Progress:', progress);
      };

      // Use a smaller model for faster loading
      // Options: "Llama-3.1-8B-Instruct-q4f32_1", "Phi-3-mini-4k-instruct-q4f16_1"
      this.engine = await webllm.CreateMLCEngine(
        'Llama-3.1-8B-Instruct-q4f32_1',
        {
          initProgressCallback,
        }
      );

      this.isReady.set(true);
      this.loadingMessage.set('Ready!');

      // Add welcome message
      this.addMessage('assistant', 'Hello! I\'m running 100% in your browser. Your messages never leave your device! 🔒');
    } catch (error) {
      console.error('Failed to initialize Web-LLM:', error);
      this.loadingMessage.set('Error initializing Web-LLM. Please refresh and try again.');
      this.initProgress.set(String(error));
    }
  }

  async send() {
    if (!this.input.trim() || this.isGenerating() || !this.isReady()) return;

    const userMessage = this.input.trim();
    this.input = '';

    // Add user message
    this.addMessage('user', userMessage);
    this.isGenerating.set(true);

    try {
      // Create a streaming response
      const messages: webllm.ChatCompletionMessageParam[] = this.messages().map(m => ({
        role: m.role,
        content: m.content
      }));

      let fullResponse = '';
      const assistantMessage = this.addMessage('assistant', '');

      // Use streaming for real-time updates
      const completion = await this.engine.chat.completions.create({
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 512,
      });

      for await (const chunk of completion) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          fullResponse += delta;
          this.updateLastAssistantMessage(fullResponse);
        }
      }
    } catch (error) {
      console.error('Error generating response:', error);
      this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  private addMessage(role: 'user' | 'assistant', content: string): Message {
    const message: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date()
    };

    this.messages.update(messages => [...messages, message]);
    return message;
  }

  private updateLastAssistantMessage(content: string) {
    this.messages.update(messages => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        return [
          ...messages.slice(0, -1),
          { ...lastMessage, content }
        ];
      }
      return messages;
    });
  }

  getStatusText(): string {
    if (this.isReady()) {
      return '● Ready (On-device)';
    }
    return '○ Loading...';
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
