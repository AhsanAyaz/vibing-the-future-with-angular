# Vibing the Future with Angular

This repository contains presentation slides and an interactive Angular WebLLM app for exploring Angular's future with on-device AI capabilities.

## 🌐 Live Demo

- **Slides**: https://ahsanayaz.github.io/vibing-the-future-with-angular/
- **Angular WebLLM App**: https://ahsanayaz.github.io/vibing-the-future-with-angular/app/

## 📦 What's Inside

### Presentation Slides
Interactive presentation slides built with [Reveal.js](https://revealjs.com/) featuring:
- Multiple presentation decks
- Storytelling techniques with emotional arcs
- Real-world statistics and performance data
- Insights from web performance experts like Addy Osmani

### Angular WebLLM App
A cutting-edge Angular 19 application demonstrating:
- **On-device AI** with Web-LLM (no API keys required!)
- **Adaptive Quiz System** with 5 question types:
  - Multiple choice
  - Text input with LLM validation
  - Slider-based answers
  - True/False with confidence
  - Multi-select questions
- **Smart Features**:
  - LLM-based answer evaluation for flexible validation
  - Duplicate question prevention
  - Question history with detailed feedback
  - Streaming AI responses
- Built with Angular Signals, Standalone Components, and modern best practices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm installed

### Development

**Slides:**
```bash
npm install
npm run dev
# Opens at http://localhost:8080
```

**Angular App:**
```bash
cd angular-webllm-app
npm install
npm start
# Opens at http://localhost:4200
```

## 📤 Deployment

The repository automatically deploys to GitHub Pages on every push to `main`.

**Manual deployment:**
```bash
./scripts/deploy.sh
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🛠️ Technology Stack

- **Slides**: Reveal.js, Webpack, ES6+
- **App**: Angular 19, Web-LLM, TailwindCSS, DaisyUI, RxJS
- **Deployment**: GitHub Actions, GitHub Pages

## 📚 Resources

- [Talk Guide](./TALK-GUIDE.md) - Detailed guide for presenters
- [Deployment Guide](./DEPLOYMENT.md) - Deployment instructions

## 🎯 Features

### Adaptive Quiz
- **Multi-type questions** for diverse learning experiences
- **LLM evaluation** that accepts reasonable answer variations
- **History tracking** to review all questions and answers
- **Manual progression** for self-paced learning
- **Intelligent duplicate prevention**

## 📝 License

MIT

## 👨‍💻 Author

**Muhammad Ahsan Ayaz**
- Website: https://codewithahsan.dev
- Email: ahsan.ubitian@gmail.com
