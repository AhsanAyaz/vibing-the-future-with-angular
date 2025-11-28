---
marp: true
theme: default
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
style: |
  section {
    font-family: 'Arial', sans-serif;
  }
  h1 {
    color: #dd0031;
  }
  h2 {
    color: #c3002f;
  }
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  code {
    background: #f4f4f4;
  }
---

<!-- _class: lead -->

# 🎵 Vibing the Future with Angular

## Leveraging Gemini & Web-LLM for Intelligent Experiences

**Angular Day Italy 2025**

---

<!-- _class: lead -->

# 👋 Hi, I'm [Your Name]

Software Architect | Angular Enthusiast | AI Explorer

_"I write code that sometimes works on the first try... sometimes."_

---

# 🤔 Quick Question

**Who here has:**

- ✅ Used ChatGPT to debug code?
- ✅ Asked AI to explain a complex concept?
- ✅ Let AI write commit messages? (No judgment!)

**Today:** Let's bring that intelligence INTO your Angular apps! 🚀

---

# 🎯 What We'll Cover Today

<div class="columns">
<div>

## Part 1: AI in Your App

- 🤖 Google Gemini + Angular
- 💻 Web-LLM (On-device AI)
- 💬 Live Chat Demo

</div>
<div>

## Part 2: AI as Your Copilot

- ⚡ "Vibe Coding" workflow
- 🛠️ VSCode + Cline/Gemini
- 🎨 Smarter development

</div>
</div>

---

<!-- _class: lead -->

# Part 1

## 🤖 AI-Powered Angular Apps

_"Making your app smarter than your average developer"_
_(Just kidding, you're all brilliant)_ 😄

---

# 🌐 The Intelligent Web is HERE

Traditional Web Apps:

```
User Input → Static Logic → Predictable Output
```

**Intelligent Web Apps:**

```
User Input → AI Processing → Dynamic, Contextual Output
```

**The difference?** Your app can understand, reason, and create!

---

# 🎯 Why Angular + AI?

<div class="columns">
<div>

## Angular Brings:

- 🏗️ Solid architecture
- 🔄 Reactive patterns (RxJS)
- 🎨 Component-based UI
- 💪 TypeScript safety

</div>
<div>

## AI Adds:

- 🧠 Intelligence layer
- 🎨 Dynamic content
- 💬 Natural interaction
- ✨ Personalization

</div>
</div>

**Together?** 🔥 Unstoppable!

---

# 🚀 Option 1: Google Gemini

**Cloud-based AI** with massive capabilities

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const result = await model.generateContent('Explain Angular signals');
console.log(result.response.text());
```

**Pros:** Powerful, constantly improving, multimodal
**Cons:** Requires internet, API costs, latency

---

# 💻 Option 2: Web-LLM

**On-device AI** running in the browser! 🤯

```typescript
import { CreateMLCEngine } from '@mlc-ai/web-llm';

const engine = await CreateMLCEngine('Llama-3.1-8B-Instruct');

const reply = await engine.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(reply.choices[0].message.content);
```

**Pros:** Privacy, offline, no API costs
**Cons:** Initial download, limited by device

---

# 🎭 The Best of Both Worlds

```typescript
@Injectable()
export class AIService {
  private useWebLLM = navigator.onLine === false;

  async chat(message: string) {
    return this.useWebLLM ? this.webLLMChat(message) : this.geminiChat(message);
  }
}
```

**Strategy:** Gemini for power, Web-LLM for privacy/offline

---

<!-- _class: lead -->

# 💬 Demo Time!

## Streaming Chat with Angular + Gemini

_"Live demos: where everything works perfectly..."_
_"...said no developer ever"_ 😅

---

# 🎬 Streaming Chat Architecture

```typescript
@Component({
  selector: 'app-chat',
  template: `
    <div class="messages">
      @for (msg of messages(); track msg.id) {
      <div class="message" [class.user]="msg.role === 'user'">
        {{ msg.content }}
      </div>
      }
    </div>
    <input [(ngModel)]="input" (keyup.enter)="send()" />
  `,
})
export class ChatComponent {
  messages = signal<Message[]>([]);

  async send() {
    // Coming up next...
  }
}
```

---

# 🎨 Practical Use Cases

<div class="columns">
<div>

## Customer-Facing

- 💬 Smart chatbots
- 🔍 Semantic search
- 📝 Content generation
- 🌍 Translation
- 📊 Data insights

</div>
<div>

## Internal Tools

- 📚 Documentation Q&A
- 🐛 Error explanation
- 💡 Code suggestions
- 📋 Form auto-fill
- 🎯 Smart filtering

</div>
</div>

---

<!-- _class: lead -->

# 💡 Demo: 4 Real-World Examples

## Built with Angular + Web-LLM

_All running 100% in your browser!_

---

# 📚 Demo 1: Document Analyzer

**What it does:**

- Upload any document (text, markdown, JSON)
- Get AI-powered summary and key points
- Analyze sentiment and extract topics
- Ask questions about the content

**Use cases:**

- Legal document review
- Research paper analysis
- Contract summarization
- Meeting notes processing

---

# 📝 Demo 2: Smart Form Assistant

**What it does:**

- Fill basic info (name, company, role)
- Click "AI Suggest" to auto-generate descriptions
- Get context-aware technical requirements

**Use cases:**

- Project proposals
- RFP responses
- Technical documentation
- Grant applications

**The magic:** AI understands context from previous fields!

---

# 💻 Demo 3: Code Explainer

**What it does:**

- Paste any code (JS, Python, TypeScript, etc.)
- Choose explanation level (beginner/intermediate/expert)
- Get step-by-step breakdown
- Identify potential issues and improvements

**Use cases:**

- Code review assistance
- Learning new languages
- Debugging complex code
- Documentation generation

---

# ✉️ Demo 4: Email Generator

**What it does:**

- Input recipient, subject, and key points
- Select tone (formal, friendly, casual, persuasive)
- Generate professional emails
- Refine with "make shorter," "more formal," etc.

**Use cases:**

- Client communications
- Internal announcements
- Sales outreach
- Support responses

**Time saved:** 5-10 minutes per email!

---

# ⚡ Performance Tips

```typescript
// 1. Lazy load AI libraries
const { GoogleGenerativeAI } = await import('@google/generative-ai');

// 2. Cache model instances
private modelCache = new Map<string, GenerativeModel>();

// 3. Debounce user input
readonly debouncedInput = toSignal(
  toObservable(this.userInput).pipe(debounceTime(300))
);

// 4. Use streaming for better UX
// (Users see results faster!)
```

---

<!-- _class: lead -->

# Part 2

## ⚡ AI-Powered Development

_"Vibe Coding: When you and AI become BFFs"_

---

# 🤝 What is "Vibe Coding"?

**Traditional Coding:**

```
Think → Code → Debug → Google → Stack Overflow → Cry → Repeat
```

**Vibe Coding:**

```
Think → Describe to AI → Review → Ship 🚀
```

**It's like pair programming, but your partner never needs coffee!** ☕

---

# 🛠️ Tools in Action: Cline + Gemini

**Cline (VSCode Extension):**

- 🤖 AI assistant in your editor
- 💬 Natural language commands
- 🔧 Automated refactoring
- 🧪 Test generation

```bash
# Install Cline
code --install-extension saoudrizwan.claude-dev

# Configure with Gemini API
```

---

# 💡 Real-World Vibe Coding Example

**You:** "Create an Angular service that caches API responses"

**AI:** Generates:

```typescript
@Injectable()
export class CachedHttpService {
  private cache = new Map<string, Observable<any>>();

  get<T>(url: string): Observable<T> {
    if (!this.cache.has(url)) {
      this.cache.set(url, this.http.get<T>(url).pipe(shareReplay(1)));
    }
    return this.cache.get(url)!;
  }
}
```

**Time saved:** 10+ minutes! ⏱️

---

# 🎯 My Vibe Coding Workflow

1. **🧠 Think:** What do I need?
2. **💬 Describe:** Tell AI in plain English
3. **👀 Review:** Check the generated code
4. **✏️ Refine:** Iterate with AI
5. **✅ Test:** Verify it works
6. **🚀 Ship:** Deploy with confidence

**Key:** AI is your assistant, not your replacement!

---

# 🎨 Creative AI Uses in Dev Workflow

<div class="columns">
<div>

## Code Tasks

- 🔄 Refactoring legacy code
- 📝 Writing tests
- 📖 Generating docs
- 🐛 Debugging errors
- 🎨 CSS/styling help

</div>
<div>

## Smart Tasks

- 📋 Commit messages
- 🔍 Code reviews
- 💡 Architecture suggestions
- 📚 Learning new APIs
- 🌍 i18n translations

</div>
</div>

---

# ⚠️ The "Vibe Check" - When to Trust AI

✅ **Trust more:**

- Boilerplate code
- Standard patterns
- Unit tests
- Documentation
- Simple utilities

❌ **Review carefully:**

- Security code
- Performance-critical paths
- Complex business logic
- Database migrations
- Third-party integrations

---

# 🎓 Learning with AI

**Old way:** Search docs → Read for 30 min → Still confused

**New way:**

```
You: "Explain Angular standalone components like
      I'm explaining it to my grandma"

AI: "Imagine components are like LEGO blocks.
     Before, you needed a big box (NgModule) to
     organize them. Now, each block can work on
     its own - grab and play! 🧱"
```

**AI is your patient teacher!** 👨‍🏫

---

# 📊 Productivity Gains

Based on my experience:

- ⏱️ **40% faster** for CRUD operations
- 🧪 **60% faster** writing tests
- 📝 **80% faster** documentation
- 🐛 **50% faster** debugging unfamiliar code
- 🎨 **Priceless** for creative solutions

**But remember:** Fast ≠ Good. Always review! 👀

---

<!-- _class: lead -->

# 🎯 Bringing It All Together

_"Your Angular app can now think AND you can build it faster!"_

---

# 🏗️ The Modern Angular + AI Stack

```
┌─────────────────────────────────────┐
│  Your Amazing Angular App          │
├─────────────────────────────────────┤
│  🎨 UI Components (Signals!)        │
│  🧠 AI Services (Gemini/Web-LLM)    │
│  🔄 State Management                │
│  📡 HTTP + Streaming                │
├─────────────────────────────────────┤
│  ⚡ Development Tools                │
│  🤖 Cline + Gemini                  │
│  🎯 Vibe Coding Workflow            │
└─────────────────────────────────────┘
```

---

# 💡 Key Architectural Patterns

```typescript
// 1. AI Service Layer
@Injectable()
export class AIService {
  gemini = inject(GeminiService);
  webLLM = inject(WebLLMService);

  getProvider(): AIProvider {
    return this.configService.preferredAI;
  }
}

// 2. Streaming with Signals
readonly streamingResponse = signal('');

// 3. Progressive Enhancement
// Start with static, enhance with AI when loaded
```

---

# 🚦 Getting Started Checklist

- [ ] 🔑 Get Gemini API key (free tier available!)
- [ ] 📦 `npm install @google/generative-ai`
- [ ] 🎯 Start small: Add one AI feature
- [ ] 🧪 Experiment with Web-LLM locally
- [ ] 🛠️ Try Cline VSCode extension
- [ ] 📚 Learn prompt engineering
- [ ] 🚀 Build something awesome!

---

# 🎯 3 Practical Projects to Start

1. **🤖 Smart FAQ Bot**

   - Use Gemini to answer product questions
   - ~100 lines of code

2. **✍️ Content Generator**

   - Generate blog posts, descriptions
   - Great for e-commerce

3. **🔍 Semantic Search**
   - Search by meaning, not just keywords
   - Game changer for docs

---

# ⚠️ Important Considerations

**🔒 Security:**

- Never send sensitive data to cloud AI without encryption
- Sanitize AI outputs (XSS risk!)
- Rate limit AI requests

**💰 Costs:**

- Gemini: Free tier → Paid at scale
- Web-LLM: Free, but bandwidth for initial download

**🎯 UX:**

- Always show loading states
- Handle errors gracefully
- Provide fallbacks

---

# 🌟 The Future is Bright

**What's coming:**

- 🔊 Multimodal AI (voice, images, video)
- ⚡ Faster on-device models
- 🧠 Better reasoning capabilities
- 🎨 More creative AI tools
- 🤝 Deeper IDE integrations

**Angular + AI = The future of web development** 🚀

---

# 📚 Resources

**Gemini:**

- [ai.google.dev](https://ai.google.dev)
- [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)

**Web-LLM:**

- [mlc.ai/web-llm](https://mlc.ai/web-llm)
- [@mlc-ai/web-llm](https://www.npmjs.com/package/@mlc-ai/web-llm)

**Vibe Coding:**

- [Cline VSCode Extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)

---

# 🎤 Key Takeaways

1. **🤖 AI in Apps:** Use Gemini or Web-LLM to add intelligence to your Angular apps
2. **💬 Start Simple:** Streaming chat is easier than you think
3. **⚡ Vibe Coding:** AI accelerates development, but YOU are still the architect
4. **🔄 Iterate:** Start with one feature, learn, expand
5. **🚀 The Future:** Intelligent web experiences are the new normal

---

<!-- _class: lead -->

# 🎵 Keep Vibing!

## Questions? 🙋

**Let's connect:**

- 🐦 Twitter: @yourhandle
- 💼 LinkedIn: your-profile
- 🌐 Blog: your-blog.com
- 📧 Email: your@email.com

_"May your builds be fast and your AI prompts be accurate!"_ 🚀

---

<!-- _class: lead -->

# 🙏 Thank You, Angular Day Italy!

### 🇮🇹 Grazie mille!

_Now go build something intelligent!_ 🧠✨

**Slides:** github.com/yourusername/vibing-the-future-with-angular

---

# 📝 Bonus: Quick Code Reference

```typescript
// Gemini Setup
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Web-LLM Setup
import { CreateMLCEngine } from '@mlc-ai/web-llm';
const engine = await CreateMLCEngine('Llama-3.1-8B-Instruct');

// Streaming with Resource API
readonly chat = resource({
  params: () => ({ prompt: this.prompt() }),
  stream: async ({ params }) => {
    const state = signal({ value: '' });
    // ... async generator logic ...
    return state;
  }
});
```
