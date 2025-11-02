// Content Script v5.0 - New Tab Approach (No Pop-ups!)
(function() {
  'use strict';

  if (window.__explainPageV5) return;
  window.__explainPageV5 = true;

  // ===== CONFIGURATION =====
  const CONFIG = {
    version: '5.0.0',
    minTextLength: 100,
    maxContentLength: 50000
  };

  // ===== DICTIONARIES =====
  const WORD_SIMPLIFY = {
    'utilize': 'use', 'utilization': 'use', 'implement': 'do', 'facilitate': 'help',
    'demonstrate': 'show', 'indicate': 'show', 'establish': 'set up', 'maintain': 'keep',
    'construct': 'build', 'obtain': 'get', 'acquire': 'get', 'purchase': 'buy',
    'provide': 'give', 'assist': 'help', 'require': 'need', 'commence': 'start',
    'terminate': 'end', 'eliminate': 'remove', 'generate': 'create', 'produce': 'make',
    'however': 'but', 'therefore': 'so', 'consequently': 'so', 'furthermore': 'also',
    'moreover': 'also', 'nevertheless': 'but', 'subsequently': 'then',
    'approximately': 'about', 'predominantly': 'mostly', 'typically': 'usually',
    'substantial': 'large', 'significant': 'important', 'considerable': 'large',
    'numerous': 'many', 'sufficient': 'enough', 'inadequate': 'not enough',
    'comprehend': 'understand', 'perceive': 'see', 'anticipate': 'expect',
    'collaborate': 'work together', 'communicate': 'talk', 'participate': 'join',
    'investigate': 'look into', 'analyze': 'study', 'examine': 'check',
    'modify': 'change', 'enhance': 'improve', 'diminish': 'reduce'
  };

  const JARGON_DICT = {
    'algorithm': 'a set of steps to solve a problem',
    'API': 'a way for programs to talk to each other',
    'bandwidth': 'how much data can flow through internet',
    'cache': 'stored data to make things load faster',
    'cloud': 'storing data on internet servers',
    'database': 'an organized collection of information',
    'encryption': 'scrambling data to keep it secure',
    'hypothesis': 'an educated guess that can be tested',
    'methodology': 'the way research is done',
    'revenue': 'money earned from selling things',
    'stakeholder': 'anyone affected by a business decision',
    'diagnosis': 'identifying what illness someone has',
    'chronic': 'a long-lasting health condition',
    'paradigm': 'a way of thinking about something',
    'synthesis': 'combining parts to make a whole'
  };

  // ===== CORE FUNCTIONS =====

  // Extract all visible text from page
  function extractPageContent() {
    const excludeTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG', 'NAV', 'FOOTER', 'HEADER'];
    const elements = document.querySelectorAll('p, article, section, div, main, h1, h2, h3, h4, h5, h6, li');
    
    const textBlocks = [];
    const seenText = new Set();

    elements.forEach(el => {
      if (excludeTags.includes(el.tagName)) return;
      
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return;
      
      let text = '';
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent;
        }
      }
      
      text = text.trim();
      if (text.length > 20 && !seenText.has(text)) {
        textBlocks.push(text);
        seenText.add(text);
      }
    });

    return textBlocks.join('\n\n');
  }

  // Simplify text
  function simplifyText(text) {
    let simplified = text;
    let wordsChanged = 0;

    Object.entries(WORD_SIMPLIFY).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      const matches = simplified.match(regex);
      if (matches) {
        wordsChanged += matches.length;
        simplified = simplified.replace(regex, simple);
      }
    });

    return { text: simplified, wordsChanged };
  }

  // Highlight jargon terms
  function highlightJargon(text) {
    let highlighted = text;
    
    Object.entries(JARGON_DICT).forEach(([term, definition]) => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');
      highlighted = highlighted.replace(regex, (match) => {
        return `<span class="jargon-term" title="${definition}">${match}</span>`;
      });
    });

    return highlighted;
  }

  // Break into paragraphs
  function formatParagraphs(text) {
    return text
      .split('\n\n')
      .filter(p => p.trim().length > 0)
      .map(p => `<p>${highlightJargon(p)}</p>`)
      .join('');
  }

  // Generate simplified page HTML
  function generateSimplifiedPage(originalText, simplifiedText, stats, pageTitle, pageUrl) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simplified: ${pageTitle}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
    }

    .header-top {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }

    .icon {
      font-size: 48px;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    h1 {
      font-size: 28px;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .original-url {
      opacity: 0.9;
      font-size: 14px;
      word-break: break-all;
    }

    .original-url a {
      color: white;
      text-decoration: underline;
      transition: opacity 0.3s ease;
    }

    .original-url a:hover {
      opacity: 0.8;
    }

    .stats {
      display: flex;
      gap: 30px;
      padding: 20px 30px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-bottom: 2px solid #cbd5e1;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .stat-icon {
      font-size: 24px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .content {
      padding: 40px;
    }

    .content-section {
      margin-bottom: 40px;
    }

    .content-section h2 {
      font-size: 20px;
      color: #1e293b;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid;
      border-image: linear-gradient(90deg, #667eea, #764ba2) 1;
    }

    .content-section p {
      line-height: 1.8;
      margin-bottom: 15px;
      color: #334155;
      font-size: 16px;
    }

    .simplified-content {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      padding: 30px;
      border-radius: 12px;
      border-left: 5px solid #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    .jargon-term {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
      padding: 2px 8px;
      border-radius: 6px;
      cursor: help;
      font-weight: 600;
      position: relative;
      white-space: nowrap;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
    }

    .jargon-term:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(251, 191, 36, 0.4);
    }

    .jargon-term:hover::after {
      content: attr(title);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #1e293b;
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      white-space: normal;
      width: 250px;
      margin-bottom: 5px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      font-weight: normal;
    }

    .jargon-term:hover::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: #1e293b;
      margin-bottom: -6px;
    }

    .actions {
      padding: 30px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      display: flex;
      gap: 15px;
      justify-content: center;
      border-top: 2px solid #cbd5e1;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      font-size: 15px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .btn-success {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-secondary:hover {
      background: #667eea;
      color: white;
    }

    .theme-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50px;
      padding: 10px 20px;
      display: flex;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .theme-btn {
      background: transparent;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 5px;
      border-radius: 50%;
      transition: all 0.3s ease;
      opacity: 0.6;
    }

    .theme-btn:hover {
      opacity: 1;
      transform: scale(1.1);
    }

    .theme-btn.active {
      opacity: 1;
      background: rgba(255, 255, 255, 0.3);
    }

    /* Dark Theme */
    body.dark-theme {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    }

    body.dark-theme .container {
      background: #1e293b;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    }

    body.dark-theme .header {
      background: linear-gradient(135deg, #334155, #1e293b);
    }

    body.dark-theme .stats {
      background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
      border-bottom-color: #475569;
    }

    body.dark-theme .stat-label {
      color: #94a3b8;
    }

    body.dark-theme .content-section h2 {
      color: #f1f5f9;
    }

    body.dark-theme .content-section p {
      color: #cbd5e1;
    }

    body.dark-theme .simplified-content {
      background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
      border-left-color: #60a5fa;
    }

    body.dark-theme .actions {
      background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
      border-top-color: #475569;
    }

    @media (max-width: 768px) {
      .container {
        border-radius: 0;
      }

      .stats {
        flex-direction: column;
        gap: 15px;
      }

      .content {
        padding: 20px;
      }

      .actions {
        flex-direction: column;
      }

      .theme-toggle {
        top: 10px;
        right: 10px;
        padding: 8px 15px;
      }
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .header, .actions, .stats, .theme-toggle {
        display: none;
      }

      .container {
        box-shadow: none;
        max-width: 100%;
        border-radius: 0;
      }

      .simplified-content {
        border-left: 3px solid #3b82f6;
      }

      .jargon-term {
        background: #fbbf24;
        color: #1e293b;
        padding: 1px 4px;
        page-break-inside: avoid;
      }

      .jargon-term::after {
        content: " (" attr(title) ")";
        background: none;
        color: #64748b;
        position: static;
        transform: none;
        padding: 0;
        margin: 0;
        font-size: inherit;
        font-style: italic;
      }
    }
  </style>
</head>
<body>
  <!-- Theme Toggle -->
  <div class="theme-toggle">
    <button class="theme-btn active" onclick="setTheme('light')" title="Light Theme">☀️</button>
    <button class="theme-btn" onclick="setTheme('dark')" title="Dark Theme">🌙</button>
  </div>

  <div class="container">
    <div class="header">
      <div class="header-top">
        <span class="icon">🧠</span>
        <div>
          <h1>Simplified Content</h1>
          <div class="original-url">
            From: <a href="${pageUrl}" target="_blank">${pageUrl}</a>
          </div>
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="stat-icon">📝</span>
        <div class="stat-info">
          <span class="stat-value">${stats.wordsChanged}</span>
          <span class="stat-label">Words Simplified</span>
        </div>
      </div>
      <div class="stat">
        <span class="stat-icon">📄</span>
        <div class="stat-info">
          <span class="stat-value">${stats.paragraphs}</span>
          <span class="stat-label">Paragraphs</span>
        </div>
      </div>
      <div class="stat">
        <span class="stat-icon">💡</span>
        <div class="stat-info">
          <span class="stat-value">${stats.jargonTerms}</span>
          <span class="stat-label">Terms Explained</span>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="content-section simplified-content">
        <h2>📚 Simplified Content</h2>
        ${formatParagraphs(simplifiedText)}
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-success" onclick="downloadPDF()">
        <span>📥</span> Download as PDF
      </button>
      <button class="btn btn-primary" onclick="window.print()">
        <span>🖨️</span> Print This Page
      </button>
      <button class="btn btn-secondary" onclick="window.close()">
        <span>❌</span> Close
      </button>
      <button class="btn btn-secondary" onclick="window.open('${pageUrl}', '_blank')">
        <span>🔗</span> View Original
      </button>
    </div>
  </div>

  <script>
    // Theme Management
    function setTheme(theme) {
      document.body.className = theme === 'dark' ? 'dark-theme' : '';
      localStorage.setItem('simplify-theme', theme);
      
      // Update active button
      document.querySelectorAll('.theme-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', (theme === 'light' && idx === 0) || (theme === 'dark' && idx === 1));
      });
    }

    // PDF Download Function
    function downloadPDF() {
      const button = event.target.closest('.btn');
      const originalHTML = button.innerHTML;
      button.innerHTML = '<span>⏳</span> Generating PDF...';
      button.disabled = true;

      // Use browser's print to PDF
      window.print();
      
      setTimeout(function() {
        button.innerHTML = originalHTML;
        button.disabled = false;
      }, 1000);
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', function() {
      // Load saved theme
      const savedTheme = localStorage.getItem('simplify-theme') || 'light';
      setTheme(savedTheme);

      // Setup event listeners
      document.querySelectorAll('.theme-btn').forEach(function(btn, idx) {
        btn.addEventListener('click', function() {
          setTheme(idx === 0 ? 'light' : 'dark');
        });
      });

      document.querySelector('.btn-success').addEventListener('click', downloadPDF);
      
      document.querySelectorAll('.btn-primary')[0].addEventListener('click', function() {
        window.print();
      });
      
      document.querySelectorAll('.btn-secondary')[0].addEventListener('click', function() {
        window.close();
      });
      
      document.querySelectorAll('.btn-secondary')[1].addEventListener('click', function() {
        window.open('${pageUrl}', '_blank');
      });
    });
  </script>
</body>
</html>`;
  }

  // Process and open in new tab
  function processAndOpenNewTab(textContent) {
    if (!textContent || textContent.length < CONFIG.minTextLength) {
      alert('Not enough content to simplify. Please try a page with more text.');
      return;
    }

    // Limit content length
    if (textContent.length > CONFIG.maxContentLength) {
      textContent = textContent.substring(0, CONFIG.maxContentLength) + '...';
    }

    // Simplify the text
    const { text: simplifiedText, wordsChanged } = simplifyText(textContent);

    // Calculate stats
    const paragraphs = simplifiedText.split('\n\n').filter(p => p.trim().length > 0).length;
    const jargonTerms = Object.keys(JARGON_DICT).filter(term => 
      simplifiedText.toLowerCase().includes(term.toLowerCase())
    ).length;

    const stats = {
      wordsChanged,
      paragraphs,
      jargonTerms
    };

    // Get page info
    const pageTitle = document.title || 'Untitled Page';
    const pageUrl = window.location.href;

    // Generate HTML
    const html = generateSimplifiedPage(textContent, simplifiedText, stats, pageTitle, pageUrl);

    // Open in new tab
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();

      // Update stats
      chrome.runtime.sendMessage({
        action: 'updateStats',
        data: { pages: 1, words: wordsChanged }
      });
    } else {
      alert('Please allow pop-ups for this site to view the simplified content.');
    }
  }

  // Handle full page simplification
  function simplifyFullPage() {
    const content = extractPageContent();
    processAndOpenNewTab(content);
  }

  // Handle selected text simplification
  function simplifySelection() {
    const selectedText = window.getSelection().toString().trim();
    
    if (!selectedText) {
      alert('Please select some text first!');
      return;
    }

    if (selectedText.length < 50) {
      alert('Please select more text (at least 50 characters).');
      return;
    }

    processAndOpenNewTab(selectedText);
  }

  // ===== EVENT LISTENERS =====

  // Listen for messages from background/popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      if (request.action === 'ping') {
        sendResponse({ success: true, ready: true });
      } else if (request.action === 'simplifyPage') {
        simplifyFullPage();
        sendResponse({ success: true });
      } else if (request.action === 'simplifySelection') {
        simplifySelection();
        sendResponse({ success: true });
      } else if (request.action === 'showNotification') {
        alert(request.message);
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Content script error:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  });

  // Listen for custom events
  window.addEventListener('explain-page-trigger', simplifyFullPage);
  window.addEventListener('explain-selection-trigger', simplifySelection);

  console.log('✨ Explain This Page v5.0 loaded - Ready to simplify!');

})();