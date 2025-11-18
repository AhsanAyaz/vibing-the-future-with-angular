import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebLLMService } from '../../services/webllm.service';

/**
 * Smart Form Assistant Component
 *
 * Demonstrates AI-powered form assistance:
 * - Intelligent auto-completion suggestions
 * - Context-aware field suggestions
 * - Professional formatting
 */
@Component({
  selector: 'app-smart-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './smart-form.component.html'
})
export class SmartFormComponent {
  readonly webllm = inject(WebLLMService);

  // Form fields
  name = '';
  email = '';
  company = '';
  role = '';
  projectDescription = '';
  technicalRequirements = '';

  // AI assistance state
  readonly isGenerating = signal(false);
  readonly suggestion = signal('');
  readonly activeSuggestion = signal<string | null>(null);

  async suggestDescription() {
    if (!this.name || !this.company) {
      alert('Please fill in Name and Company first!');
      return;
    }

    this.isGenerating.set(true);
    this.suggestion.set('');
    this.activeSuggestion.set('description');

    try {
      const prompt = `You are a professional project manager. Based on the following information:

Name: ${this.name}
Company: ${this.company}
Role: ${this.role || 'Not specified'}

Generate a concise, professional project description (2-3 sentences) for a typical project this person might work on. Be specific and relevant to their role and company.`;

      for await (const chunk of this.webllm.generateStream(prompt)) {
        this.suggestion.update(current => current + chunk);
      }
    } catch (error) {
      console.error('Error generating suggestion:', error);
      alert('Failed to generate suggestion. Please try again.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  async suggestRequirements() {
    if (!this.projectDescription) {
      alert('Please fill in or generate a Project Description first!');
      return;
    }

    this.isGenerating.set(true);
    this.suggestion.set('');
    this.activeSuggestion.set('requirements');

    try {
      const prompt = `You are a technical architect. Based on this project description:

"${this.projectDescription}"

List 3-5 key technical requirements in a bulleted list. Be specific and technical.`;

      for await (const chunk of this.webllm.generateStream(prompt)) {
        this.suggestion.update(current => current + chunk);
      }
    } catch (error) {
      console.error('Error generating requirements:', error);
      alert('Failed to generate requirements. Please try again.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  applySuggestion() {
    const suggestionText = this.suggestion();
    const activeField = this.activeSuggestion();

    if (activeField === 'description') {
      this.projectDescription = suggestionText.trim();
    } else if (activeField === 'requirements') {
      this.technicalRequirements = suggestionText.trim();
    }

    this.clearSuggestion();
  }

  clearSuggestion() {
    this.suggestion.set('');
    this.activeSuggestion.set(null);
  }

  submitForm() {
    console.log('Form submitted:', {
      name: this.name,
      email: this.email,
      company: this.company,
      role: this.role,
      projectDescription: this.projectDescription,
      technicalRequirements: this.technicalRequirements
    });
    alert('Form submitted successfully! (Check console for data)');
  }
}
