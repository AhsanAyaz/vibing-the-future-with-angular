/// <reference lib="webworker" />

/**
 * Web-LLM Web Worker
 *
 * Handles Web-LLM model inference in a separate worker thread.
 * This keeps the UI thread responsive during model operations.
 */

console.log('🔧 Worker script starting...');

// Static import to ensure Web-LLM is bundled into the worker
import * as webllm from '@mlc-ai/web-llm';

console.log('📦 Web-LLM imported:', webllm);
console.log('📋 Available exports:', Object.keys(webllm));

let handler: any;

try {
  if (webllm.WebWorkerMLCEngineHandler) {
    console.log('✅ Creating WebWorkerMLCEngineHandler...');
    handler = new webllm.WebWorkerMLCEngineHandler();
    console.log('✅ WebWorkerMLCEngineHandler created successfully');

    self.onmessage = (msg: MessageEvent) => {
      console.log('📨 Worker received message:', msg.data);
      try {
        handler.onmessage(msg);
      } catch (error) {
        console.error('❌ Error in handler.onmessage:', error);
      }
    };
  } else {
    console.error('❌ WebWorkerMLCEngineHandler not found in web-llm exports');
    console.error('Available:', Object.keys(webllm));
  }
} catch (error) {
  console.error('❌ Error in worker initialization:', error);
}

console.log('✅ Worker script loaded and ready');
