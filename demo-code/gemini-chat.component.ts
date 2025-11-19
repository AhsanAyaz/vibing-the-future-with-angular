import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-gemini-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <h2>🤖 Chat with Gemini</h2>
        <span class="status" [class.connected]="isConnected()">
          {{ isConnected() ? '● Connected' : '○ Disconnected' }}
        </span>
      </div>

      <div class="messages-container">
        @for (msg of messages(); track msg.id) {
          <div class="message" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'">
            <div class="message-header">
              <strong>{{ msg.role === 'user' ? 'You' : 'Gemini' }}</strong>
              <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
            </div>
            <div class="message-content">{{ msg.content }}</div>
          </div>
        }

        @if (isLoading()) {
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
          [disabled]="isLoading() || !isConnected()"
          placeholder="Type your message..."
          class="chat-input"
        />
        <button
          (click)="send()"
          [disabled]="!input.trim() || isLoading() || !isConnected()"
          class="send-button"
        >
          {{ isLoading() ? 'Sending...' : 'Send' }}
        </button>
      </div>
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
      background: #dd0031;
      color: white;
    }

    .status {
      font-size: 0.9rem;
      color: #ffcccb;
    }

    .status.connected {
      color: #90EE90;
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
      background: #dd0031;
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
      background: #dd0031;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }

    .send-button:hover:not(:disabled) {
      background: #c3002f;
    }

    .send-button:disabled {
      background: #ccc;
      cursor: not-allowed;
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
export class GeminiChatComponent {
  messages = signal<Message[]>([]);
  input = '';
  isLoading = signal(false);
  isConnected = signal(false);

  private genAI!: GoogleGenerativeAI;
  private model: any;

  async ngOnInit() {
    try {
      // In production, use environment variables or a secure service
      const API_KEY = 'YOUR_GEMINI_API_KEY';
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.isConnected.set(true);

      // Add welcome message
      this.addMessage('assistant', 'Hello! I\'m Gemini. How can I help you today?');
    } catch (error) {
      console.error('Failed to initialize Gemini:', error);
      this.addMessage('assistant', 'Sorry, I couldn\'t connect to Gemini. Please check your API key.');
    }
  }

  async send() {
    if (!this.input.trim() || this.isLoading()) return;

    const userMessage = this.input.trim();
    this.input = '';

    // Add user message
    this.addMessage('user', userMessage);
    this.isLoading.set(true);

    try {
      // Use streaming for better UX
      const result = await this.model.generateContentStream(userMessage);

      let fullResponse = '';
      const assistantMessage = this.addMessage('assistant', '');

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;

        // Update the message content in real-time
        this.updateLastAssistantMessage(fullResponse);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      this.isLoading.set(false);
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

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
