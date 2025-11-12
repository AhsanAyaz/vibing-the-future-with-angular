/**
 * Service Worker
 *
 * Basic service worker for future enhancements.
 * Web-LLM runs on the main thread for better compatibility.
 */

self.addEventListener("activate", function (event) {
  console.log("Service Worker activated");
});

self.addEventListener("install", function (event) {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("message", (event) => {
  console.log("Service Worker received message:", event.data);
});
