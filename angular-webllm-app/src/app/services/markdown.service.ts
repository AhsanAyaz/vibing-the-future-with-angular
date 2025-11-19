import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

/**
 * Markdown Service
 *
 * Converts markdown text to safe HTML for rendering AI-generated content
 * with proper formatting (bold, italic, lists, code blocks, etc.)
 */
@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  private sanitizer = inject(DomSanitizer);

  constructor() {
    // Configure marked for better rendering
    marked.setOptions({
      breaks: true, // Convert \n to <br>
      gfm: true, // GitHub Flavored Markdown
    });
  }

  /**
   * Convert markdown to safe HTML
   * @param markdown The markdown text to convert
   * @returns Safe HTML string that can be used with [innerHTML]
   */
  toHtml(markdown: string): SafeHtml {
    if (!markdown) return '';

    const html = marked.parse(markdown, { async: false }) as string;
    return this.sanitizer.sanitize(1, html) || '';
  }
}
