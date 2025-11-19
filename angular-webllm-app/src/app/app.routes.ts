import { Routes } from '@angular/router';
import { GeminiChatComponent } from './components/gemini-chat/gemini-chat.component';
import { DocumentAnalyzerComponent } from './components/document-analyzer/document-analyzer.component';
import { AdaptiveQuizComponent } from './components/adaptive-quiz/adaptive-quiz.component';
import { SmartFormComponent } from './components/smart-form/smart-form.component';
import { CodeExplainerComponent } from './components/code-explainer/code-explainer.component';
import { EmailGeneratorComponent } from './components/email-generator/email-generator.component';

export const routes: Routes = [
  { path: 'gemini-chat', component: GeminiChatComponent },
  { path: 'document-analyzer', component: DocumentAnalyzerComponent },
  { path: 'adaptive-quiz', component: AdaptiveQuizComponent },
  { path: 'smart-form', component: SmartFormComponent },
  { path: 'code-explainer', component: CodeExplainerComponent },
  { path: 'email-generator', component: EmailGeneratorComponent },
];
