// Shim process for browser compatibility with Node-compatible SDKs
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.process = window.process || {};
  // @ts-ignore
  window.process.env = window.process.env || {};
  // @ts-ignore
  window.process.env.GEMINI_API_KEY = window.process.env.GEMINI_API_KEY || '';
  // @ts-ignore
  window.process.browser = true;
}
