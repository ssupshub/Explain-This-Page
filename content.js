// Content Script v5.1 - Complete Rewrite (Bug-Free)
(function() {
  'use strict';

  if (window.__explainPageV5) return;
  window.__explainPageV5 = true;

  // ===== CONFIGURATION =====
  const CONFIG = {
    version: '5.1.0',
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

  // ===== AI SIMPLIFICATION =====
  
  async function simplifyWithAI(text) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [{
            role: 'user',
            content: `You are a text simplification assistant. Simplify the following text to make it easy to understand for a middle school student (ages 11-13). Follow these rules:

1. Use simple, common words (replace complex words with everyday alternatives)
2. Break long sentences into shorter ones (max 15-20 words per sentence)
3. Explain jargon and technical terms in parentheses when first used
4. Keep the same meaning and all important information
5. Use active voice instead of passive voice
6. Remove unnecessary complexity while staying accurate
7. Maintain a friendly, conversational tone

Text to simplify:
${text}

Return ONLY the simplified text, nothing else.`
          }]
        })
      });

      if (!response.ok) {
        throw new Error('AI simplification failed');
      }

      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        return {
          text: data.content[0].text,
          wordsChanged: Math.floor(text.split(' ').length * 0.3), // Estimate
          isAI: true
        };
      } else {
        throw new Error('Invalid AI response');
      }
    } catch (error) {
      console.error('AI simplification error:', error);
      // Fallback to dictionary method
      return simplifyWithDictionary(text);
    }
  }

  function simplifyWithDictionary(text) {
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

    return { text: simplified, wordsChanged, isAI: false };
  }

  function highlightJargon(text) {
    let highlighted = text;
    
    Object.entries(JARGON_DICT).forEach(([term, definition]) => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');
      highlighted = highlighted.replace(regex, (match) => {
        return `<span class="jargon-term" data-tip="${definition}">${match}</span>`;
      });
    });

    return highlighted;
  }

  function formatParagraphs(text) {
    return text
      .split('\n\n')
      .filter(p => p.trim().length > 0)
      .map(p => `<p>${highlightJargon(p)}</p>`)
      .join('');
  }

  async function processAndOpenNewTab(textContent) {
    if (!textContent || textContent.length < CONFIG.minTextLength) {
      alert('Not enough content to simplify. Please try a page with more text.');
      return;
    }

    // Show processing indicator
    showProcessingIndicator();

    // Limit content length for AI processing
    let processText = textContent;
    if (textContent.length > 15000) {
      processText = textContent.substring(0, 15000) + '...';
    }

    try {
      // Try AI simplification first
      const result = await simplifyWithAI(processText);
      const simplifiedText = result.text;
      const wordsChanged = result.wordsChanged;
      const isAI = result.isAI;

      const paragraphs = simplifiedText.split('\n\n').filter(p => p.trim().length > 0).length;
      const jargonTerms = Object.keys(JARGON_DICT).filter(term => 
        simplifiedText.toLowerCase().includes(term.toLowerCase())
      ).length;

      const stats = { 
        wordsChanged, 
        paragraphs, 
        jargonTerms,
        method: isAI ? 'AI-Powered' : 'Dictionary'
      };
      
      const pageTitle = document.title || 'Untitled Page';
      const pageUrl = window.location.href;

      hideProcessingIndicator();

      const html = buildHTML(simplifiedText, stats, pageTitle, pageUrl);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        alert('Please allow pop-ups for this site to view the simplified content.');
        return;
      }

      chrome.runtime.sendMessage({
        action: 'updateStats',
        data: { pages: 1, words: wordsChanged }
      });
    } catch (error) {
      console.error('Processing error:', error);
      hideProcessingIndicator();
      alert('Failed to simplify content. Please try again.');
    }
  }

  function showProcessingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'simplify-processing';
    indicator.innerHTML = `
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999999;background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:30px 50px;border-radius:15px;box-shadow:0 20px 60px rgba(0,0,0,0.4);text-align:center;font-family:system-ui,sans-serif;">
        <div style="font-size:48px;margin-bottom:15px;animation:spin 1s linear infinite;">🧠</div>
        <div style="font-size:20px;font-weight:600;margin-bottom:10px;">AI Simplifying Content...</div>
        <div style="font-size:14px;opacity:0.9;">This may take 10-30 seconds</div>
      </div>
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    `;
    document.body.appendChild(indicator);
  }

  function hideProcessingIndicator() {
    const indicator = document.getElementById('simplify-processing');
    if (indicator) indicator.remove();
  }

  function buildHTML(simplifiedText, stats, pageTitle, pageUrl) {
    const contentHTML = formatParagraphs(simplifiedText);
    const css = getCSS();
    const js = getJS(pageUrl);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Simplified: ${escapeHtml(pageTitle)}</title>
${css}
</head>
<body>
<div class="theme-toggle">
<button class="theme-btn light-btn" data-theme="light">☀️</button>
<button class="theme-btn dark-btn" data-theme="dark">🌙</button>
</div>
<div class="container">
<div class="header">
<div class="header-top">
<span class="icon">🧠</span>
<div>
<h1>Simplified Content</h1>
<div class="url-link">From: <a href="${escapeHtml(pageUrl)}" target="_blank">${escapeHtml(pageUrl)}</a></div>
</div>
</div>
</div>
<div class="stats">
<div class="stat"><span class="stat-icon">🤖</span><div class="stat-info"><span class="stat-value">${stats.method}</span><span class="stat-label">Method</span></div></div>
<div class="stat"><span class="stat-icon">📝</span><div class="stat-info"><span class="stat-value">${stats.wordsChanged}</span><span class="stat-label">Words Changed</span></div></div>
<div class="stat"><span class="stat-icon">📄</span><div class="stat-info"><span class="stat-value">${stats.paragraphs}</span><span class="stat-label">Paragraphs</span></div></div>
</div>
<div class="content">
<div class="simplified-content">
<h2>📚 Simplified Content</h2>
${contentHTML}
</div>
</div>
<div class="actions">
<button class="btn btn-success" id="pdf-btn">📥 Download as PDF</button>
<button class="btn btn-primary" id="print-btn">🖨️ Print</button>
<button class="btn btn-secondary" id="close-btn">❌ Close</button>
<button class="btn btn-secondary" id="original-btn">🔗 View Original</button>
</div>
</div>
${js}
</body>
</html>`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getCSS() {
    return `<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;padding:20px}
.container{max-width:900px;margin:0 auto;background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden}
.header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:30px}
.header-top{display:flex;align-items:center;gap:15px}
.icon{font-size:48px;animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
h1{font-size:28px;margin-bottom:10px}
.url-link{opacity:0.9;font-size:14px;word-break:break-all}
.url-link a{color:#fff;text-decoration:underline}
.stats{display:flex;gap:30px;padding:20px 30px;background:linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%);border-bottom:2px solid #cbd5e1}
.stat{display:flex;align-items:center;gap:10px}
.stat-icon{font-size:24px}
.stat-info{display:flex;flex-direction:column}
.stat-value{font-size:24px;font-weight:700;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-label{font-size:12px;color:#64748b;text-transform:uppercase}
.content{padding:40px}
.simplified-content{background:linear-gradient(135deg,#dbeafe 0%,#bfdbfe 100%);padding:30px;border-radius:12px;border-left:5px solid #3b82f6}
.simplified-content h2{font-size:20px;color:#1e293b;margin-bottom:20px;padding-bottom:10px;border-bottom:3px solid;border-image:linear-gradient(90deg,#667eea,#764ba2) 1}
.simplified-content p{line-height:1.8;margin-bottom:15px;color:#334155;font-size:16px}
.jargon-term{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#fff;padding:2px 8px;border-radius:6px;cursor:help;font-weight:600;position:relative}
.jargon-term:hover::after{content:attr(data-tip);position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;white-space:normal;width:250px;margin-bottom:5px;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-weight:normal}
.actions{padding:30px;background:linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%);display:flex;gap:15px;justify-content:center;flex-wrap:wrap}
.btn{padding:12px 24px;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:15px;transition:all 0.3s ease;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
.btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.2)}
.btn-primary{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff}
.btn-success{background:linear-gradient(135deg,#10b981,#059669);color:#fff}
.btn-secondary{background:#fff;color:#667eea;border:2px solid #667eea}
.btn-secondary:hover{background:#667eea;color:#fff}
.theme-toggle{position:fixed;top:20px;right:20px;background:rgba(255,255,255,0.2);backdrop-filter:blur(10px);border:2px solid rgba(255,255,255,0.3);border-radius:50px;padding:10px 20px;display:flex;gap:10px;z-index:1000}
.theme-btn{background:transparent;border:none;font-size:24px;cursor:pointer;padding:5px;border-radius:50%;transition:all 0.3s ease;opacity:0.6}
.theme-btn:hover{opacity:1;transform:scale(1.1)}
.theme-btn.active{opacity:1;background:rgba(255,255,255,0.3)}
body.dark{background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%)}
body.dark .container{background:#1e293b}
body.dark .header{background:linear-gradient(135deg,#334155,#1e293b)}
body.dark .stats{background:linear-gradient(135deg,#334155 0%,#1e293b 100%)}
body.dark .stat-label{color:#94a3b8}
body.dark .simplified-content{background:linear-gradient(135deg,#1e3a5f 0%,#2c5282 100%)}
body.dark .simplified-content h2{color:#f1f5f9}
body.dark .simplified-content p{color:#cbd5e1}
body.dark .actions{background:linear-gradient(135deg,#334155 0%,#1e293b 100%)}
@media(max-width:768px){.stats{flex-direction:column;gap:15px}.content{padding:20px}.actions{flex-direction:column}}
@media print{body{background:#fff;padding:0}.header,.actions,.stats,.theme-toggle{display:none}.container{box-shadow:none;max-width:100%}}
</style>`;
  }

  function getJS(pageUrl) {
    return `<script>
(function(){
var savedTheme=localStorage.getItem("theme")||"light";
if(savedTheme==="dark")document.body.classList.add("dark");
document.querySelectorAll(".theme-btn").forEach(function(btn){
if((savedTheme==="light"&&btn.classList.contains("light-btn"))||(savedTheme==="dark"&&btn.classList.contains("dark-btn")))btn.classList.add("active");
btn.onclick=function(){
var theme=this.getAttribute("data-theme");
document.body.className=theme==="dark"?"dark":"";
localStorage.setItem("theme",theme);
document.querySelectorAll(".theme-btn").forEach(function(b){b.classList.remove("active")});
this.classList.add("active");
};
});
document.getElementById("pdf-btn").onclick=function(){
var btn=this;
var html=btn.innerHTML;
btn.innerHTML="⏳ Generating...";
btn.disabled=true;
window.print();
setTimeout(function(){btn.innerHTML=html;btn.disabled=false},1000);
};
document.getElementById("print-btn").onclick=function(){window.print()};
document.getElementById("close-btn").onclick=function(){window.close()};
document.getElementById("original-btn").onclick=function(){window.open("${pageUrl}","_blank")};
})();
</script>`;
  }

  async function simplifyFullPage() {
    const content = extractPageContent();
    await processAndOpenNewTab(content);
  }

  async function simplifySelection() {
    const selectedText = window.getSelection().toString().trim();
    
    if (!selectedText) {
      alert('Please select some text first!');
      return;
    }

    if (selectedText.length < 50) {
      alert('Please select more text (at least 50 characters).');
      return;
    }

    await processAndOpenNewTab(selectedText);
  }

  // ===== EVENT LISTENERS =====
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

  window.addEventListener('explain-page-trigger', simplifyFullPage);
  window.addEventListener('explain-selection-trigger', simplifySelection);

  console.log('✨ Explain This Page v5.1 loaded');

})();