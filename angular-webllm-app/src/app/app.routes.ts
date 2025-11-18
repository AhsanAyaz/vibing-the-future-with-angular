import { Routes } from '@angular/router';
import { DocumentAnalyzerComponent } from './components/document-analyzer/document-analyzer.component';
import { SmartFormComponent } from './components/smart-form/smart-form.component';
import { CodeExplainerComponent } from './components/code-explainer/code-explainer.component';
import { EmailGeneratorComponent } from './components/email-generator/email-generator.component';

export const routes: Routes = [
  { path: 'document-analyzer', component: DocumentAnalyzerComponent },
  { path: 'smart-form', component: SmartFormComponent },
  { path: 'code-explainer', component: CodeExplainerComponent },
  { path: 'email-generator', component: EmailGeneratorComponent },
];
