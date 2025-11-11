import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentAnalysisService, Document, DocumentAnalysis } from '../../services/document-analysis.service';
import { WebLLMService } from '../../services/webllm.service';

/**
 * DocumentAnalyzerComponent
 *
 * Production-grade Angular component demonstrating AI-assisted engineering patterns:
 * - Standalone architecture for optimal tree-shaking
 * - OnPush change detection for performance
 * - Signals for fine-grained reactivity
 * - Separation of concerns (UI vs business logic in services)
 *
 * This component showcases the "AI-Assisted Engineering" paradigm:
 * - Clear architecture (not just AI-generated code dumps)
 * - Proper error handling and loading states
 * - Type safety and validation
 */
@Component({
  selector: 'app-document-analyzer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-analyzer.component.html'
})
export class DocumentAnalyzerComponent {
  readonly docService = inject(DocumentAnalysisService);
  readonly webllm = inject(WebLLMService);

  // UI State
  readonly activeTab = signal<'documents' | 'analysis' | 'qa'>('documents');
  readonly isAddingDocument = signal(false);

  // Form inputs
  documentTitle = '';
  documentContent = '';

  // Analysis state
  readonly analysisProgress = signal<Partial<DocumentAnalysis> | null>(null);

  // Q&A state
  currentQuestion = '';
  readonly isAnswering = signal(false);
  readonly streamingAnswer = signal('');

  // File upload
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.docService.isLoadingFile.set(true);

    try {
      const file = input.files[0];
      const content = await file.text();

      this.documentTitle = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      this.documentContent = content;
      this.isAddingDocument.set(true);
    } catch (error) {
      console.error('Failed to read file:', error);
      alert('Failed to read file. Please try again.');
    } finally {
      this.docService.isLoadingFile.set(false);
      // Reset file input
      input.value = '';
    }
  }

  async addDocument() {
    if (!this.documentContent.trim()) return;

    await this.docService.addDocument(this.documentTitle, this.documentContent);
    this.documentTitle = '';
    this.documentContent = '';
    this.isAddingDocument.set(false);
    this.activeTab.set('analysis');
  }

  cancelAdd() {
    this.documentTitle = '';
    this.documentContent = '';
    this.isAddingDocument.set(false);
  }

  selectDocument(docId: string) {
    this.docService.selectDocument(docId);
    this.activeTab.set('analysis');
  }

  async deleteDocument(docId: string, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      await this.docService.deleteDocument(docId);
    }
  }

  async analyzeCurrentDocument() {
    const doc = this.docService.currentDocument();
    if (!doc) return;

    this.analysisProgress.set(null);

    try {
      for await (const progress of this.docService.analyzeDocument(doc)) {
        this.analysisProgress.set(progress);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze document. Please try again.');
    }
  }

  async askQuestion() {
    if (!this.currentQuestion.trim() || this.isAnswering()) return;

    const question = this.currentQuestion;
    this.currentQuestion = '';
    this.isAnswering.set(true);
    this.streamingAnswer.set('');

    try {
      for await (const chunk of this.docService.askQuestion(question)) {
        this.streamingAnswer.update(current => current + chunk);
      }
    } catch (error) {
      console.error('Q&A error:', error);
      alert('Failed to answer question. Please try again.');
    } finally {
      this.isAnswering.set(false);
      this.streamingAnswer.set('');
    }
  }

  clearQAHistory() {
    if (confirm('Clear all Q&A history?')) {
      this.docService.clearQAHistory();
    }
  }

  exportDocument(doc: Document) {
    const content = this.docService.exportDocument(doc);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getSentimentColor(sentiment: string): string {
    switch (sentiment) {
      case 'positive': return 'green';
      case 'negative': return 'red';
      default: return 'gray';
    }
  }

  getSentimentEmoji(sentiment: string): string {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getWordCount(text: string): number {
    return text.split(/\s+/).filter(w => w.trim()).length;
  }
}
