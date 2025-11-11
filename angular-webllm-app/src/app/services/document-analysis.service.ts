import { Injectable, signal } from '@angular/core';
import { WebLLMService } from './webllm.service';

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  analysis?: DocumentAnalysis;
}

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  wordCount: number;
  readingTime: number; // minutes
}

export interface QAMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}

/**
 * Document Analysis Service
 * Manages documents and provides AI-powered analysis capabilities
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentAnalysisService {
  // State
  readonly documents = signal<Document[]>([]);
  readonly currentDocument = signal<Document | null>(null);
  readonly qaHistory = signal<QAMessage[]>([]);
  readonly isAnalyzing = signal(false);

  constructor(private webllm: WebLLMService) {}

  /**
   * Add a new document
   */
  addDocument(title: string, content: string): Document {
    const doc: Document = {
      id: crypto.randomUUID(),
      title: title || 'Untitled Document',
      content,
      createdAt: new Date(),
    };

    this.documents.update(docs => [...docs, doc]);
    this.currentDocument.set(doc);
    this.qaHistory.set([]);

    return doc;
  }

  /**
   * Select a document
   */
  selectDocument(docId: string): void {
    const doc = this.documents().find(d => d.id === docId);
    if (doc) {
      this.currentDocument.set(doc);
      this.qaHistory.set([]);
    }
  }

  /**
   * Delete a document
   */
  deleteDocument(docId: string): void {
    this.documents.update(docs => docs.filter(d => d.id !== docId));

    if (this.currentDocument()?.id === docId) {
      const remainingDocs = this.documents();
      this.currentDocument.set(remainingDocs[0] || null);
      this.qaHistory.set([]);
    }
  }

  /**
   * Analyze a document with AI
   */
  async *analyzeDocument(doc: Document): AsyncGenerator<Partial<DocumentAnalysis>> {
    this.isAnalyzing.set(true);

    try {
      // Calculate basic stats
      const wordCount = doc.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

      yield { wordCount, readingTime };

      // Generate summary
      const summaryPrompt = `Analyze the following document and provide a concise 2-3 sentence summary:

Document Title: ${doc.title}
Content:
${doc.content}

Provide ONLY the summary, no additional text.`;

      let summary = '';
      for await (const chunk of this.webllm.generateStream(summaryPrompt)) {
        summary += chunk;
        yield { summary, wordCount, readingTime };
      }

      // Extract key points
      const keyPointsPrompt = `Extract 3-5 key points from this document. Return ONLY a JSON array of strings:

${doc.content}

Format: ["point 1", "point 2", "point 3"]`;

      let keyPointsText = '';
      for await (const chunk of this.webllm.generateStream(keyPointsPrompt)) {
        keyPointsText += chunk;
      }

      let keyPoints: string[] = [];
      try {
        // Try to parse as JSON
        keyPoints = JSON.parse(keyPointsText.trim());
      } catch {
        // Fallback: split by newlines and filter
        keyPoints = keyPointsText
          .split('\n')
          .map(line => line.replace(/^[-•*]\s*/, '').trim())
          .filter(line => line.length > 0)
          .slice(0, 5);
      }

      yield { summary, keyPoints, wordCount, readingTime };

      // Analyze sentiment
      const sentimentPrompt = `Analyze the sentiment of this text. Respond with ONLY ONE WORD: positive, neutral, or negative.

${doc.content}`;

      let sentimentText = '';
      for await (const chunk of this.webllm.generateStream(sentimentPrompt)) {
        sentimentText += chunk;
      }

      const sentiment = sentimentText.toLowerCase().includes('positive')
        ? 'positive'
        : sentimentText.toLowerCase().includes('negative')
        ? 'negative'
        : 'neutral';

      yield { summary, keyPoints, sentiment, wordCount, readingTime };

      // Extract topics
      const topicsPrompt = `Identify 3-5 main topics in this document. Return ONLY a JSON array of topic names:

${doc.content}

Format: ["topic 1", "topic 2", "topic 3"]`;

      let topicsText = '';
      for await (const chunk of this.webllm.generateStream(topicsPrompt)) {
        topicsText += chunk;
      }

      let topics: string[] = [];
      try {
        topics = JSON.parse(topicsText.trim());
      } catch {
        topics = topicsText
          .split('\n')
          .map(line => line.replace(/^[-•*]\s*/, '').trim())
          .filter(line => line.length > 0)
          .slice(0, 5);
      }

      const analysis: DocumentAnalysis = {
        summary,
        keyPoints,
        sentiment,
        topics,
        wordCount,
        readingTime
      };

      // Update document with analysis
      this.documents.update(docs =>
        docs.map(d => d.id === doc.id ? { ...d, analysis } : d)
      );

      if (this.currentDocument()?.id === doc.id) {
        this.currentDocument.update(current =>
          current ? { ...current, analysis } : null
        );
      }

      yield analysis;
    } finally {
      this.isAnalyzing.set(false);
    }
  }

  /**
   * Ask a question about the current document
   */
  async *askQuestion(question: string): AsyncGenerator<string> {
    const doc = this.currentDocument();
    if (!doc) {
      throw new Error('No document selected');
    }

    const systemPrompt = `You are a helpful AI assistant analyzing a document. Answer questions based ONLY on the document content. If the answer is not in the document, say so.

Document Title: ${doc.title}
Document Content:
${doc.content}`;

    let answer = '';
    for await (const chunk of this.webllm.chat(question, {
      systemPrompt,
      includeHistory: true,
      temperature: 0.3, // Lower temperature for more factual answers
    })) {
      answer += chunk;
      yield chunk;
    }

    // Add to Q&A history
    const qaMessage: QAMessage = {
      id: crypto.randomUUID(),
      question,
      answer,
      timestamp: new Date(),
    };

    this.qaHistory.update(history => [...history, qaMessage]);
  }

  /**
   * Clear Q&A history
   */
  clearQAHistory(): void {
    this.qaHistory.set([]);
    this.webllm.clearHistory();
  }

  /**
   * Get all documents
   */
  getDocuments(): Document[] {
    return this.documents();
  }

  /**
   * Export document as text
   */
  exportDocument(doc: Document): string {
    let output = `# ${doc.title}\n\n`;
    output += `Created: ${doc.createdAt.toLocaleString()}\n\n`;
    output += `## Content\n\n${doc.content}\n\n`;

    if (doc.analysis) {
      output += `## Analysis\n\n`;
      output += `**Summary:** ${doc.analysis.summary}\n\n`;
      output += `**Key Points:**\n`;
      doc.analysis.keyPoints.forEach(point => {
        output += `- ${point}\n`;
      });
      output += `\n**Topics:** ${doc.analysis.topics.join(', ')}\n`;
      output += `**Sentiment:** ${doc.analysis.sentiment}\n`;
      output += `**Word Count:** ${doc.analysis.wordCount}\n`;
      output += `**Reading Time:** ${doc.analysis.readingTime} minutes\n`;
    }

    return output;
  }
}
