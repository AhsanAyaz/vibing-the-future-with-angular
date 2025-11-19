# 🧠 Smart Document Analyzer

A powerful, privacy-first Angular application that uses Web-LLM to analyze documents entirely in your browser. No data ever leaves your device!

![Angular](https://img.shields.io/badge/Angular-19-red)
![Web-LLM](https://img.shields.io/badge/Web--LLM-0.2.77-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📄 Document Management
- Add multiple documents via paste or file upload
- Support for text, markdown, JSON, and CSV files
- Organize and switch between documents easily

### 📊 AI-Powered Analysis
- **Intelligent Summaries**: Get concise 2-3 sentence summaries of your documents
- **Key Points Extraction**: Automatically identify the most important points
- **Sentiment Analysis**: Understand the emotional tone (positive, neutral, negative)
- **Topic Detection**: Discover main topics discussed in the document
- **Reading Statistics**: Word count and estimated reading time

### 💬 Interactive Q&A
- Ask questions about your documents
- Get contextual answers based on document content
- Maintain conversation history for follow-up questions
- Stream responses in real-time for better UX

### 🔒 Privacy-First
- **100% In-Browser Processing**: All AI runs locally using Web-LLM
- **No Server Calls**: Your documents never leave your device
- **Offline Capable**: Works without an internet connection (after initial model download)
- **Complete Privacy**: No tracking, no data collection, no cloud dependencies

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Edge, or Firefox recommended)
- At least 8GB of available disk space (for AI model caching)
- Stable internet connection for initial model download

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app will open at `http://localhost:4200`

### First-Time Setup

1. **Initialize AI Model**: Click "Initialize AI Model" button on first launch
2. **Wait for Download**: ~4GB model will download (one-time, cached for future use)
3. **Start Analyzing**: Add documents and start using AI features

**Note**: First-time model download may take 5-15 minutes depending on your connection speed. Subsequent launches are instant!

## 📖 How to Use

### Adding a Document

**Method 1: Paste Content**
1. Click the ➕ button in the sidebar
2. Enter a document title
3. Paste or type your content
4. Click "Add Document"

**Method 2: Upload File**
1. Click the ➕ button in the sidebar
2. Click "📁 Or upload a text file"
3. Select a .txt, .md, .json, or .csv file
4. Edit if needed and click "Add Document"

### Analyzing a Document

1. Select a document from the sidebar
2. Click the "📊 Analysis" tab
3. Click "🔍 Analyze" button
4. Wait for AI to generate insights (streaming in real-time)

The analysis includes:
- Executive summary
- Key points list
- Sentiment analysis
- Topic extraction
- Reading statistics

### Asking Questions

1. Select a document
2. Click the "💬 Q&A" tab
3. Type your question in the input box
4. Press Enter or click Send (➤)
5. Watch the AI answer stream in real-time

**Example Questions:**
- "What is the main argument?"
- "Summarize the key findings"
- "What are the action items?"
- "Explain the technical concepts"
- "What conclusions does the author draw?"

## 🛠️ Technical Architecture

### Key Technologies

- **Angular 19**: Latest standalone components, signals, and control flow
- **Web-LLM**: In-browser LLM powered by WebGPU
- **TypeScript**: Type-safe development
- **SCSS**: Modern, maintainable styling
- **Llama 3.1 8B**: Default AI model (configurable)

### Services

**WebLLMService** - Manages Web-LLM engine and AI operations
**DocumentAnalysisService** - Handles document management and analysis

### Components

**App Component** - Main application shell with model initialization
**DocumentAnalyzerComponent** - Document interface with tabbed views

## ⚙️ Configuration

### Changing the AI Model

Edit `src/app/services/webllm.service.ts`:

```typescript
private readonly DEFAULT_MODEL = 'Llama-3.1-8B-Instruct-q4f32_1';
```

Available models:
- `Llama-3.1-8B-Instruct-q4f32_1` (Default, ~4GB)
- `Llama-3.2-3B-Instruct-q4f32_1` (Smaller, faster)
- `Phi-3-mini-4k-instruct-q4f16_1` (Lightweight)
- `gemma-2-2b-it-q4f16_1` (Compact)

## 📊 Performance

### Bundle Size
- Initial: ~5.8 MB (includes Web-LLM runtime)
- Model: ~4 GB (downloaded separately, cached)

### Runtime Performance
- Model initialization: 30-60 seconds
- Analysis: 10-30 seconds per document
- Q&A response: 5-15 seconds per question

## 🔧 Troubleshooting

### Model Won't Load
- Check disk space (need 8+ GB free)
- Try different browser (Chrome/Edge have best WebGPU support)
- Clear browser cache and retry

### Slow Performance
- Close other browser tabs
- Use a smaller model
- Reduce document size
- Check device GPU capabilities

## 🎯 Use Cases

- Research paper analysis
- Business report summarization
- Legal document review
- Educational content study
- Content writing assistance
- Meeting notes processing

---

**Built for Angular Day Italy 2025**

*Demonstrating the power of Angular + Web-LLM for intelligent, privacy-first web applications!* 🚀
