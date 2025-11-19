import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebLLMService } from '../../services/webllm.service';

type QuestionType = 'multiple-choice' | 'text-input' | 'slider' | 'true-false-confidence' | 'multi-select';

interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
}

interface TextInputQuestion extends BaseQuestion {
  type: 'text-input';
  correctAnswer: string;
  acceptableAnswers?: string[];
  caseSensitive?: boolean;
}

interface SliderQuestion extends BaseQuestion {
  type: 'slider';
  min: number;
  max: number;
  correctAnswer: number;
  tolerance: number;
  unit?: string;
}

interface TrueFalseConfidenceQuestion extends BaseQuestion {
  type: 'true-false-confidence';
  correctAnswer: boolean;
}

interface MultiSelectQuestion extends BaseQuestion {
  type: 'multi-select';
  options: string[];
  correctAnswers: number[];
}

type QuizQuestion = MultipleChoiceQuestion | TextInputQuestion | SliderQuestion |
                    TrueFalseConfidenceQuestion | MultiSelectQuestion;

interface QuizResult {
  questionId: string;
  correct: boolean;
  userAnswer: any; // Can be number, string, number[], boolean, or {answer: boolean, confidence: number}
  timeTaken: number;
  questionType: QuestionType;
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

  // User interaction - different types for different questions
  selectedAnswer = signal<number | null>(null); // for multiple-choice
  textAnswer = signal<string>(''); // for text-input
  sliderValue = signal<number>(0); // for slider
  trueFalseAnswer = signal<boolean | null>(null); // for true-false-confidence
  confidenceLevel = signal<number>(50); // for true-false-confidence (0-100)
  selectedMultiple = signal<Set<number>>(new Set()); // for multi-select
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
    this.currentQuestion.set(null); // Clear current question to prevent flickering
    this.resetAnswers();

    try {
      const difficulty = this.currentDifficulty();
      const resultsContext = this.getResultsContext();
      const usedTypes = this.getRecentQuestionTypes();

      const prompt = `You are an intelligent programming quiz generator. Generate a ${difficulty} difficulty question about: ${this.quizTopic()}

${resultsContext}

IMPORTANT: Choose the BEST question type for the content. Vary question types to keep it interesting.
Recent types used: ${usedTypes.join(', ') || 'none yet'}

Available question types:
1. "multiple-choice" - Traditional 4 options (best for concepts, comparisons)
2. "text-input" - Type exact answer (best for syntax, commands, API names)
3. "slider" - Estimate a number (best for percentages, performance metrics, sizes)
4. "true-false-confidence" - True/false with confidence slider (best for facts, misconceptions)
5. "multi-select" - Select all correct answers (best when multiple things apply)

Requirements:
- Choose the question type that BEST tests this knowledge
- Question should be ${difficulty} difficulty
- Include a brief explanation
- Respond ONLY with valid JSON

Format examples:

MULTIPLE-CHOICE:
{
  "type": "multiple-choice",
  "question": "Which lifecycle hook runs after component initialization?",
  "options": ["ngOnInit", "ngAfterViewInit", "constructor", "ngOnChanges"],
  "correctAnswer": 0,
  "explanation": "ngOnInit runs after the component is initialized"
}

TEXT-INPUT:
{
  "type": "text-input",
  "question": "What Angular CLI command creates a new component?",
  "correctAnswer": "ng generate component",
  "acceptableAnswers": ["ng g c", "ng generate component", "ng g component"],
  "caseSensitive": false,
  "explanation": "The command is 'ng generate component' or 'ng g c' for short"
}

SLIDER:
{
  "type": "slider",
  "question": "What percentage of web apps fail Core Web Vitals in 2025?",
  "min": 0,
  "max": 100,
  "correctAnswer": 90,
  "tolerance": 5,
  "unit": "%",
  "explanation": "About 90% of web apps fail Core Web Vitals"
}

TRUE-FALSE-CONFIDENCE:
{
  "type": "true-false-confidence",
  "question": "Angular Signals eliminate the need for Zone.js",
  "correctAnswer": true,
  "explanation": "Signals enable zoneless change detection in Angular"
}

MULTI-SELECT:
{
  "type": "multi-select",
  "question": "Which of these are valid Angular lifecycle hooks?",
  "options": ["ngOnInit", "ngOnStart", "ngAfterViewInit", "ngBeforeDestroy", "ngOnDestroy"],
  "correctAnswers": [0, 2, 4],
  "explanation": "ngOnInit, ngAfterViewInit, and ngOnDestroy are valid hooks"
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
      const question = this.createQuestionFromParsed(parsed, difficulty);

      this.currentQuestion.set(question);
      this.questionStartTime = Date.now();
    } catch (error) {
      console.error('Error generating question:', error);
      alert('Failed to generate question. Please try again.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  private resetAnswers() {
    this.selectedAnswer.set(null);
    this.textAnswer.set('');
    this.sliderValue.set(0);
    this.trueFalseAnswer.set(null);
    this.confidenceLevel.set(50);
    this.selectedMultiple.set(new Set());
  }

  private createQuestionFromParsed(parsed: any, difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion {
    const baseQuestion = {
      id: crypto.randomUUID(),
      difficulty,
      question: parsed.question,
      explanation: parsed.explanation
    };

    switch (parsed.type) {
      case 'text-input':
        return {
          ...baseQuestion,
          type: 'text-input',
          correctAnswer: parsed.correctAnswer,
          acceptableAnswers: parsed.acceptableAnswers || [parsed.correctAnswer],
          caseSensitive: parsed.caseSensitive ?? false
        } as TextInputQuestion;

      case 'slider':
        this.sliderValue.set(parsed.min + (parsed.max - parsed.min) / 2); // Set to middle
        return {
          ...baseQuestion,
          type: 'slider',
          min: parsed.min,
          max: parsed.max,
          correctAnswer: parsed.correctAnswer,
          tolerance: parsed.tolerance,
          unit: parsed.unit || ''
        } as SliderQuestion;

      case 'true-false-confidence':
        return {
          ...baseQuestion,
          type: 'true-false-confidence',
          correctAnswer: parsed.correctAnswer
        } as TrueFalseConfidenceQuestion;

      case 'multi-select':
        return {
          ...baseQuestion,
          type: 'multi-select',
          options: parsed.options,
          correctAnswers: parsed.correctAnswers
        } as MultiSelectQuestion;

      case 'multiple-choice':
      default:
        return {
          ...baseQuestion,
          type: 'multiple-choice',
          options: parsed.options,
          correctAnswer: parsed.correctAnswer
        } as MultipleChoiceQuestion;
    }
  }

  private getRecentQuestionTypes(): string[] {
    return this.results()
      .slice(-3)
      .map(r => r.questionType);
  }

  async submitAnswer() {
    const question = this.currentQuestion();
    if (!question) return;

    const { userAnswer, isCorrect } = this.validateAnswer(question);
    if (userAnswer === null) return; // No answer provided

    const timeTaken = Math.round((Date.now() - this.questionStartTime) / 1000);

    const result: QuizResult = {
      questionId: question.id,
      correct: isCorrect,
      userAnswer,
      timeTaken,
      questionType: question.type
    };

    this.results.update(results => [...results, result]);

    // Show brief feedback before next question
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate next question
    await this.generateQuestion();
  }

  private validateAnswer(question: QuizQuestion): { userAnswer: any; isCorrect: boolean } {
    switch (question.type) {
      case 'multiple-choice': {
        const answer = this.selectedAnswer();
        if (answer === null) return { userAnswer: null, isCorrect: false };
        return {
          userAnswer: answer,
          isCorrect: answer === question.correctAnswer
        };
      }

      case 'text-input': {
        const answer = this.textAnswer().trim();
        if (!answer) return { userAnswer: null, isCorrect: false };

        const compareAnswer = question.caseSensitive ? answer : answer.toLowerCase();
        const acceptableAnswers = question.acceptableAnswers || [question.correctAnswer];
        const isCorrect = acceptableAnswers.some(acceptable => {
          const compareAcceptable = question.caseSensitive ? acceptable : acceptable.toLowerCase();
          return compareAnswer === compareAcceptable;
        });

        return { userAnswer: answer, isCorrect };
      }

      case 'slider': {
        const answer = this.sliderValue();
        const difference = Math.abs(answer - question.correctAnswer);
        const isCorrect = difference <= question.tolerance;
        return { userAnswer: answer, isCorrect };
      }

      case 'true-false-confidence': {
        const answer = this.trueFalseAnswer();
        if (answer === null) return { userAnswer: null, isCorrect: false };

        const confidence = this.confidenceLevel();
        const isCorrect = answer === question.correctAnswer;

        return {
          userAnswer: { answer, confidence },
          isCorrect
        };
      }

      case 'multi-select': {
        const selected = Array.from(this.selectedMultiple());
        if (selected.length === 0) return { userAnswer: null, isCorrect: false };

        const correctSet = new Set(question.correctAnswers);
        const isCorrect = selected.length === correctSet.size &&
                         selected.every(idx => correctSet.has(idx));

        return { userAnswer: selected, isCorrect };
      }

      default:
        return { userAnswer: null, isCorrect: false };
    }
  }

  toggleMultiSelect(index: number) {
    this.selectedMultiple.update(set => {
      const newSet = new Set(set);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }

  canSubmit(): boolean {
    const question = this.currentQuestion();
    if (!question) return false;

    switch (question.type) {
      case 'multiple-choice':
        return this.selectedAnswer() !== null;
      case 'text-input':
        return this.textAnswer().trim().length > 0;
      case 'slider':
        return true; // Always can submit slider
      case 'true-false-confidence':
        return this.trueFalseAnswer() !== null;
      case 'multi-select':
        return this.selectedMultiple().size > 0;
      default:
        return false;
    }
  }

  getQuestionTypeIcon(type: QuestionType): string {
    switch (type) {
      case 'multiple-choice': return '🎯';
      case 'text-input': return '⌨️';
      case 'slider': return '🎚️';
      case 'true-false-confidence': return '🤔';
      case 'multi-select': return '☑️';
      default: return '❓';
    }
  }

  getQuestionTypeLabel(type: QuestionType): string {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'text-input': return 'Type Answer';
      case 'slider': return 'Estimate Value';
      case 'true-false-confidence': return 'True/False';
      case 'multi-select': return 'Select All';
      default: return 'Unknown';
    }
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
