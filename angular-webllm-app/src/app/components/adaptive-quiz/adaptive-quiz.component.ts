import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebLLMService } from '../../services/webllm.service';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

interface QuizResult {
  questionId: string;
  correct: boolean;
  userAnswer: number;
  timeTaken: number;
}

/**
 * Adaptive Programming Quiz Component
 *
 * Demonstrates TRULY DYNAMIC AI-powered UI:
 * - AI generates questions based on user performance
 * - Difficulty adapts in real-time (harder if doing well, easier if struggling)
 * - Questions and form elements created dynamically
 * - Personalized learning path for each user
 *
 * This is what "intelligent, dynamic UIs" means!
 */
@Component({
  selector: 'app-adaptive-quiz',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './adaptive-quiz.component.html'
})
export class AdaptiveQuizComponent {
  readonly webllm = inject(WebLLMService);

  // Quiz state
  readonly currentQuestion = signal<QuizQuestion | null>(null);
  readonly results = signal<QuizResult[]>([]);
  readonly isGenerating = signal(false);
  readonly isStarted = signal(false);
  readonly quizTopic = signal('');

  // User interaction
  selectedAnswer = signal<number | null>(null);
  questionStartTime = 0;

  // Computed
  readonly totalQuestions = computed(() => this.results().length);
  readonly correctAnswers = computed(() =>
    this.results().filter(r => r.correct).length
  );
  readonly accuracy = computed(() => {
    const total = this.totalQuestions();
    if (total === 0) return 0;
    return Math.round((this.correctAnswers() / total) * 100);
  });
  readonly currentDifficulty = computed(() => {
    const accuracy = this.accuracy();
    const total = this.totalQuestions();

    if (total < 2) return 'easy';
    if (accuracy >= 80) return 'hard';
    if (accuracy >= 50) return 'medium';
    return 'easy';
  });

  async startQuiz(topic: string) {
    if (!topic.trim()) {
      alert('Please enter a topic!');
      return;
    }

    this.quizTopic.set(topic);
    this.isStarted.set(true);
    this.results.set([]);
    await this.generateQuestion();
  }

  async generateQuestion() {
    this.isGenerating.set(true);
    this.selectedAnswer.set(null);

    try {
      const difficulty = this.currentDifficulty();
      const resultsContext = this.getResultsContext();

      const prompt = `You are a programming quiz generator. Generate a ${difficulty} difficulty multiple choice question about: ${this.quizTopic()}

${resultsContext}

Requirements:
- Question should be ${difficulty} difficulty
- Provide exactly 4 options
- Indicate which option is correct (0-3)
- Include a brief explanation

Respond ONLY with valid JSON in this exact format:
{
  "question": "the question text",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": 0,
  "explanation": "why this is correct"
}`;

      let response = '';
      for await (const chunk of this.webllm.generateStream(prompt)) {
        response += chunk;
      }

      // Try to parse the JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      const question: QuizQuestion = {
        id: crypto.randomUUID(),
        question: parsed.question,
        options: parsed.options,
        correctAnswer: parsed.correctAnswer,
        difficulty,
        explanation: parsed.explanation
      };

      this.currentQuestion.set(question);
      this.questionStartTime = Date.now();
    } catch (error) {
      console.error('Error generating question:', error);
      alert('Failed to generate question. Please try again.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  async submitAnswer() {
    const answer = this.selectedAnswer();
    const question = this.currentQuestion();

    if (answer === null || !question) return;

    const timeTaken = Math.round((Date.now() - this.questionStartTime) / 1000);
    const isCorrect = answer === question.correctAnswer;

    const result: QuizResult = {
      questionId: question.id,
      correct: isCorrect,
      userAnswer: answer,
      timeTaken
    };

    this.results.update(results => [...results, result]);

    // Show brief feedback before next question
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate next question
    await this.generateQuestion();
  }

  restartQuiz() {
    this.isStarted.set(false);
    this.results.set([]);
    this.currentQuestion.set(null);
    this.quizTopic.set('');
  }

  private getResultsContext(): string {
    const results = this.results();
    if (results.length === 0) {
      return 'This is the first question. Start with easy difficulty.';
    }

    const recent = results.slice(-3);
    const recentCorrect = recent.filter(r => r.correct).length;

    let context = `User has answered ${results.length} questions so far. `;
    context += `Overall accuracy: ${this.accuracy()}%. `;
    context += `Recent performance: ${recentCorrect}/${recent.length} correct. `;

    if (this.accuracy() >= 80) {
      context += 'User is doing very well - make it challenging!';
    } else if (this.accuracy() < 40) {
      context += 'User is struggling - keep it simple and educational.';
    } else {
      context += 'User is progressing steadily - maintain moderate difficulty.';
    }

    return context;
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'info';
    }
  }

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  }
}
