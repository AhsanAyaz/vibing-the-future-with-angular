import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebLLMService } from './services/webllm.service';
import { DocumentAnalysisService } from './services/document-analysis.service';
import { DocumentAnalyzerComponent } from './components/document-analyzer/document-analyzer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DocumentAnalyzerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = 'Smart Document Analyzer';

  readonly webllm = inject(WebLLMService);
  readonly docService = inject(DocumentAnalysisService);

  readonly showInitializer = computed(() => !this.webllm.isReady());

  ngOnInit() {
    // Auto-initialize with default model
    // You can change this to manual initialization if preferred
  }

  async initializeModel() {
    try {
      await this.webllm.initialize();
    } catch (error) {
      console.error('Failed to initialize model:', error);
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }
}
