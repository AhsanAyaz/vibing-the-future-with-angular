/**
 * Web-LLM Web Worker
 *
 * Handles Web-LLM model inference in a separate worker thread.
 * This keeps the UI thread responsive during model operations.
 */

import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg) => {
  handler.onmessage(msg);
};

console.log("Web-LLM Worker initialized");
