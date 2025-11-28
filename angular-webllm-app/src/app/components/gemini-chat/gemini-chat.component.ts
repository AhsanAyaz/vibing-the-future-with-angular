import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
  resource,
  ResourceStreamItem,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MarkdownService } from '../../services/markdown.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Gemini Chat Component
 *
 * Demonstrates cloud-based AI with Google Gemini:
 * - Real-time streaming responses
 * - Conversation history
 * - Fast, powerful, always up-to-date
 * - Requires API key and internet connection
 *
 * This is the LIVE DEMO promised in the talk abstract!
 */
@Component({
  selector: 'app-gemini-chat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './gemini-chat.component.html',
})
export class GeminiChatComponent {
  // Services
  readonly markdown = inject(MarkdownService);

  // Gemini setup
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  // LocalStorage key for API key persistence
  private readonly STORAGE_KEY = 'gemini-api-key';

  // State
  readonly messages = signal<Message[]>([]);
  readonly apiKey = signal('');
  readonly isConfigured = signal(false);
  readonly error = signal<string | null>(null);

  // Input
  currentMessage = '';

  // Resource for streaming chat
  readonly prompt = signal<string | null>(null);

  readonly chatResource = resource({
    params: () => ({ prompt: this.prompt() }),
    stream: async ({ params, abortSignal }): Promise<any> => {
      // Return a signal that tracks the streaming status/value
      const streamState = signal<ResourceStreamItem<string>>({ value: '' });

      if (!params.prompt || !this.model) {
        return streamState;
      }

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      // Add placeholder message
      this.messages.update((msgs) => [...msgs, aiMessage]);
      this.error.set(null);

      // Start the streaming process
      (async () => {
        try {
          const result = await this.model.generateContentStream(params.prompt);

          for await (const chunk of result.stream) {
            if (abortSignal.aborted) break;
            const text = chunk.text();

            // Update the message in the array directly
            this.messages.update((msgs: Message[]) =>
              msgs.map((msg: Message) =>
                msg.id === aiMessage.id ? { ...msg, content: msg.content + text } : msg
              )
            );

            // Update the stream state signal
            streamState.update((prev) => {
              if ('value' in prev) {
                return { value: (prev.value ?? '') + text };
              }
              return { value: text };
            });
          }
        } catch (err) {
          console.error('Streaming error:', err);
          this.error.set(
            'Failed to get response from Gemini. Check your API key and internet connection.'
          );
          // Remove the failed message
          this.messages.update((msgs: Message[]) =>
            msgs.filter((msg: Message) => msg.id !== aiMessage.id)
          );
          streamState.set({ error: err as Error });
        }
      })();

      return streamState;
    },
  });

  constructor() {
    // Try to load saved API key from localStorage
    this.loadSavedApiKey();
  }

  private loadSavedApiKey() {
    try {
      const savedKey = localStorage.getItem(this.STORAGE_KEY);
      if (savedKey) {
        this.apiKey.set(savedKey);
        // Auto-configure with saved key
        this.configureGemini();
      }
    } catch (err) {
      console.warn('Could not load saved API key:', err);
    }
  }

  configureGemini() {
    const key = this.apiKey().trim();
    if (!key) {
      this.error.set('Please enter your Gemini API key');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(key);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      this.isConfigured.set(true);
      this.error.set(null);

      // Save API key to localStorage for future sessions
      try {
        localStorage.setItem(this.STORAGE_KEY, key);
      } catch (storageErr) {
        console.warn('Could not save API key to localStorage:', storageErr);
      }

      console.log('✅ Gemini configured successfully');
    } catch (err) {
      this.error.set('Failed to configure Gemini. Check your API key.');
      console.error('Gemini configuration error:', err);
    }
  }

  clearApiKey() {
    if (confirm('Clear saved API key? You will need to enter it again next time.')) {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (err) {
        console.warn('Could not clear API key from localStorage:', err);
      }

      this.apiKey.set('');
      this.isConfigured.set(false);
      this.messages.set([]);
      this.genAI = null;
      this.model = null;
    }
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || this.chatResource.isLoading() || !this.isConfigured()) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: this.currentMessage,
      timestamp: new Date(),
    };

    this.messages.update((msgs) => [...msgs, userMessage]);
    const messageText = this.currentMessage;
    this.currentMessage = '';

    // Trigger the resource
    this.prompt.set(messageText);
  }

  clearChat() {
    if (confirm('Clear all messages?')) {
      this.messages.set([]);
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
