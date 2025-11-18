import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebLLMService } from '../../services/webllm.service';

interface ExplanationSection {
  title: string;
  content: string;
}

/**
 * Code Explainer Component
 *
 * Demonstrates AI-powered code understanding:
 * - Explain code in plain English
 * - Identify potential issues
 * - Suggest improvements
 * - Different explanation levels (beginner, intermediate, expert)
 */
@Component({
  selector: 'app-code-explainer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-explainer.component.html'
})
export class CodeExplainerComponent {
  readonly webllm = inject(WebLLMService);

  // Code input
  codeInput = '';
  selectedLanguage = 'javascript';
  explanationLevel = 'intermediate';

  // Explanation state
  readonly isExplaining = signal(false);
  readonly explanation = signal('');
  readonly streamingExplanation = signal('');

  // Sample codes for quick start
  readonly samples = {
    javascript: `async function fetchUserData(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = await response.json();
  return data;
}`,
    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
    typescript: `interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [];`,
    java: `public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
}`
  };

  loadSample() {
    this.codeInput = this.samples[this.selectedLanguage as keyof typeof this.samples] || this.samples.javascript;
  }

  async explainCode() {
    if (!this.codeInput.trim()) {
      alert('Please enter some code to explain!');
      return;
    }

    this.isExplaining.set(true);
    this.explanation.set('');
    this.streamingExplanation.set('');

    try {
      const levelDescriptions = {
        beginner: 'Explain like I\'m 5 years old, using simple analogies and avoiding jargon',
        intermediate: 'Explain clearly with some technical terms, suitable for someone with basic programming knowledge',
        expert: 'Provide a detailed technical analysis with advanced concepts and best practices'
      };

      const prompt = `You are an expert code educator. Analyze the following ${this.selectedLanguage} code and provide a comprehensive explanation.

${levelDescriptions[this.explanationLevel as keyof typeof levelDescriptions]}

Code to explain:
\`\`\`${this.selectedLanguage}
${this.codeInput}
\`\`\`

Structure your explanation with these sections:
1. **Overview**: What does this code do? (1-2 sentences)
2. **Step-by-Step**: Break down each part
3. **Key Concepts**: Important programming concepts used
4. **Potential Issues**: Any bugs, edge cases, or improvements needed
5. **Best Practices**: How this could be improved

Keep it concise and clear.`;

      for await (const chunk of this.webllm.generateStream(prompt)) {
        this.streamingExplanation.update(current => current + chunk);
      }

      this.explanation.set(this.streamingExplanation());
    } catch (error) {
      console.error('Error explaining code:', error);
      alert('Failed to explain code. Please try again.');
    } finally {
      this.isExplaining.set(false);
      this.streamingExplanation.set('');
    }
  }

  clearAll() {
    this.codeInput = '';
    this.explanation.set('');
    this.streamingExplanation.set('');
  }

  copyExplanation() {
    const text = this.explanation();
    navigator.clipboard.writeText(text).then(() => {
      alert('Explanation copied to clipboard!');
    });
  }
}
