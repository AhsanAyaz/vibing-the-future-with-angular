import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebLLMService } from '../../services/webllm.service';

interface EmailTemplate {
  name: string;
  prompt: string;
  icon: string;
}

/**
 * Email Generator Component
 *
 * Demonstrates AI-powered content generation:
 * - Professional email composition
 * - Multiple tones and styles
 * - Context-aware generation
 * - Edit and regenerate capabilities
 */
@Component({
  selector: 'app-email-generator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-generator.component.html'
})
export class EmailGeneratorComponent {
  readonly webllm = inject(WebLLMService);

  // Input fields
  emailType = 'professional';
  tone = 'formal';
  recipient = '';
  subject = '';
  keyPoints = '';

  // Generation state
  readonly isGenerating = signal(false);
  readonly generatedEmail = signal('');
  readonly streamingEmail = signal('');

  // Email templates
  readonly templates: EmailTemplate[] = [
    {
      name: 'Meeting Request',
      icon: '📅',
      prompt: 'Request a meeting to discuss project timeline'
    },
    {
      name: 'Thank You',
      icon: '🙏',
      prompt: 'Thank someone for their help on a recent project'
    },
    {
      name: 'Follow Up',
      icon: '📧',
      prompt: 'Follow up on a previous email about collaboration'
    },
    {
      name: 'Introduction',
      icon: '👋',
      prompt: 'Introduce yourself to a potential client'
    }
  ];

  loadTemplate(template: EmailTemplate) {
    this.keyPoints = template.prompt;
    this.subject = template.name;
  }

  async generateEmail() {
    if (!this.recipient || !this.subject || !this.keyPoints) {
      alert('Please fill in all fields!');
      return;
    }

    this.isGenerating.set(true);
    this.generatedEmail.set('');
    this.streamingEmail.set('');

    try {
      const toneDescriptions = {
        formal: 'very professional and formal',
        friendly: 'warm and friendly but still professional',
        casual: 'casual and relaxed',
        persuasive: 'persuasive and compelling'
      };

      const prompt = `You are a professional email writer. Generate a ${toneDescriptions[this.tone as keyof typeof toneDescriptions]} email based on the following information:

Recipient: ${this.recipient}
Subject: ${this.subject}
Key Points to Cover:
${this.keyPoints}

Generate a complete, well-structured email with:
- Appropriate greeting
- Clear body paragraphs
- Professional closing
- Signature placeholder

Keep it concise (3-4 short paragraphs maximum) and action-oriented.`;

      for await (const chunk of this.webllm.generateStream(prompt)) {
        this.streamingEmail.update(current => current + chunk);
      }

      this.generatedEmail.set(this.streamingEmail());
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email. Please try again.');
    } finally {
      this.isGenerating.set(false);
      this.streamingEmail.set('');
    }
  }

  async regenerate() {
    if (!this.generatedEmail()) return;
    await this.generateEmail();
  }

  async makeMore(adjustment: string) {
    if (!this.generatedEmail()) return;

    this.isGenerating.set(true);
    this.streamingEmail.set('');

    try {
      const prompt = `Take this email and make it ${adjustment}:

${this.generatedEmail()}

Keep the same core message and structure, just adjust the ${adjustment} aspect.`;

      this.generatedEmail.set('');

      for await (const chunk of this.webllm.generateStream(prompt)) {
        this.streamingEmail.update(current => current + chunk);
      }

      this.generatedEmail.set(this.streamingEmail());
    } catch (error) {
      console.error('Error adjusting email:', error);
      alert('Failed to adjust email. Please try again.');
    } finally {
      this.isGenerating.set(false);
      this.streamingEmail.set('');
    }
  }

  copyEmail() {
    const email = this.generatedEmail();
    navigator.clipboard.writeText(email).then(() => {
      alert('Email copied to clipboard!');
    });
  }

  clearAll() {
    this.recipient = '';
    this.subject = '';
    this.keyPoints = '';
    this.generatedEmail.set('');
    this.streamingEmail.set('');
  }
}
