# Screenshots Needed for Cline Workflow Slides

This directory should contain screenshots demonstrating the Cline + Gemini workflow.

## Required Screenshots

### 1. cline-1-prompt.png
**Screenshot of:** Cline interface with the initial prompt

**Prompt text to show:**
```
Create an email generator component that:
- Uses Web-LLM for generation
- Allows users to specify recipient, subject, tone
- Generates professional emails
- Follows Angular 19 best practices (signals, standalone)
```

**What to capture:**
- Cline chat interface in VSCode
- The prompt clearly visible
- Cline responding with "I'll help you create..."

---

### 2. cline-2-context.png
**Screenshot of:** Cline analyzing codebase context

**What to capture:**
- Cline's message showing files it's reading
- List of files: `webllm.service.ts`, `app.routes.ts`, other components
- Message like "I've analyzed your codebase and understand your patterns..."

**Highlight:** The MCP-powered context analysis

---

### 3. cline-3-generation.png
**Screenshot of:** Cline generating code

**What to capture:**
- Code being generated in real-time (or just after generation)
- File list showing 4 files created/modified:
  - `email-generator.component.ts` (new)
  - `email-generator.component.html` (new)
  - `app.routes.ts` (modified)
  - `app.html` (modified)
- Partial code visible showing signals, standalone component

---

### 4. cline-4-review.png
**Screenshot of:** Code review checklist

**What to capture:**
- VSCode with generated code open
- Comments/annotations showing review points:
  - ✅ Signals used correctly
  - ✅ OnPush change detection
  - ❌ Missing error handling
  - ⚠️ Needs ARIA labels

**Could be:** Split screen showing code + review comments, or annotated screenshot

---

### 5. cline-5-refine.png
**Screenshot of:** Iterative refinement

**What to capture:**
- Cline chat showing follow-up prompts:
  - "Add error handling for API failures"
  - "Add ARIA labels for accessibility"
  - "Add a copy-to-clipboard button with success feedback"
- Cline's response implementing the changes
- Diff view showing the updates

---

### 6. cline-6-final.png
**Screenshot of:** Final working feature

**What to capture:**
- Running app showing the email generator component
- Working UI with generated email
- Maybe side-by-side: code + running app
- Looks polished and production-ready

---

## Tips for Taking Screenshots

1. **Clean up VSCode:**
   - Use a clear theme (light or dark, be consistent)
   - Hide unnecessary panels
   - Use reasonable font size (14-16pt for presentations)
   - Close unrelated tabs

2. **Annotate if needed:**
   - Add arrows pointing to key elements
   - Highlight important code sections
   - Add text callouts for clarity

3. **Resolution:**
   - Take at least 1920x1080
   - Save as PNG for clarity
   - Compress if needed but maintain readability

4. **Consistency:**
   - Use same VSCode theme across all screenshots
   - Same window layout if possible
   - Same project context

## Placeholders

Until real screenshots are taken, the slides reference these image paths. The presentation will work with or without images (they'll just show broken image icons or be skipped during presentation).

Consider adding these to .gitignore if you don't want to commit actual screenshots.
