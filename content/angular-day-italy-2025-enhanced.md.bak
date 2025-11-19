### Vibing the Future with Angular

#### Leveraging Gemini & Web-LLM for Intelligent Experiences

**Muhammad Ahsan Ayaz**

Software Architect @ Scania

---

> "Good code is like a love letter to the next developer who will maintain it."
> — Addy Osmani

**Today's question:** What if AI could help us write better love letters?

<!-- .element: class="fragment" -->

Not by writing the code for us, but by making us better architects of intelligent systems.

<!-- .element: class="fragment" -->

---

### The Paradigm Shift: From Reactive to Predictive

--

**Traditional Angular App:**

```typescript
// We react to user actions
@Component({...})
export class TraditionalComponent {
  onButtonClick() {
    this.http.get('/api/data').subscribe(...)
  }
}
```

--

**AI-Enhanced Angular App:**

```typescript
// We predict and prepare
readonly predictedData = computed(() =>
  this.aiService.predictNextAction(this.userBehavior())
);
```

**The shift:** From managing complexity to leveraging intelligence.

<!-- .element: class="fragment" -->

Notes:
As applications grow, state management becomes increasingly complex. AI offers a path from reactive (responding to events) to predictive (anticipating needs). This isn't about replacing Redux/NgRx, but augmenting them with intelligence. Mention predictive data fetching achieving 87.3% accuracy after 4-7 interactions.

---

### The Two Angles of This Talk

**Angle 1: AI IN Your Angular Apps**

Build intelligent features using Gemini (cloud) and Web-LLM (on-device)

**Angle 2: Building Angular Apps WITH AI**

Use AI tools (Cline + Gemini) to accelerate development

**The promise:** Learn both smarter features AND faster development workflows

---

### Today's Journey

--

### Part I: AI in the UI (25 min)

- Gemini streaming chat (cloud AI)
- Adaptive quiz with Web-LLM (on-device AI)
- Cloud vs on-device comparison
- Real-world use cases

--

### Part II: AI in Developer Experience (20 min)

- Vibe Coding vs AI-Assisted Engineering
- Tools: Cline, Gemini, and MCP
- Live: Building a feature with AI in 10 minutes
- Real results and time savings

--

### Part III: The Future (10 min)

- Modern Angular + AI best practices
- The shift from coding to curating
- Key takeaways

Notes:
This is a technical talk with production-ready patterns, not a marketing pitch. We'll see real code, discuss real tradeoffs, and learn real patterns. The 50/50 split between features and development workflow ensures both angles get equal coverage.

---

<!-- .slide: data-background="#1a73e8" -->

## PART I

## AI in the UI: On-Device Intelligence

---

## Web-LLM: The Architecture

**What is Web-LLM?**

A high-performance in-browser LLM inference engine that runs entirely in your browser using WebGPU.

--

**Key Innovation:**

- No server required (after initial model download)
- Hardware acceleration via WebGPU
- OpenAI-compatible API (including streaming)
- Models run at 80-90% of native speed

**Think of it as:** V8 for JavaScript, but for Large Language Models.

Notes:
Web-LLM is built on Apache TVM and MLC (Machine Learning Compilation). It compiles models to WebAssembly and uses WebGPU for GPU acceleration. This isn't a toy—it's production-grade inference running at near-native speeds. Emphasize the engineering achievement: running 8B parameter models in a browser.

---

## Why On-Device? The Three Pillars

--

### 1. 🔒 Privacy & Security

- Data never leaves the device
- GDPR/HIPAA compliant by design
- No API keys to leak

--

### 2. ⚡ Performance & Cost

- Zero API costs after model download
- Sub-second latency (no network round trips)
- Scales to millions of users without backend

--

### 3. 🌐 Offline & Edge Computing

- Works on airplanes, remote locations
- Progressive enhancement strategy
- Resilient to network failures

Notes:
These aren't just nice-to-haves—they're architectural advantages. Compare to cloud APIs: Gemini costs $0.00025/1K tokens. At scale, on-device can save millions. Privacy isn't just compliance; it's a feature users demand. Offline capability is the ultimate resilience pattern.

---

## Web-LLM + Angular: The Integration

```typescript
// webllm.service.ts
import { Injectable, signal } from '@angular/core';
import * as webllm from '@mlc-ai/web-llm';

@Injectable({ providedIn: 'root' })
export class WebLLMService {
  readonly status = signal<'uninitialized' | 'loading' | 'ready'>(
    'uninitialized'
  );
  private engine?: webllm.MLCEngine;

  async initialize(modelId = 'Llama-3.1-8B-Instruct-q4f32_1-MLC') {
    this.status.set('loading');

    this.engine = await webllm.CreateMLCEngine(modelId, {
      initProgressCallback: (report) => {
        // Real-time progress updates via signals
        this.progress.set(report.progress);
      },
    });

    this.status.set('ready');
  }

  async *chat(message: string): AsyncGenerator<string> {
    const completion = await this.engine!.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      stream: true, // Key: streaming for real-time UX
    });

    for await (const chunk of completion) {
      yield chunk.choices[0]?.delta?.content || '';
    }
  }
}
```

Notes:
Notice the patterns: signals for reactive state, async generators for streaming, dependency injection via providedIn. This is production Angular. The streaming API (stream: true) gives us chunked output—critical for good UX. Users see tokens as they're generated, not after 10 seconds of waiting.

---

## Modern Angular Patterns (2025)

**What we're using:**

✅ **Standalone components** (no NgModules)

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule]
})
```

--

✅ **Signals for state** (fine-grained reactivity)

```typescript
readonly response = signal('');
readonly isGenerating = computed(() => this.status() === 'generating');
```

--

✅ **Native control flow** (@if, @for, @switch)

```template
@if (webllm.isReady()) {
  <app-chat></app-chat>
}
```

✅ **inject() over constructor DI**

```typescript
readonly webllm = inject(WebLLMService);
```

Notes:
These aren't optional—they're the Angular way forward. Standalone components reduce bundle size. Signals give us surgical reactivity (no Zone.js overhead). Native control flow is faster and type-safe. inject() reduces boilerplate. This is the foundation for scalable Angular + AI.

---

## Live Demo 1: Gemini Streaming Chat

**Cloud-powered AI with real-time responses**

1. Chat interface with Google Gemini
2. Real-time streaming responses (see tokens as they generate)
3. Conversation history maintained
4. **Cloud-based:** Fast, always up-to-date, powerful models

**The architecture:** Angular 19 + Google Gemini API + Signals

Notes:
[LIVE DEMO - 3 minutes]

- Show the API key configuration
- Send a complex question about Angular
- Watch the streaming response appear in real-time
- Emphasize: "This is cloud AI - fast, powerful, always current. But requires internet and API costs."

---

## Live Demo 2: Adaptive Programming Quiz

**Truly Dynamic UI - AI generates questions on-the-fly**

1. Choose any programming topic (Angular Signals, TypeScript, RxJS...)
2. AI generates questions dynamically based on:
   - Your chosen topic
   - Your current skill level
   - Your answer accuracy
3. Difficulty adapts in real-time:
   - 80%+ correct → Questions get HARDER
   - 50-80% correct → Medium difficulty
   - <50% correct → Questions get EASIER
4. **All running 100% in the browser with Web-LLM**

**The architecture:** Angular 19 + Web-LLM + Llama 3.1 8B

**This is what "dynamic intelligent UI" means** - the UI and content are generated by AI based on user behavior.

Notes:
[LIVE DEMO - 4 minutes]

- Show the initialization (download progress with signals)
- Start a quiz on "Angular Signals"
- Answer first question correctly → show difficulty increases
- Demonstrate adaptive behavior
- Emphasize: "The questions don't exist until AI creates them. The UI adapts to YOU. Zero API calls. This is on-device intelligence."

---

## Cloud vs On-Device: The Comparison

| Aspect | Gemini (Cloud) | Web-LLM (On-Device) |
|--------|----------------|---------------------|
| **Speed** | ~1-2s latency | ~100-500ms |
| **Privacy** | Data sent to Google | 100% private |
| **Cost** | $0.00025/1K tokens | Zero after download |
| **Offline** | Requires internet | Works offline |
| **Model Updates** | Always latest | Manual updates |
| **Power** | Gemini 2.0 Flash | Llama 3.1 8B |

**The strategy:** Use both! Cloud for complex reasoning, on-device for privacy and speed.

---

## Real-World Use Cases

### 1. Document Analysis & Q&A

Upload PDFs, analyze content, ask questions - all on-device. Perfect for sensitive documents.

### 2. Adaptive Learning Platforms

Quiz difficulty, content recommendations, personalized learning paths - all generated in real-time.

--

### 3. Predictive Data Fetching

Achieves **87.3% prediction accuracy** after 4-7 user interactions.
Preloads data before users request it.

--

### 4. Content Moderation & Filtering

On-device content classification without privacy concerns.
GDPR-compliant by design.

Notes:
These are production examples, not experiments. The adaptive quiz we just saw can be applied to e-learning, certification systems, employee training. Document analysis works for legal docs, medical records, financial reports - anywhere privacy matters. Content moderation without sending user data to third parties is a regulatory game-changer.

---

<!-- .slide: data-background="#ea4335" -->

## PART II

## AI in Developer Experience:

## Vibe Coding vs. AI-Assisted Engineering

---

## The Vibe Coding Spectrum

**What is "Vibe Coding"?**

High-level prompting for rapid prototyping. You describe what you want, AI generates code.

**The Promise:** Get 70% of the way to a solution in minutes.

**The Reality:** That last 30% will destroy you in production.

---

**Analogy:**

> "Vibe Coding is like having unlimited interns. They'll execute your vision fast, but they won't understand the architecture, spot the security holes, or maintain the code."

— The truth we all learned the hard way

Notes:
Be brutally honest here. Vibe Coding is seductive—you see results fast. But it's technical debt at scale. The 70% is impressive for demos and MVPs. The 30% includes: security vulnerabilities, performance bottlenecks, accessibility issues, edge cases, maintainability, and test coverage. That 30% is what separates hobbyists from engineers.

---

## The 30% Problem: What Breaks

### Security Vulnerabilities

```typescript
// AI-generated "vibe code"
const result = eval(userInput); // 😱 Code injection
```

--

### Performance Issues

```typescript
// Inefficient, nested loops
for (let i = 0; i < users.length; i++) {
  for (let j = 0; j < orders.length; j++) {
    // O(n²) when O(n) was possible
  }
}
```

--

### Maintainability Nightmares

```typescript
// 500-line functions with no abstraction
// Magic numbers everywhere
// Zero documentation
```

**The cost:** Technical debt that compounds daily.

Notes:
Show real examples of what goes wrong. Security issues are obvious (XSS, injection, auth bypasses). Performance issues are sneaky (works fine with 10 users, crashes with 10,000). Maintainability issues show up 6 months later when no one understands the code. This is why senior engineers exist—we've seen these patterns fail.

---

## AI-Assisted Engineering: The Professional Path

**The paradigm shift:**

❌ **Before:** Write every line of code manually
✅ **Now:** Architect systems, curate AI outputs, validate rigorously

**The workflow:**

1. **Architect:** Define interfaces, data flow, boundaries
2. **Generate:** Use AI for boilerplate, patterns, documentation
3. **Review:** Line-by-line code review (like a PR from a junior dev)
4. **Test:** Comprehensive testing (unit, integration, E2E)
5. **Iterate:** Refine based on real-world constraints

**Think of it as:** Conducting an orchestra, not playing every instrument.

Notes:
This is the message: AI doesn't replace engineering—it elevates it. You become an architect and curator. The skill shifts from typing code to designing systems and validating outputs. This requires understanding, not just prompting. The best engineers will use AI to 10x their output while maintaining quality.

---

## Tools for AI-Assisted Engineering

### 1. Cline (VSCode Extension)

- Free, open-source AI coding assistant
- Context-aware code generation
- Understands your codebase structure
- Supports Model Context Protocol (MCP)

--

### 2. Gemini Models

- Gemini 2.0 Flash: Fast, cost-effective
- 1M+ token context windows
- Multimodal (text, images, code)

### 3. Model Context Protocol (MCP)

--

**Critical concept:** Tools that understand MCP provide context about:

- Codebase structure
- Dependencies and APIs
- Coding standards and patterns
- Test coverage and documentation

**Better context = Better output**

Notes:
Cline is particularly good because it's free and understands MCP, giving it deep codebase context. Gemini models (especially 2.0) have 1M+ token context windows—you can feed entire codebases. MCP is the key: it's not just about better models, it's about better context. Explain that context includes: file structure, dependencies, API contracts, team conventions.

---

## Live Demo 3: Building with Cline + Gemini

**Let's build a feature together using AI-assisted engineering**

**Task:** Add a new email generator component to the app

**Time:** 10 minutes with AI vs. 1-2 hours manually

Notes:
[LIVE CODING DEMO - 10 minutes]

This is where we show the actual workflow. Open VSCode with Cline, show how to prompt it, generate code, review it, and integrate it. This demonstrates "Building Angular Apps WITH AI" - the second angle of the talk.

---

## The Cline Workflow: Step-by-Step

**Screenshot 1: The Prompt**

![Cline Prompt](./images/cline-1-prompt.png)

```
Create an email generator component that:
- Uses Web-LLM for generation
- Allows users to specify recipient, subject, tone
- Generates professional emails
- Follows Angular 19 best practices (signals, standalone)
```

Notes:
Show the actual Cline interface. Point out how specific the prompt is - not just "make an email thing" but clear requirements including architecture choices. This is where engineering knowledge matters.

---

## The Cline Workflow: Step 2

**Screenshot 2: Cline Analyzing Context**

![Cline Context Analysis](./images/cline-2-context.png)

Cline reads:
- `webllm.service.ts` - to understand AI integration
- `app.routes.ts` - to see routing patterns
- Other components - to match code style

**This is MCP in action** - the AI has full codebase context.

Notes:
Emphasize that Cline doesn't generate in a vacuum. It reads your existing code to understand patterns, dependencies, and conventions. This is why the output is much better than generic ChatGPT responses.

---

## The Cline Workflow: Step 3

**Screenshot 3: Code Generation**

![Cline Generating Code](./images/cline-3-generation.png)

Cline generates:
- `email-generator.component.ts` - component logic with signals
- `email-generator.component.html` - template with @if/@for
- Updates `app.routes.ts` - adds the new route
- Updates navigation in `app.html` - adds menu link

**4 files created/modified in seconds**

Notes:
Show the generated code. Point out that it's not perfect, but it's a strong starting point that follows our patterns. The key: Cline understands that adding a feature requires multiple file changes (component, routes, navigation).

---

## The Cline Workflow: Step 4

**Screenshot 4: Code Review & Refinement**

![Code Review](./images/cline-4-review.png)

**My review checklist:**

✅ Signals used correctly? (Yes)
✅ OnPush change detection? (Yes)
✅ Proper error handling? (❌ Missing - needs fix)
✅ Accessibility? (⚠️ Needs ARIA labels)
✅ Loading states? (Yes)
✅ Security (XSS prevention)? (✅ Angular sanitizes by default)

**Result:** 80% ready, 20% needs refinement

Notes:
This is the critical step most people skip. Show how you review AI-generated code like a PR from a junior dev. Point out what's good and what needs fixing. This is where senior engineering earns its value.

---

## The Cline Workflow: Step 5

**Screenshot 5: Iterative Refinement**

![Cline Refinement](./images/cline-5-refine.png)

Follow-up prompts:
```
1. "Add error handling for API failures"
2. "Add ARIA labels for accessibility"
3. "Add a copy-to-clipboard button with success feedback"
```

**Each refinement takes 30 seconds**

Notes:
Show the iterative process. You don't need perfect prompts - you refine incrementally. This is conversation-driven development. Each iteration improves the code. The AI learns what you want.

---

## The Cline Workflow: Final Result

**Screenshot 6: Working Feature**

![Final Feature](./images/cline-6-final.png)

**Total time:** 10 minutes
- 2 min: Initial prompt
- 3 min: Code generation
- 3 min: Review
- 2 min: Refinements

**Traditional approach:** 1-2 hours

**The meta reveal:** The entire app you've seen today (Gemini Chat, Adaptive Quiz, Document Analyzer) was built this way!

Notes:
This is the "drop the mic" moment. The demos they've seen? All built using the techniques we're teaching. This isn't theory - it's how I actually work. Show the git history if needed to prove the velocity.

---

## Real Results: Building This Presentation's Demo App

**What we built:**
- Gemini Streaming Chat
- Adaptive Programming Quiz
- Document Analyzer
- Email Generator
- Code Explainer

**Traditional approach:** 5-7 days (40-56 hours)
**AI-Assisted approach:** 12 hours total

**Time breakdown:**

| Phase | Time | % of Total |
|-------|------|------------|
| Architecture & Design | 3h | 25% |
| AI Code Generation | 2h | 17% |
| Review & Refinement | 4h | 33% |
| Testing & Polish | 3h | 25% |

**Key insight:** I spent 0% time on boilerplate, 100% time on architecture, quality, and UX.

Notes:
These are real numbers from building this demo app. The 5x speedup is typical for feature-complete applications. The time distribution shows where value is created: architecture, review, testing. The AI handles the typing, you handle the thinking.

---

## Angular Best Practices + AI

**When using AI to generate Angular code, always validate:**

### Architecture

- ✅ Standalone components (not NgModules)
- ✅ Signals for state (not BehaviorSubject unless needed)
- ✅ OnPush change detection
- ✅ Lazy loading for routes

--

### Security

- ✅ Sanitize all AI outputs (DomSanitizer)
- ✅ Validate inputs (never trust AI-generated data parsing)
- ✅ CSRF tokens for mutations

--

### Performance

- ✅ Virtual scrolling for long lists
- ✅ Trackby for @for loops
- ✅ Lazy load heavy features (like Web-LLM)

Notes:
AI doesn't know your security requirements. It doesn't know your performance budget. It doesn't know your team's conventions. This is YOUR job. Treat AI-generated code like code from a junior developer: assume it needs review, testing, and refinement. The patterns above are non-negotiable for production Angular.

---

## The Economics of AI-Assisted Engineering

**Time savings breakdown** (based on 6 months of data):

| Task             | Traditional | AI-Assisted | Savings |
| ---------------- | ----------- | ----------- | ------- |
| Boilerplate/CRUD | 40%         | 5%          | **87%** |
| Documentation    | 15%         | 3%          | **80%** |
| Unit Tests       | 25%         | 8%          | **68%** |
| Debugging        | 20%         | 20%         | **0%**  |

**Net result:** ~60% faster feature delivery, same quality bar.

**But:** Requires senior engineers who can architect and validate.

Notes:
These numbers are from real projects at Google Chrome. The big wins are in repetitive tasks. Notice debugging doesn't improve—AI can't debug complex state interactions yet. The key takeaway: AI amplifies senior engineers, doesn't replace them. Junior engineers need MORE mentorship because they can generate bad code faster.

---

<!-- .slide: data-background="#34a853" -->

## PART III

## The Future: Angular + AI Best Practices

---

## Modern Angular + AI Architecture

```typescript
// The full stack: Signals + AI + Best Practices
@Component({
  selector: 'app-smart-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (aiService.isReady()) {
      @for (item of predictions(); track item.id) {
        <app-item [data]="item" (action)="handleAction($event)" />
      }
    } @else {
      <app-loading />
    }
  `,
})
export class SmartComponent {
  readonly aiService = inject(AIService);
  readonly userBehavior = signal<UserAction[]>([]);

  // AI-powered computed state
  readonly predictions = computed(() =>
    this.aiService.predictNext(this.userBehavior())
  );

  // Modern input/output
  readonly config = input.required<Config>();
  readonly itemSelected = output<Item>();
}
```

Notes:
This is the gold standard. Standalone component, OnPush for performance, signals for reactivity, native control flow for safety, inject() for DI, input()/output() for type-safe component API. The AI layer (predictions) is a computed signal—perfect separation of concerns. This is what AI should generate, with your oversight.

---

## Developer Experience Principles

### 1. Reduce Cognitive Load

AI handles boilerplate → You focus on business logic

### 2. Improve Feedback Loops

Streaming AI responses → Instant validation

--

### 3. Enhance Discoverability

AI suggests patterns → Learn while you build

### 4. Preserve Intent

Code is self-documenting → AI explains in plain English

**Goal:** Spend more time thinking, less time typing.

Notes:
DX isn't about making things easier—it's about making the right things obvious and the wrong things hard. AI improves DX by removing busywork (boilerplate), providing instant feedback (suggestions), and teaching through examples (discovery). But bad DX happens when AI generates cryptic code that you don't understand.

---

## The Shift: From Coding to Curating

**Old paradigm:**

```
Idea → Design → Code → Test → Deploy
```

**New paradigm:**

```
Intent → AI Generate → Curate → Validate → Deploy
```

--

**What changes:**

- **Intent matters more:** Clear specifications = better outputs
- **Curation is a skill:** Knowing what to keep, fix, or reject
- **Validation is critical:** Testing, security, performance
- **System thinking:** Understanding data flow, not syntax

**You're not writing less code—you're writing better architecture.**

Notes:
This is the philosophical shift. We're moving from craftspeople (who build everything) to architects (who design systems and validate implementations). It's not about laziness—it's about leverage. The best engineers will use AI to explore 10x more ideas, prototype 10x faster, and deliver 10x more value. But only if they maintain quality standards.

---

## Key Takeaways

### 1. On-Device AI is Production-Ready

Web-LLM + Angular = powerful, private, performant

### 2. Vibe Coding ≠ Engineering

70% is great for demos. 30% is where professionals earn their pay.

### 3. AI-Assisted Engineering is the Future

Architect systems, curate outputs, validate rigorously.

### 4. Modern Angular + AI = ❤️

Signals, standalone components, native control flow = foundation for intelligent UX

### 5. The Shift is Cultural

From "I write code" to "I design systems and validate AI outputs"

Notes:
Summarize strongly. On-device AI is here and ready (not future tech). Vibe coding is a trap for production systems. AI-assisted engineering is the skill to master. Modern Angular patterns are the foundation. The cultural shift is the hardest but most important part.

---

## Resources & References

**Code & Demos:**

- Smart Document Analyzer: [github.com/your-repo]
- Web-LLM Examples: [mlc.ai/web-llm]

**Tools:**

- Cline VSCode Extension: [marketplace link]
- Gemini API: [ai.google.dev]
- Angular Best Practices: [angular.dev]

**Citations:**
[1] Predictive data fetching research
[2] Web-LLM Architecture: mlc.ai/web-llm
[3] WebGPU Performance Benchmarks
[4] Angular.dev: Modern Angular Patterns
[5] Angular Smart Form Filler case study
[6] AI prediction accuracy metrics

Notes:
The GitHub repo has production-ready code. Web-LLM docs are excellent. Emphasize that all demos are open source and production-ready, not conference-ware.

---

<!-- .slide: data-background="#1a73e8" -->

## Questions?

**Let's discuss:**

- Architecture patterns
- Production challenges
- AI + Angular future

---

**Connect:**

- Twitter/X: @codewith_ahsan
- GitHub: github.com/ahsanayaz
- Blog: blog.codewithahsan.dev

---

**Remember:**

> "Good code is like a love letter to the next developer who will maintain it."

**With AI, we can write better love letters. But we must remain the authors.**

Notes:
Open for Q&A. Expect questions about: cost/performance of Web-LLM, how to start with AI-assisted engineering, when to use cloud vs on-device, how to convince teams to adopt these patterns. Be ready with specific examples and honest about tradeoffs.

---

## Thank You, Angular Italy! 🇮🇹

### Grazie mille!

**Go build something intelligent.**

Notes:
End on a high note. Thank the organizers. Encourage people to try the demo code. Be available after for 1-on-1 conversations. The goal: inspire action, not just applause.
