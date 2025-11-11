/**
 * Service Worker for Web-LLM
 *
 * Handles Web-LLM model inference in a separate worker thread.
 * This approach:
 * - Keeps the UI thread responsive during model operations
 * - Maintains model persistence across page visits
 * - Enables better resource management
 *
 * Note: Service Worker lifecycle is managed by the browser and can be
 * terminated at any time without notification.
 */

import { ServiceWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

let handler: ServiceWorkerMLCEngineHandler;

self.addEventListener("activate", function (event) {
  handler = new ServiceWorkerMLCEngineHandler();
  console.log("Web-LLM Service Worker activated and ready");
});

// Keep the service worker alive with periodic messages
self.addEventListener("message", (event) => {
  // Handler will process messages from the main thread
  console.log("Service Worker received message:", event.data);
});
