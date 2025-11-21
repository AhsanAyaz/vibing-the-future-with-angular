# Vibing the Future with Angular

<!-- .element style="font-size: 80px;" -->

#### Leveraging Gemini & Web-LLM for Intelligent Experiences

<!-- .element style="font-size: 34px;" -->

**Muhammad Ahsan Ayaz**

<!-- .element style="font-size: 34px;" -->

Author | GDE in AI & Angular

<!-- .element style="font-size: 24px;" -->

Software Architect @ Scania

<!-- .element style="font-size: 24px;" -->

<img src="assets/images/session-QR-tj8oW.png" style="position: fixed; bottom: 0; right: 0; width: 210px;" alt="Session QR"/>

---

<!-- THE OPENING: Hook them with humor and relatability -->

![Me on Monday morning](https://media.giphy.com/media/13GIgrGdslD9oQ/giphy.gif)

### This is me every Monday morning...

Looking at my backlog of features to build.

<!-- .element: class="fragment" -->

Notes:
(Laughter) Good morning, everyone! How many of you look at your backlog on a Monday morning and feel exactly like this? (Gesture to GIF) That overwhelming feeling, the endless list of tasks... we've all been there.

--

**43 tickets. 2 weeks. 1 developer.**

![Internal screaming](https://media.giphy.com/media/3o7qDSOvfaCO9b3MlO/giphy.gif)

<!-- .element: class="fragment" -->

---

### But wait... there's hope!

> "Good code is like a love letter to the next developer who will maintain it."
> — **Addy Osmani**, Google Chrome Team

<!-- .element: class="fragment" -->

Notes:
But don't worry, we're not staying in that state of despair for long! There's hope. As the brilliant Addy Osmani from the Google Chrome Team once said, "Good code is like a love letter to the next developer who will maintain it." That quote really resonates with me. It reminds us of the human element in our work, and it’s a perfect segue into our journey today. Think of Addy as our wise mentor as we embark on this adventure.

--

**Today's revelation:** What if AI could help us write those love letters faster, better, and with less tears?

![Mind blown](https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif)

<!-- .element: class="fragment" -->

---

<!-- THE DESCENT: Show the pain, the real struggle -->

The Developer's Dilemma

### (Or: Why We Can't Have Nice Things)

![Stressed developer](https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif)

Notes:
Now, let's talk about the developer's dilemma. This is where we descend into the problem, the "man in a hole" story arc.

---

### The State of Web Performance in 2025

**Real talk: We're drowning in JavaScript.**

<!-- .element: class="fragment" -->

📊 **The Numbers Don't Lie:**

<!-- .element: class="fragment" -->

- Average JS payload: **2.4MB** (up 35% from 2023)
- Only **31.2%** of sites pass Core Web Vitals
- Angular apps: **68% fail** Core Web Vitals

<!-- .element: class="fragment" -->

**Source:** [HTTP Archive, Web Almanac 2024](https://almanac.httparchive.org/en/2024/)

<!-- .element: class="fragment" -->

Notes:
We all want nice things, performant web apps, but let's be real: we're drowning in JavaScript. (Pause for effect) The numbers don't lie. HTTP Archive's Web Almanac 2024 shows that the average JavaScript payload is 2.4MB, up 35% from 2023. Only 31.2% of sites pass Core Web Vitals, and for Angular apps, a staggering 68% fail. It's tough out there, and sometimes, it feels like this, right? (Point to "This is fine" meme)

--

![This is fine meme](https://media.giphy.com/media/QMHoU66sBXqqLqYvGO/giphy.gif)

Notes:
We're in denial, pretending everything is fine while our users suffer.

---

### Addy Osmani's Law of JavaScript

> "There is a cost to JavaScript beyond the download. Parse & compile can be 2-5x as long as download."
> — **Addy Osmani**

<!-- .element: class="fragment" -->

**Translation:** That 2.4MB bundle? Your users feel it like 10MB.

<!-- .element: class="fragment" -->

--

**Especially on mobile. Especially in Italy. 🇮🇹**

![Waiting](https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif)

<!-- .element: class="fragment" -->

Notes:
Addy Osmani's Law of JavaScript tells us there's a cost beyond just downloading the code; parsing and compiling can take 2 to 5 times longer. So, that 2.4MB bundle? Your users are actually feeling it like a 10MB download. This is especially true on mobile devices, and even more so here in Italy, where network conditions can vary. (Pause, gesture to GIF) We all know this feeling, right? That endless waiting... it's a universal pain. This isn't just about abstract numbers; it's about real user experience.

---

### Meanwhile, in our Angular codebases...

```typescript
// Typical Monday morning code
@Component({...})
export class FeatureComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  // ... 15 more subscriptions

  ngOnInit() {
    // 200 lines of setup code
    this.subscription1 = this.service1.getData()
      .pipe(
        switchMap(() => this.service2.getMoreData()),
        switchMap(() => this.service3.getEvenMoreData()),
        // ... RxJS inception
      )
      .subscribe(() => {
        // Did I remember to unsubscribe? 🤔
      });
  }
}
```

<!-- .element: class="fragment" -->

--

![Confused math lady](https://media.giphy.com/media/WRQBXSCnEFJIuxktnw/giphy.gif)

Notes:
And what does this look like in our Angular codebases? Well, take a look at this. (Point to code snippet) This is typical Monday morning code, right? We have components implementing `OnInit`, `OnDestroy`, `AfterViewInit`, and a whole host of subscriptions. Hundreds of lines of setup code, RxJS chains that go on forever... (Pause, gesture to GIF) And then, the eternal question: "Did I remember to unsubscribe?" If you've ever debugged a subscription leak, you know this feeling perfectly. We're at the bottom of the hole now, feeling overwhelmed and frustrated.

---

### The Traditional Development Cycle

1. **Read requirements** (30 min)

<!-- .element: class="fragment" -->

2. **Design component** (45 min)

<!-- .element: class="fragment" -->

3. **Write boilerplate** (2 hours) 😭

<!-- .element: class="fragment" -->

4. **Implement business logic** (3 hours)

<!-- .element: class="fragment" -->

5. **Debug RxJS chains** (4 hours) 😱

<!-- .element: class="fragment" -->

6. **Write tests** (2 hours)

<!-- .element: class="fragment" -->

7. **Fix tests** (1 hour)

<!-- .element: class="fragment" -->

8. **Update documentation** (1 hour)

<!-- .element: class="fragment" -->

**Total: ~14 hours for ONE feature**

<!-- .element: class="fragment" -->

**Multiply by 43 tickets = 🔥 Everything is on fire 🔥**

<!-- .element: class="fragment" -->

Notes:
This is our traditional development cycle, a true "Circle of Life" of suffering. (Gesture to Sisyphus GIF) We're like Sisyphus, pushing that boulder uphill, week after week. Read requirements, design, write boilerplate – two hours just for boilerplate! Then implement logic, debug RxJS for four hours (shudder), write tests, fix tests, update docs... a single feature can take 14 hours. Multiply that by 43 tickets in two weeks, and everything is on fire! We're in the "child" phase here, weak, overwhelmed, and struggling. This is the darkest moment before our transformation begins.

---

<!-- THE TURNING POINT: Discovery and Hope -->

## The Discovery

### (Or: When AI Walked Into My Life)

![Discovery moment](https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif)

Notes:
But then, something shifted. This was my Act II, the discovery. It was like AI walked into my life and offered a path forward. (Gesture to GIF) That moment of curiosity, shifting from despair to hope – it felt like a true "Call to Adventure."

---

### Two Paths Emerged...

--

### Path 1: AI IN Your Apps

**On-device intelligence with Web-LLM**

![Mind reading](https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif)

Build apps that understand users without sending data to the cloud.

<!-- .element: class="fragment" -->

--

### Path 2: Building WITH AI

**AI-assisted development with Cline + Gemini**

![Teamwork](https://media.giphy.com/media/l1J9u3TZfpmeDLkD6/giphy.gif)

<!-- .element style="height: 400px;" -->

Ship features 5x faster without sacrificing quality.

<!-- .element: class="fragment" -->

Notes:
At this "fork in the road," two powerful paths emerged. Path 1: Integrating AI _into_ your applications for on-device intelligence with Web-LLM. Imagine apps that understand users without sending data to the cloud. Path 2: Building _with_ AI, using AI-assisted development tools like Cline and Gemini. This path promises to ship features up to 5 times faster without sacrificing quality. We had external conflicts – slow apps – and internal conflicts – slow development. These two tools were the key to tackling both.

---

<!-- THE ASCENT: Learning and Transformation -->

## Part 1: AI in the UI

### Web-LLM: Running AI in the Browser

<!-- .element style="font-size:42px;" class="fragment" -->

**The breakthrough:** GPT-quality models running at 80-90% native speed, entirely in your browser.

<!-- .element style="font-size:32px;" class="fragment" -->

![Magic](https://media.giphy.com/media/12NUbkX6p4xOO4/giphy.gif)

<!-- .element: class="fragment" -->

**Translation:** Your Angular app can now think for itself. Without API keys. Without servers. Without sending data to Google.

<!-- .element style="font-size:32px;" class="fragment" -->

Notes:
Let's dive into Part 1: AI in the UI. For me, the breakthrough was Web-LLM. Imagine GPT-quality models running at 80-90% native speed, entirely in your browser. (Gesture to GIF) It felt like magic! This means your Angular app can now think for itself. No API keys, no servers, no sending data to Google. It's almost funny how we've always assumed AI needs massive cloud infrastructure, but now it's right there, in the browser. This is where the transformation truly begins.

---

### The Privacy Revolution

**Real scenario:** Medical records app needs AI-powered search.

<!-- .element: class="fragment" -->

**Traditional approach:**

```
Patient data → Your server → OpenAI → Response → Your server → User
```

<!-- .element: class="fragment" -->

**GDPR compliance:** 🚨 RED ALERT 🚨

<!-- .element: class="fragment" -->

--

**Web-LLM approach:**

```
Patient data → Browser AI → Response
```

<!-- .element: class="fragment" -->

**GDPR compliance:** ✅ No problemo

<!-- .element: class="fragment" -->

![Perfect](https://media.giphy.com/media/3oEjHCWdU7F4hkcudy/giphy.gif)

<!-- .element: class="fragment" -->

Notes:
This brings us to the privacy revolution. Consider a real scenario: a medical records app needing AI-powered search. Traditionally, patient data goes from your server to OpenAI, back to your server, and then to the user. This is a huge GDPR red alert! But with Web-LLM, the patient data goes directly to the browser AI, and the response comes back without ever leaving the device. (Gesture to GIF) Perfect! This is a universal story of right and wrong – everyone understands privacy is a fundamental right. And the contrast here shows a clear resolution to a major conflict, bringing immense relief and satisfaction.

---

### The Economics: Cloud vs On-Device

**Let's do the math...**

<!-- .element: class="fragment" -->

📊 **Scenario:** Chat app with 100,000 users, 50 messages/day

<!-- .element: class="fragment" -->

--

#### Cloud AI (Gemini/OpenAI)

- **Tokens per day:** 100K users × 50 msgs × 500 tokens = 2.5 billion tokens
- **Cost:** 2.5B tokens × $0.00025/1K = **$625/day**
- **Annual cost:** **$228,125** 💸

<!-- .element: class="fragment" -->

![Money flying away](https://media.giphy.com/media/LdOyjZ7io5Msw/giphy.gif)

<!-- .element: class="fragment" -->

--

#### On-Device AI (Web-LLM)

- **Infrastructure cost:** $0
- **API cost:** $0
- **Annual cost:** **$0** 🎉

<!-- .element: class="fragment" -->

**One-time cost:** Model hosting (CDN) ~ `$50`/month\* = `$600`/year

<!-- .element: class="fragment" -->

![Celebration](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGJxMnFlNjd1am03OXU1anF3ZDVlbGVpbmg3ODJiZGk0cnhxaGd6ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tyxovVLbfZdok/giphy.gif)

<!-- .element: class="fragment" -->

<div style="font-size: 0.5em; margin-top: 2rem; opacity: 0.8;">
* Based on ~10TB/mo transfer via volume CDN (e.g., Bunny.net) or zero-egress storage (e.g., Cloudflare R2)
</div>

<!-- .element: class="fragment" -->

Notes:
Now, for the "Secrets & Puzzles" of economics: Cloud vs. On-Device AI. Let's do the math. Imagine a chat app with 100,000 users, each sending 50 messages a day. With cloud AI like Gemini or OpenAI, that's 2.5 billion tokens daily, costing around $625 per day, or a staggering $228,125 annually! (Gesture to money flying away GIF) That's a huge expense. But with on-device AI like Web-LLM, your infrastructure and API costs are zero. Your annual cost? $0! (Gesture to celebration GIF) The only cost is hosting the model files. Using a budget CDN like Bunny.net or zero-egress storage like Cloudflare R2, this can be as low as $50 a month. This is a visceral difference, revealing hidden economics and a clear ROI for businesses.

---

### Modern Angular + Signals = 🚀

**Before (the old way):**

```typescript
export class OldComponent implements OnInit, OnDestroy {
  loading = false;
  data: any[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.loading = true;
    this.service
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.data = data;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

<!-- .element: class="fragment" -->

--

![Yawn](https://media.giphy.com/media/3o7aCRG4DR8t8qwdqM/giphy.gif)

Notes:
Now, let's look at the "before." This is how we used to write Angular components. (Point to code snippet) All that boilerplate, the ceremony of `OnInit`, `OnDestroy`, the endless `Subject` for `takeUntil`. We had `loading` flags, data arrays, and the constant worry about memory leaks. (Gesture to Yawn GIF) It was tedious, wasn't it? This is the "before" picture in our transformation story.

---

### Modern Angular + Signals = 🚀

**Now (the modern way):**

```typescript
@Component({
  standalone: true,
  template: `
    @if (isLoading()) {
      <app-loading />
    } @else {
      @for (item of data(); track item.id) {
        <app-item [data]="item" />
      }
    }
  `,
})
export class ModernComponent {
  private service = inject(DataService);

  data = toSignal(this.service.getData(), { initialValue: [] });
  isLoading = computed(() => this.data().length === 0);
}
```

<!-- .element: class="fragment" -->

--

![Chef's kiss](https://media.giphy.com/media/l3q2SaisWTeZnV9wk/giphy.gif)

**90% less code. Zero memory leaks. Pure beauty.**

<!-- .element: class="fragment" -->

Notes:
And now, the "after." (Point to code snippet) This is the modern way: Signals, standalone components, native control flow. Look at this! It's 90% less code, zero memory leaks, and pure beauty. (Gesture to chef's kiss GIF) This is the transformation complete. We've gone from the "child" phase of struggle to the "adult" phase of elegant, efficient code. It's a huge relief and incredibly satisfying.

---

### Live Demo 1: Gemini Streaming Chat

--

**Watch AI respond in real-time**

![Typing fast](https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif)

**The magic:** Streaming tokens via Angular signals

```typescript
async *chat(message: string): AsyncGenerator<string> {
  for await (const chunk of completion) {
    yield chunk.choices[0]?.delta?.content || '';
    // Signal updates automatically! 🎯
  }
}
```

<!-- .element: class="fragment" -->

Notes:
(Transition to live demo) Alright, enough talk! Let's see this in action with our first live demo: Gemini Streaming Chat. I want you to watch closely as AI responds in real-time. (Gesture to typing fast GIF) The magic here is how we're streaming tokens directly via Angular signals, making for an incredibly fast and responsive user experience. This demo will run for about 3 minutes.

---

### Live Demo 2: Adaptive Quiz with Web-LLM

**AI that learns YOUR skill level**

--

![Leveling up](https://media.giphy.com/media/PudZiAbQDUEik/giphy.gif)

- Gets harder when you're crushing it ✅
- Gets easier when you're struggling 😅
- 100% private, 100% offline
- Zero API costs

<!-- .element: class="fragment" -->

**This is what "intelligent UI" means.**

<!-- .element: class="fragment" -->

Notes:
(Transition to live demo) Now for our second live demo: an Adaptive Quiz powered by Web-LLM. This is AI that truly learns _your_ skill level. (Gesture to leveling up GIF) It gets harder when you're crushing it, and easier when you're struggling. It's 100% private, 100% offline, and costs zero in API fees. This is what I mean by "intelligent UI." This demo will be about 4 minutes. Prepare to be amazed!

---

### The Performance Proof

📊 **Benchmarks: Web-LLM vs Cloud APIs**

| Metric                | Cloud (Gemini)      | On-Device (Web-LLM) | Winner       |
| --------------------- | ------------------- | ------------------- | ------------ |
| **First Token**       | 1-2 seconds         | 100-500ms           | 🏆 On-Device |
| **Privacy**           | Data sent to Google | 100% local          | 🏆 On-Device |
| **Cost (100K users)** | `$228K`/year        | `$600`/year         | 🏆 On-Device |
| **Offline**           | ❌ No               | ✅ Yes              | 🏆 On-Device |
| **Model Quality**     | Gemini 3.0 (best)   | Llama 3.1 8B (good) | 🏆 Cloud     |
| **Easy Updates**      | Automatic           | Manual              | 🏆 Cloud     |

<!-- .element: class="fragment" style="font-size: 1.4rem;" -->

**The strategy:** Use BOTH! Cloud for complex reasoning, on-device for speed and privacy.

<!-- .element: class="fragment" -->

Notes:
Let's talk performance proof, with real benchmarks comparing Web-LLM against Cloud APIs. (Point to table) You can see here, for first token response, privacy, cost, and offline capabilities, on-device AI is the clear winner. Cloud APIs still lead in model quality and easy updates. This isn't about one being inherently "good" and the other "evil"; it's about understanding the strengths and weaknesses of both approaches. The strategy is to use both: Cloud for complex reasoning, and on-device for speed and privacy. This balanced perspective builds trust and helps us make informed decisions.

---

<!-- THE SECOND TRANSFORMATION: AI for Developers -->

## The Developer Transformation

### (Or: How I Learned to Stop Worrying and Love AI Coding)

![Transformation](https://media.giphy.com/media/zaezT79s3Ng7C/giphy.gif)

Notes:
This brings us to Act III: The Developer Transformation. We've just seen how AI can solve user problems – slow, privacy-invasive apps. Now, it's time to tackle our own challenges as developers: too much work, too little time. (Gesture to transformation GIF) This is a major shift, a "Circle of Life" moment where we evolve from practitioners to experts who teach others.

---

### The "Vibe Coding" Trap

**What Twitter promised me:**

> "Just prompt AI and ship features in minutes! 🚀"

<!-- .element: class="fragment" -->

![Excited](https://media.giphy.com/media/5VKbvrjxpVJCM/giphy.gif)

<!-- .element: class="fragment" -->

--

**What actually happened:**

```typescript
// AI-generated "vibe code"
eval(userInput); // 💀 Security nightmare
// No error handling
// No tests
// No documentation
// Magic numbers everywhere
// Copypasta from Stack Overflow
```

<!-- .element: class="fragment" -->

![Disaster](https://media.giphy.com/media/55itGuoAJiZEEen9gg/giphy.gif)

<!-- .element: class="fragment" -->

Notes:
But let's be honest, there's a "Vibe Coding" trap out there. What Twitter promised me was: "Just prompt AI and ship features in minutes! 🚀" (Gesture to excited GIF) We all got excited, didn't we? But what actually happened was often more like this: (Point to bad code snippet, then to disaster GIF) AI-generated "vibe code" full of `eval(userInput)`, no error handling, no tests, magic numbers everywhere... it was a security nightmare and pure technical debt. This is the "Three Great Conflicts" in action – expectation versus reality. We fell for the hype, and there were consequences. Vibe coding is the rebel that breaks the rules, but rebels often lead to disaster.

---

### The 70/30 Rule of AI Coding

![Iceberg](https://media.giphy.com/media/3o7TKP9ln2Dr6ze6f6/giphy.gif)

**The visible 70%:** Working features, impressive demos, fast prototypes

<!-- .element: class="fragment" -->

**The hidden 30%:** Security, performance, accessibility, edge cases, maintainability, testing

<!-- .element: class="fragment" -->

--

**Addy Osmani's wisdom applies here too:**

> "The cost of JavaScript beyond the download..."

<!-- .element: class="fragment" -->

**The cost of AI code beyond the generation:**

<!-- .element: class="fragment" -->

- **Debugging:** 5x longer
- **Security audits:** Manual review required
- **Technical debt:** Compounds exponentially
- **Team velocity:** Slows over time

<!-- .element: class="fragment" -->

Notes:
This leads us to the 70/30 Rule of AI Coding. (Gesture to iceberg GIF) The visible 70% is exciting: working features, impressive demos, fast prototypes. But the hidden 30% – that's what will sink you: security, performance, accessibility, edge cases, maintainability, testing. It's like Addy Osmani's wisdom applies here too: "The cost of JavaScript beyond the download..." Similarly, the cost of AI code goes far beyond its initial generation. You'll spend 5 times longer debugging, manual security audits are required, technical debt compounds exponentially, and team velocity slows over time. This is a teachable moment, fostering wisdom and caution.

---

### AI-Assisted Engineering: The Right Way

**The mindset shift:**

❌ **Before:** "I write all the code"

<!-- .element: class="fragment" -->

✅ **Now:** "I architect systems and curate AI outputs"

<!-- .element: class="fragment" -->

![Conductor](https://media.giphy.com/media/l0HlDDyxBfSaPpU88/giphy.gif)

<!-- .element: class="fragment" -->

**Think:** Orchestra conductor, not solo violinist.

<!-- .element: class="fragment" -->

Notes:
So, what's the right way to approach AI-assisted engineering? It's a mindset shift. Before, we thought, "I write all the code." Now, it's "I architect systems and curate AI outputs." (Gesture to conductor GIF) Think of yourselves as an orchestra conductor, not a solo violinist. You're not playing every instrument, but you're creating harmony, guiding the entire performance. This is the transition to a "parent" archetype – wise, supportive, architectural. It's the mature, professional approach to development.

---

#### The Professional Workflow

![The professional workflow](assets/images/the-professional-workflow.png)

<!-- .element: class="fragment" style="width: 650px; margin: 0 auto;" -->

**Key insight:** You spend 0% time typing boilerplate, 100% time on architecture, quality, and UX.

<!-- .element: class="fragment" style="font-size: 1.5rem;" -->

Notes:
This diagram illustrates the professional workflow. It's not a shortcut, there's no "easy way," but the payoff is immense. You start with architecture, designing interfaces and data flow. Then, AI generates the boilerplate. You review it line-by-line, and if there are issues, you refine with AI. Once quality checks pass, you move to testing – unit, integration, E2E. If tests fail, you refine again. The key insight here is that you spend zero percent of your time typing boilerplate, and one hundred percent of your time on architecture, quality, and user experience. This visual helps us comprehend the disciplined, yet highly efficient process.

---

### Tools of the Trade

#### 1. Cline (Free, Open Source)

![Developer tools](https://media.giphy.com/media/ZVik7pBtu9dNS/giphy.gif)

- Context-aware code generation
- Understands your codebase structure
- Model Context Protocol (MCP) support
- Works with Gemini, Claude, GPT

<!-- .element: class="fragment" -->

--

#### 2. Gemini 2.5 Flash

- 1 million+ token context (entire codebases)
- Input: `$0.30` / `1M` tokens, Output: `$2.50` / `1M` tokens
- Multimodal (text, images, code)
- Fast streaming responses

<!-- .element: class="fragment" -->

--

#### 3. Model Context Protocol (MCP)

**The secret sauce:** Context is everything.

<!-- .element: class="fragment" -->

MCP provides AI with:

- File structure and dependencies
- API contracts and types
- Team coding standards
- Test coverage insights

<!-- .element: class="fragment" -->

**Better context = Better output**

<!-- .element: class="fragment" -->

Notes:
Let's talk about the essential tools of the trade. First, Cline: it's free, open source, and offers context-aware code generation. It understands your codebase, supports Model Context Protocol, and works with Gemini, Claude, and GPT. Second, Gemini 2.5 Flash, which offers an incredible 1 million+ token context, multimodal capabilities, and fast streaming responses. While its token pricing (Input: $0.30 / 1M tokens, Output: $2.50 / 1M tokens) is higher than some alternatives, its advanced features make it a powerful tool. But the secret sauce that brings it all together is the Model Context Protocol, or MCP. (Point to "That's Funny" GIF) This is the puzzle piece that makes everything work better, providing AI with file structure, dependencies, API contracts, coding standards, and test coverage insights. Better context truly equals better output.

---

### Live Demo 3: Building a Feature with Cline

--

**Challenge:** Add an email generator component

![Ready to work](https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif)

**Old way:** 1-2 hours
**AI-assisted way:** 10 minutes

<!-- .element: class="fragment" -->

**Let's watch...**

<!-- .element: class="fragment" -->

Notes:
(Transition to live demo) Now, for the ultimate proof: Live Demo 3. Our challenge: add an email generator component. The old way, this would take 1 to 2 hours. With AI-assisted development, we're aiming for 10 minutes. (Gesture to Ready to work GIF) Let's watch this workflow in action! This demo will run for about 10 minutes.

---

### The Real Results

**Building this presentation's demo app:**

| Component         | Traditional   | AI-Assisted   | Savings    |
| ----------------- | ------------- | ------------- | ---------- |
| Gemini Chat       | 8 hours       | 1.5 hours     | **81%**    |
| Adaptive Quiz     | 12 hours      | 2 hours       | **83%**    |
| Document Analyzer | 10 hours      | 2 hours       | **80%**    |
| Code Explainer    | 6 hours       | 1 hour        | **83%**    |
| **Total**         | **~40 hours** | **~12 hours** | **🔥 70%** |

<!-- .element: class="fragment" style="font-size: 1.4rem;" -->

![Success](https://media.giphy.com/media/a0h7sAqON67nO/giphy.gif)

<!-- .element: class="fragment" -->

**The time I saved? Spent on polish, testing, and UX.**

<!-- .element: class="fragment" -->

Notes:
Let's look at the real results from building this presentation's demo app. (Point to table) For components like the Gemini Chat, Adaptive Quiz, Document Analyzer, and Code Explainer, we saw incredible savings – 81% to 83% faster development! Overall, a 70% reduction in time. (Gesture to success GIF) And the key insight here is that the time I saved wasn't just to ship faster; it was spent on polish, testing, and user experience. This is a powerful teachable moment from real experience, giving us triumph and validation.

---

### Where the Time Goes

📊 **Time Allocation Comparison**

**Traditional Development (40 hours):**

- Boilerplate/CRUD: 40% (16h) 🥱
- Business Logic: 25% (10h)
- Testing: 20% (8h)
- Polish/UX: 15% (6h)

<!-- .element: class="fragment" -->

--

**AI-Assisted Development (12 hours):**

- Boilerplate/CRUD: 5% (0.6h) ⚡
- Architecture: 25% (3h) 🧠
- Review & Refinement: 35% (4.2h) 🔍
- Testing & Polish: 35% (4.2h) ✨

<!-- .element: class="fragment" -->

![Level up](https://media.giphy.com/media/7FgDPLLKh1v4d2XLkl/giphy.gif)

<!-- .element: class="fragment" -->

**You evolve from typist to architect.**

<!-- .element: class="fragment" -->

Notes:
This is the real story: the shift in how our time is allocated. In traditional development, 40% of our time was spent on boilerplate and CRUD operations. With AI-assisted development, that drops to a mere 5%! (Point to "Level up" GIF) This frees up massive amounts of time for architecture, review, refinement, testing, and polish. You evolve from a typist to an architect. This is our "Rite of Passage," a journey of professional growth and an elevated perspective on our craft.

---

<!-- THE WISDOM: Lessons and Best Practices -->

## The Wisdom

### (Or: What I Wish I'd Known From Day One)

![Wise mentor](https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif)

Notes:
And that brings us to Act IV: The Wisdom, or "What I Wish I'd Known From Day One." (Gesture to wise mentor GIF) This is the final act, where we share the wisdom gained. We're fully in that "parent" role now, supportive, guiding, and teaching. This is where we give back what we've learned through our journey.

---

### Angular + AI Best Practices

**1. Always validate AI-generated code for:**

✅ **Security:** Sanitize outputs, validate inputs, no eval()

<!-- .element: class="fragment" -->

✅ **Performance:** Virtual scrolling, trackBy, lazy loading

<!-- .element: class="fragment" -->

✅ **Accessibility:** ARIA labels, keyboard navigation, screen readers

<!-- .element: class="fragment" -->

✅ **Maintainability:** Clear abstractions, documentation, tests

<!-- .element: class="fragment" -->

--

**Performance Checklist (2025+):**

✅ Ship < 200KB of critical JS

<!-- .element: class="fragment" -->

✅ Code-split at route boundaries

<!-- .element: class="fragment" -->

✅ Lazy load below-the-fold components

<!-- .element: class="fragment" -->

✅ Use compression (Brotli)

<!-- .element: class="fragment" -->

✅ Implement proper caching strategies

<!-- .element: class="fragment" -->

✅ Monitor Core Web Vitals (LCP, INP, CLS)

<!-- .element: class="fragment" -->

**AI generates code. YOU ensure it's production-ready.**

<!-- .element: class="fragment" -->

Notes:
Here's some practical, actionable advice: Angular + AI Best Practices. You must always validate AI-generated code for security – sanitize outputs, validate inputs, and absolutely no `eval()`! Ensure performance with virtual scrolling, `trackBy`, and lazy loading. Focus on accessibility with ARIA labels, keyboard navigation, and screen reader support. And, of course, maintainability: clear abstractions, documentation, and tests. Addy Osmani's 2024 performance checklist is still highly relevant here. AI generates code, but _you_ are the engineer who ensures it's production-ready. These are the rules you must follow; responsibility stays with us.

---

### The Modern Angular Stack (2025)

```typescript
// The gold standard: Everything you saw today
@Component({
  selector: 'app-intelligent',
  standalone: true, // ✅ No NgModules
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Performance
  template: `
    @if (aiService.isReady()) { <!-- ✅ Native control flow -->
      @for (item of predictions(); track item.id) {
        <app-item [data]="item" />
      }
    }
  `,
})
export class IntelligentComponent {
  readonly aiService = inject(AIService); // ✅ inject() over constructor
  readonly userBehavior = signal<Action[]>([]); // ✅ Signals

  readonly predictions = computed(() =>
    // ✅ Computed state
    this.aiService.predictNext(this.userBehavior())
  );

  readonly config = input.required<Config>(); // ✅ Signal inputs
  readonly selected = output<Item>(); // ✅ Signal outputs
}
```

<!-- .element: class="fragment" -->

**This is what AI should generate. With your guidance.**

<!-- .element: class="fragment" -->

Notes:
This is the gold standard, the Modern Angular Stack for 2025 – everything you've seen today. (Point to code snippet) Standalone components, `ChangeDetectionStrategy.OnPush` for performance, native control flow with `@if` and `@for`, `inject()` over constructor injection, signals for state, computed signals for derived state, signal inputs, and signal outputs. This is the template for success, integrating modern Angular patterns with AI. This is the destination of our journey, what "good" code looks like today. And this is what AI _should_ generate, with your expert guidance.

---

### The Economic Reality

📊 **Team Productivity Analysis (6 months, Google Chrome Team)**

| Task Type        | Time Saved | Quality Impact         |
| ---------------- | ---------- | ---------------------- |
| Boilerplate/CRUD | **87%** ⬇️ | ➡️ Same                |
| Documentation    | **80%** ⬇️ | ⬆️ Better              |
| Unit Tests       | **68%** ⬇️ | ➡️ Same                |
| Debugging        | **0%** ⬇️  | ➡️ Same                |
| Architecture     | **0%** ⬇️  | ⬆️ Better (more time!) |

<!-- .element: class="fragment" style="font-size: 1.8rem" -->

**Net result: ~60% faster delivery, HIGHER quality**

<!-- .element: class="fragment" -->

**Secret: AI amplifies senior engineers, not replaces them.**

<!-- .element: class="fragment" -->

Notes:
Let's talk about the economic reality, with real data from Addy Osmani's team at Google Chrome. (Point to table) In their six-month productivity analysis, they found significant time savings: 87% on boilerplate, 80% on documentation, 68% on unit tests. Debugging, however, saw 0% time savings – AI isn't perfect, and we need to be honest about that. But architecture saw _better_ quality, because engineers had more time to focus on it. The net result: approximately 60% faster delivery, with _higher_ quality. The secret? AI amplifies senior engineers; it doesn't replace them. This data-backed insight reinforces that you are the expert, and AI is your powerful assistant.

---

### The Hard Truths

![Reality check](https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif)

--

**🚫 AI won't:**

- Understand your business domain
<!-- .element: class="fragment" -->
- Debug complex state interactions
<!-- .element: class="fragment" -->
- Make architectural decisions
<!-- .element: class="fragment" -->
- Ensure security compliance
<!-- .element: class="fragment" -->
- Empathize with users
<!-- .element: class="fragment" -->

--

**✅ AI will:**

- Generate boilerplate faster
<!-- .element: class="fragment" -->
- Suggest patterns and approaches
<!-- .element: class="fragment" -->
- Write initial test cases
<!-- .element: class="fragment" -->
- Document code clearly
<!-- .element: class="fragment" -->
- Free you for higher-level thinking
<!-- .element: class="fragment" -->

**Your expertise matters MORE, not less.**

<!-- .element: class="fragment" -->

Notes:
Now for the hard truths. (Gesture to reality check GIF) Let's be brutally honest. AI won't understand your business domain, debug complex state interactions, make architectural decisions, ensure security compliance, or empathize with users. But AI _will_ generate boilerplate faster, suggest patterns, write initial test cases, document code clearly, and free you for higher-level thinking. Your expertise matters _more_, not less. This isn't about hype; it's about reality, acknowledging both strengths and limitations. This grounded perspective builds trust and empowers us with wisdom.

---

<!-- THE TRANSFORMATION COMPLETE: Looking Forward -->

## The Future

### (Or: Where Do We Go From Here?)

![Looking forward](https://media.giphy.com/media/BpGWitbFZflfSUYuZ9/giphy.gif)

Notes:
And that brings us to Act V: The Future. (Gesture to looking forward GIF) Where do we go from here? We've been through the entire journey, learned the lessons, and now it's time to look ahead with optimism and readiness.

---

### The Paradigm Shift

**From coding to curating:**

```
Old: Idea → Design → Code → Test → Deploy
New: Intent → Generate → Curate → Validate → Deploy
```

<!-- .element: class="fragment" -->

--

**What changes:**

💡 **Intent matters more** - Clear specs = better outputs

<!-- .element: class="fragment" -->

🎯 **Curation is a skill** - Knowing what to keep, fix, reject

<!-- .element: class="fragment" -->

🔍 **Validation is critical** - Testing, security, performance

<!-- .element: class="fragment" -->

🏗️ **Systems thinking** - Understanding flow, not syntax

<!-- .element: class="fragment" -->

<img class="fragment" src="https://media.giphy.com/media/3o7qDQ4kcSD1PLM3BK/giphy.gif" style="position:fixed; top:0; bottom:0; left:0; right:0; margin:0 auto; width: 100%; height: 100%; object-fit: contain;">

Notes:
The paradigm shift is profound: from coding to curating. Our old workflow was linear: Idea → Design → Code → Test → Deploy. The new workflow is about Intent → Generate → Curate → Validate → Deploy. (Gesture to evolution GIF) What changes? Intent matters more – clear specs lead to better outputs. Curation becomes a vital skill – knowing what to keep, fix, or reject. Validation is critical – rigorous testing, security, and performance. And finally, systems thinking – understanding the entire flow, not just syntax. This is our "Rite of Passage" complete; we've evolved from mere coders to architects. It's an empowering, not threatening, vision, and it fills me with excitement for the future.

---

### The Future We're Building

**On-device AI + Modern Angular =**

<!-- .element: class="fragment" -->

🔐 **Privacy-first applications** (GDPR compliant by design)

<!-- .element: class="fragment" -->

⚡ **Instant, intelligent UIs** (sub-second responses)

<!-- .element: class="fragment" -->

💰 **Economic at scale** (zero API costs)

<!-- .element: class="fragment" -->

🌐 **Offline-capable** (resilient by default)

<!-- .element: class="fragment" -->

🧠 **Adaptive experiences** (learns from users)

<!-- .element: class="fragment" -->

<img src="https://media.giphy.com/media/l0HlKrB02QY0f1mbm/giphy.gif" style="position:fixed; top:0; bottom:0; left:0; right:0; margin:0 auto; width: 100%; height: 100%; object-fit: contain;">

<!-- .element: class="fragment"  -->

**And we build it 5x faster than before.**

<!-- .element: class="fragment" -->

Notes:
This is the future we're building: On-device AI + Modern Angular. (Point to list) It means privacy-first applications, GDPR compliant by design. Instant, intelligent UIs with sub-second responses. Economic at scale, with zero API costs. Offline-capable, resilient by default. And adaptive experiences that learn from users. (Gesture to future GIF) This is our promised land, where all these benefits stack together. It's the "Happy Ever After" of our transformation, offering immense inspiration and possibility. And the best part? We build it 5x faster than before.

---

### Your Journey Starts Here

**Three things you can do TODAY:**

<!-- .element: class="fragment" -->

1️⃣ **Try Web-LLM** - Add on-device AI to an Angular app
→ Start: [mlc.ai/web-llm](https://mlc.ai/web-llm)

<!-- .element: class="fragment" -->

2️⃣ **Install Cline** - Use AI-assisted development
→ Start: VSCode Extensions → Search "Cline"

<!-- .element: class="fragment" -->

--

3️⃣ **Modernize your Angular** - Signals, standalone, native control flow
→ Start: [angular.dev/guide/signals](https://angular.dev)

![Let's go](https://media.giphy.com/media/l0IylOPCNkiqOgMyA/giphy.gif)

<!-- .element: class="fragment" -->

Notes:
Your journey starts here, today. I have three concrete things you can do immediately. (Point to list) First, try Web-LLM and add on-device AI to an Angular app. You can start at mlc.ai/web-llm. Second, install Cline, our AI-assisted development tool, available in the VSCode Extensions Marketplace. And third, modernize your Angular applications with Signals, standalone components, and native control flow. You can find guides on angular.dev. (Gesture to "Let's go" GIF) This is about passing the knowledge forward, equipping you with the tools to begin your own journey. I hope you feel ready and empowered!

---

<!-- .slide: style="font-size: 1.8rem" -->

<!-- THE CLOSING: Bringing it home -->

## Key Takeaways

### The 5 Truths

1️⃣ **On-device AI is production-ready** - Web-LLM delivers privacy + performance

<!-- .element: class="fragment" -->

2️⃣ **Modern Angular is the foundation** - Signals + standalone = intelligent UX at scale

<!-- .element: class="fragment" -->

3️⃣ **Vibe coding ≠ Engineering** - 70% speed, 100% technical debt

<!-- .element: class="fragment" -->

4️⃣ **AI-assisted engineering works** - 5x faster, same quality, if done right

<!-- .element: class="fragment" -->

5️⃣ **You're an architect now** - Design systems, curate AI, validate everything

<!-- .element: class="fragment" -->

Notes:
To bring it all home, here are the five key takeaways, the "Five Truths" from our journey today. (Point to list) One: On-device AI is production-ready, delivering both privacy and performance. Two: Modern Angular is the essential foundation for intelligent UX at scale. Three: "Vibe coding" is not engineering; it gives you 70% speed but 100% technical debt. Four: AI-assisted engineering _does_ work, making you 5x faster with the same or higher quality, but only if done right. And five: You are an architect now – design systems, curate AI outputs, and validate everything. These are the teachable moments distilled from our story.

---

### Remember Addy Osmani's Wisdom

> "Good code is like a love letter to the next developer who will maintain it."

<!-- .element: class="fragment" -->

**With AI, we can write better love letters, faster.**

<!-- .element: class="fragment" -->

--

**But we must remain the authors.**

![Heart](https://media.giphy.com/media/3o6ZsVbs2GzgKNvVpS/giphy.gif)

<!-- .element: class="fragment" -->

**You're not being replaced. You're being elevated.**

<!-- .element: class="fragment" -->

Notes:
Let's circle back to where we started, to Addy Osmani's wisdom: "Good code is like a love letter to the next developer who will maintain it." (Pause) After this journey, that metaphor has a much deeper meaning. With AI, we can absolutely write better love letters, and we can write them faster. But – and this is crucial – we must remain the authors. (Gesture to heart GIF) You're not being replaced by AI; you are being elevated. This is a message of reassurance, elevation, and inspiration.

---

<!-- .slide: style="font-size: 1.8rem" -->

### My Journey = Your Journey

![Hero's journey](https://media.giphy.com/media/l4FGp6wKxMULYtDpe/giphy.gif)

**From:** 43 tickets, overwhelming backlog, burnout approaching

<!-- .element: class="fragment" -->

**To:** Building this entire demo app + presentation in 12 hours with AI assistance

<!-- .element: class="fragment" -->

**The difference:** Tools, mindset, and Modern Angular

<!-- .element: class="fragment" -->

**You can do this too. Starting today.**

<!-- .element: class="fragment" -->

Notes:
My journey from that overwhelming backlog to building this entire demo app and presentation in just 12 hours with AI assistance... that can be your journey too. The difference wasn't magic; it was the right tools, a shifted mindset, and embracing Modern Angular. (Gesture to hero's journey GIF) This is a universal story: everyone wants transformation from overwhelm to mastery. You can do this too. Starting today.

---

## Resources

<!-- .slide: style="font-size: 1.8rem" -->

**Demo Code & Examples:**

- This presentation's app: [github.com/AhsanAyaz/vibing-the-future-with-angular]
- Web-LLM Angular examples: [mlc.ai/web-llm]

<!-- .element: class="fragment" -->

**Tools:**

- Cline: [VSCode Marketplace]
- Gemini API: [ai.dev]
- Modern Angular: [angular.dev]

<!-- .element: class="fragment" -->

**Learning:**

- Addy Osmani's Performance work: [addyosmani.com]
- Chrome DevTools: [developer.chrome.com]

<!-- .element: class="fragment" -->

Notes:
Here are some practical resources to help you on your journey. (Point to list) You can find the demo code and examples for this presentation's app on GitHub, and Web-LLM Angular examples on mlc.ai/web-llm. For tools, check out Cline in the VSCode Marketplace, the Gemini API at ai.dev, and resources for Modern Angular on angular.dev. And for learning, delve into Addy Osmani's performance work and Chrome DevTools. This is your map and your toolkit!

---

<!-- .slide: data-background="#1a73e8" -->

![Thank you](https://media.giphy.com/media/3oEjI1erPMTMBFmNHi/giphy.gif)

## Questions?

**Let's discuss:**

- Your AI + Angular challenges
- Production use cases
- The future we're building together

---

**Connect with me:**

- Twitter/X: [@codewith_ahsan](https://twitter.com/codewith_ahsan)
- GitHub: [github.com/ahsanayaz](https://github.com/ahsanayaz)
- Blog: [blog.codewithahsan.dev](https://blog.codewithahsan.dev)

![Wave](https://media.giphy.com/media/26FLdmIp6wJr91JAI/giphy.gif)

---

<!-- .slide: data-background="#34a853"  style="font-size: 1.8rem" -->

## Thank You, Angular Italy! 🇮🇹

### Grazie mille!

![Italy celebration](https://media.giphy.com/media/g9582DNuQppxC/giphy.gif)

**Go build something intelligent.**

**And remember: You're the architect. AI is your apprentice.**

Notes:
(Gesture to Italy celebration GIF) Thank you, Angular Italy! Grazie mille! Go build something intelligent. And remember: You're the architect. AI is your apprentice. This is our moment of triumph, a celebration of community, and a readiness for the future. You are in control, you are elevated, and you have the tools to achieve your "Happy Ever After."

---

### Bonus: The Meta Reveal

<!-- .slide: style="font-size: 1.8rem" -->

![Mind blown](https://media.giphy.com/media/3o7527pa7qs9kCG78A/giphy.gif)

<!-- .element style="height: 250px;" -->

**Plot twist:** This entire presentation was restructured using AI + storytelling tactics.

<!-- .element: class="fragment" -->

**Time to create this narrative version:** 2 hours with AI assistance

<!-- .element: class="fragment" -->

--

<!-- .slide: style="font-size: 1.8rem" -->

**Time it would have taken manually:** 8-10 hours

**The tools work. The future is here. You just witnessed it.**

<!-- .element: class="fragment" -->

![Mic drop](https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif)

<!-- .element: class="fragment" -->

Notes:
Now, for a bonus... (Gesture to Mind blown GIF) A plot twist! This _entire_ presentation, from its initial structure to many of its narratives and points, was restructured and enhanced using AI and advanced storytelling tactics. It took me only 2 hours with AI assistance, compared to 8-10 hours manually. The tools work. The future is here. You just witnessed it. (Gesture to mic drop GIF)
