// Content Script

// Listen for messages
chrome.runtime.onMessage.addListener(
  (request: { action: string; text?: string }) => {
    if (request.action === "simplify") {
      handleSimplify();
    } else if (request.action === "simplifySelection") {
      handleSimplify(request.text);
    }
  }
);

async function handleSimplify(selectionText?: string) {
  showSpinner();

  // Give UI a moment to render
  await new Promise((r) => setTimeout(r, 100));

  try {
    const title = document.title;
    const content = selectionText || extractContent();

    if (!content || content.length < 100) {
      alert("Not enough text found to simplify.");
      hideSpinner();
      return;
    }

    // Save to storage
    await chrome.storage.local.set({
      simplifiedContent: {
        title,
        content,
        originalUrl: window.location.href,
        timestamp: Date.now(),
      },
    });

    // Notify background to open viewer
    chrome.runtime.sendMessage({ action: "openViewer" });

    // Hide spinner after a delay to ensure smooth transition
    setTimeout(hideSpinner, 1000);
  } catch (err) {
    console.error(err);
    alert("Error simplifying page.");
    hideSpinner();
  }
}

function extractContent() {
  // Basic extraction heuristics
  // Prioritize <article>, <main>, or commonly used content containers
  const selectors = [
    "article",
    "main",
    '[role="main"]',
    ".content",
    "#content",
    ".post-content",
    ".entry-content",
  ];

  let root: Element | null = null;
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent && el.textContent.length > 500) {
      root = el;
      break;
    }
  }

  if (!root) root = document.body;

  // Clone to avoid modifying page
  const clone = root.cloneNode(true) as HTMLElement;

  // Remove clutter
  const removeTags = [
    "script",
    "style",
    "noscript",
    "iframe",
    "svg",
    "nav",
    "footer",
    "header",
    "aside",
  ];
  removeTags.forEach((tag) => {
    const els = clone.querySelectorAll(tag);
    els.forEach((el) => el.remove());
  });

  return clone.innerText || clone.textContent || "";
}

function showSpinner() {
  if (document.getElementById("etp-spinner")) return;

  const style = document.createElement("style");
  style.id = "etp-spinner-style";
  style.textContent = `
    #etp-spinner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(8px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
      animation: etp-fade-in 0.3s ease;
    }
    .etp-card {
      background: rgba(20, 20, 30, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 40px;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      color: white;
    }
    .etp-loader {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(139, 92, 246, 0.3);
      border-top-color: #8b5cf6;
      border-radius: 50%;
      animation: etp-spin 1s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes etp-spin { to { transform: rotate(360deg); } }
    @keyframes etp-fade-in { from { opacity: 0; } to { opacity: 1; } }
  `;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.id = "etp-spinner";
  container.innerHTML = `
    <div class="etp-card">
      <div class="etp-loader"></div>
      <div style="font-size: 18px; font-weight: 600;">Simplifying Page...</div>
      <div style="font-size: 14px; opacity: 0.6; margin-top: 5px;">Powered by AI</div>
    </div>
  `;
  document.body.appendChild(container);
}

function hideSpinner() {
  const el = document.getElementById("etp-spinner");
  if (el) el.remove();
  const style = document.getElementById("etp-spinner-style");
  if (style) style.remove();
}
