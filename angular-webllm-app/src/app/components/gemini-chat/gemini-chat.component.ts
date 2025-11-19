import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
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
  templateUrl: './gemini-chat.component.html'
})
export class GeminiChatComponent {
  // Services
  readonly markdown = inject(MarkdownService);

  // Gemini setup
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  // State
  readonly messages = signal<Message[]>([]);
  readonly isStreaming = signal(false);
  readonly streamingContent = signal('');
  readonly apiKey = signal('');
  readonly isConfigured = signal(false);
  readonly error = signal<string | null>(null);

  // Input
  currentMessage = '';

  configureGemini() {
    const key = this.apiKey().trim();
    if (!key) {
      this.error.set('Please enter your Gemini API key');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(key);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.isConfigured.set(true);
      this.error.set(null);
      console.log('✅ Gemini configured successfully');
    } catch (err) {
      this.error.set('Failed to configure Gemini. Check your API key.');
      console.error('Gemini configuration error:', err);
    }
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || this.isStreaming() || !this.isConfigured()) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: this.currentMessage,
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMessage]);
    const messageText = this.currentMessage;
    this.currentMessage = '';

    // Create placeholder for AI response
    const aiMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    this.messages.update(msgs => [...msgs, aiMessage]);

    this.isStreaming.set(true);
    this.streamingContent.set('');
    this.error.set(null);

    try {
      const result = await this.model.generateContentStream(messageText);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        this.streamingContent.update(current => current + text);

        // Update the message in the array
        this.messages.update(msgs =>
          msgs.map(msg =>
            msg.id === aiMessage.id
              ? { ...msg, content: this.streamingContent() }
              : msg
          )
        );
      }
    } catch (err) {
      console.error('Streaming error:', err);
      this.error.set('Failed to get response from Gemini. Check your API key and internet connection.');

      // Remove the failed message
      this.messages.update(msgs => msgs.filter(msg => msg.id !== aiMessage.id));
    } finally {
      this.isStreaming.set(false);
      this.streamingContent.set('');
    }
  }

  clearChat() {
    if (confirm('Clear all messages?')) {
      this.messages.set([]);
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
