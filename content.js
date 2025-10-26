// Content Script v4.0 - Enhanced AI Simplification
(function() {
  'use strict';

  if (window.__explainPageV4) return;
  window.__explainPageV4 = true;

  // ===== CONFIGURATION =====
  const CONFIG = {
    version: '4.0.0',
    minTextLength: 200,
    complexity: {
      longWordChars: 10,
      longWordRatio: 0.12,
      longSentenceWords: 20,
      longSentenceRatio: 0.25,
      jargonMinCount: 2
    },
    summaryLength: {
      elementary: 3,
      middle: 4,
      high: 5
    },
    maxSentenceWords: {
      elementary: 12,
      middle: 18,
      high: 25
    }
  };

  // ===== ENHANCED DICTIONARIES =====
  
  // Comprehensive jargon dictionary with simple explanations
  const JARGON_DICT = {
    // Technology
    'algorithm': 'a set of steps to solve a problem',
    'API': 'a way for programs to talk to each other',
    'bandwidth': 'how much data can flow through internet',
    'browser': 'a program to view websites like Chrome or Firefox',
    'cache': 'stored data to make things load faster',
    'cloud': 'storing data on internet servers instead of your computer',
    'database': 'an organized collection of information',
    'encryption': 'scrambling data to keep it secure',
    'firewall': 'security system that blocks dangerous internet traffic',
    'HTML': 'the code that creates web pages',
    'JavaScript': 'a programming language that makes websites interactive',
    'malware': 'harmful software that can damage your computer',
    'server': 'a powerful computer that stores websites',
    'software': 'programs and apps that run on computers',
    'URL': 'the web address you type in the browser',
    'virus': 'harmful program that spreads between computers',
    'WiFi': 'wireless internet connection',
    
    // Science & Research
    'hypothesis': 'an educated guess that can be tested',
    'theory': 'an explanation backed by evidence',
    'experiment': 'a test to see if something is true',
    'data': 'facts and numbers collected for analysis',
    'variable': 'something that can change in an experiment',
    'correlation': 'when two things tend to happen together',
    'methodology': 'the way research is done',
    'analysis': 'careful study to understand something',
    'empirical': 'based on observation and testing',
    'peer review': 'when experts check each others work',
    
    // Business & Finance
    'revenue': 'money earned from selling things',
    'profit': 'money left after paying all costs',
    'investment': 'spending money to earn more later',
    'stakeholder': 'anyone affected by a business decision',
    'marketing': 'promoting products to customers',
    'strategy': 'a plan to achieve a goal',
    'budget': 'a plan for spending money',
    'forecast': 'predicting what will happen',
    'asset': 'something valuable that you own',
    'liability': 'money that you owe to others',
    
    // Medical & Health
    'diagnosis': 'identifying what illness someone has',
    'symptom': 'a sign that something is wrong with health',
    'treatment': 'medical care to help cure illness',
    'chronic': 'a long-lasting health condition',
    'acute': 'sudden and severe illness',
    'therapy': 'treatment to improve health',
    'immunity': 'body protection against disease',
    'vaccine': 'medicine to prevent disease',
    'prescription': 'doctors order for medicine',
    'metabolism': 'how body turns food into energy',
    
    // General Academic
    'concept': 'an idea or principle',
    'paradigm': 'a way of thinking about something',
    'framework': 'a structure to organize ideas',
    'context': 'the situation surrounding something',
    'criteria': 'standards used to judge something',
    'objective': 'a goal or target',
    'subjective': 'based on personal opinion',
    'quantitative': 'measured with numbers',
    'qualitative': 'described with words not numbers',
    'synthesis': 'combining parts to make a whole'
  };

  // Extensive word simplifications
  const WORD_SIMPLIFY = {
    // Common complex words
    'utilize': 'use',
    'utilization': 'use',
    'implement': 'do',
    'implementation': 'doing',
    'facilitate': 'help',
    'demonstrate': 'show',
    'indicate': 'show',
    'establish': 'set up',
    'maintain': 'keep',
    'construct': 'build',
    'obtain': 'get',
    'acquire': 'get',
    'purchase': 'buy',
    'provide': 'give',
    'assist': 'help',
    'require': 'need',
    'commence': 'start',
    'terminate': 'end',
    'eliminate': 'remove',
    'generate': 'create',
    'produce': 'make',
    'develop': 'create',
    'create': 'make',
    
    // Transition words
    'however': 'but',
    'therefore': 'so',
    'consequently': 'so',
    'furthermore': 'also',
    'moreover': 'also',
    'nevertheless': 'but',
    'subsequently': 'then',
    'approximately': 'about',
    'predominantly': 'mostly',
    'typically': 'usually',
    
    // Adjectives
    'substantial': 'large',
    'significant': 'important',
    'considerable': 'large',
    'numerous': 'many',
    'sufficient': 'enough',
    'inadequate': 'not enough',
    'exceptional': 'outstanding',
    'optimal': 'best',
    'minimal': 'very small',
    'maximum': 'most',
    'minimum': 'least',
    
    // Verbs
    'comprehend': 'understand',
    'perceive': 'see',
    'anticipate': 'expect',
    'collaborate': 'work together',
    'communicate': 'talk',
    'participate': 'join',
    'investigate': 'look into',
    'analyze': 'study',
    'examine': 'check',
    'modify': 'change',
    'enhance': 'improve',
    'diminish': 'reduce',
    'expand': 'grow',
    'restrict': 'limit',
    
    // Nouns
    'methodology': 'method',
    'infrastructure': 'basic system',
    'paradigm': 'model',
    'component': 'part',
    'mechanism': 'way',
    'procedure': 'process',
    'objective': 'goal',
    'capability': 'ability',
    'phenomenon': 'event',
    'characteristic': 'trait',
    
    // Phrases (handle as single words)
    'in order to': 'to',
    'for the purpose of': 'to',
    'with regard to': 'about',
    'in relation to': 'about',
    'as a result of': 'because of',
    'due to the fact that': 'because',
    'at this point in time': 'now',
    'in the event that': 'if'
  };

  // Stop words for summarization
  const STOP_WORDS = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'
  ]);

  // ===== CORE FUNCTIONS =====

  // Extract visible text from page
  function extractText() {
    const excludeTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG', 'NAV', 'FOOTER', 'HEADER'];
    const textChunks = [];
    
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (excludeTags.includes(node.tagName)) return NodeFilter.FILTER_REJECT;
          
          const style = window.getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      const text = (node.innerText || '').trim();
      if (text && text.length > 30) {
        textChunks.push(text);
      }
    }

    return textChunks.join('\n\n') || document.body.innerText || '';
  }

  // Analyze text complexity
  function analyzeComplexity(text) {
    if (!text || text.length < CONFIG.minTextLength) {
      return { isComplex: false, score: 0, reasons: [] };
    }

    const words = text.match(/\b[a-z]+\b/gi) || [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const reasons = [];
    let score = 0;

    // Check long words
    const longWords = words.filter(w => w.length >= CONFIG.complexity.longWordChars);
    const longWordRatio = words.length > 0 ? longWords.length / words.length : 0;
    
    if (longWordRatio > CONFIG.complexity.longWordRatio) {
      score += 2;
      reasons.push(`${(longWordRatio * 100).toFixed(0)}% long words`);
    }

    // Check jargon
    const textLower = text.toLowerCase();
    const jargonFound = Object.keys(JARGON_DICT).filter(term => 
      textLower.includes(term.toLowerCase())
    );
    
    if (jargonFound.length >= CONFIG.complexity.jargonMinCount) {
      score += 3;
      reasons.push(`${jargonFound.length} technical terms`);
    }

    // Check long sentences
    const longSentences = sentences.filter(s => 
      (s.match(/\b[a-z]+\b/gi) || []).length > CONFIG.complexity.longSentenceWords
    );
    const longSentRatio = sentences.length > 0 ? longSentences.length / sentences.length : 0;
    
    if (longSentRatio > CONFIG.complexity.longSentenceRatio) {
      score += 2;
      reasons.push(`${(longSentRatio * 100).toFixed(0)}% long sentences`);
    }

    // Check complex words
    const complexWords = words.filter(w => 
      WORD_SIMPLIFY[w.toLowerCase()]
    );
    if (complexWords.length > 8) {
      score += 1;
      reasons.push(`${complexWords.length} complex words`);
    }

    return {
      isComplex: score >= 4,
      score,
      reasons,
      stats: {
        words: words.length,
        sentences: sentences.length,
        jargonTerms: jargonFound.length
      }
    };
  }

  // Improved text summarization
  function summarizeText(text, level = 'middle') {
    const sentences = (text.match(/[^.!?]+[.!?]+/g) || [])
      .map(s => s.trim())
      .filter(s => s.split(/\s+/).length > 5);
    
    if (sentences.length === 0) return [];

    const sentenceCount = CONFIG.summaryLength[level] || 4;
    if (sentences.length <= sentenceCount) return sentences;

    // Calculate word frequencies
    const wordFreq = {};
    sentences.forEach(sent => {
      const words = sent.toLowerCase().match(/\b[a-z]+\b/g) || [];
      words.forEach(word => {
        if (!STOP_WORDS.has(word) && word.length > 3) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });
    });

    // Score sentences
    const scored = sentences.map((sent, idx) => {
      const words = sent.toLowerCase().match(/\b[a-z]+\b/g) || [];
      let score = 0;
      
      words.forEach(word => {
        if (!STOP_WORDS.has(word)) {
          score += wordFreq[word] || 0;
        }
      });
      
      // Normalize by length
      score = words.length > 0 ? score / Math.sqrt(words.length) : 0;
      
      // Position bonus (first and last sentences more important)
      if (idx < sentences.length * 0.2) score *= 1.5;
      if (idx > sentences.length * 0.8) score *= 1.3;
      
      return { sent, score, idx };
    });

    // Return top sentences in original order
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, sentenceCount)
      .sort((a, b) => a.idx - b.idx)
      .map(item => item.sent);
  }

  // Simplify text
  function simplifyText(text, stats) {
    let simplified = text;
    
    // Replace complex words
    Object.entries(WORD_SIMPLIFY).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      const matches = simplified.match(regex);
      if (matches) {
        stats.wordsSimplified += matches.length;
        simplified = simplified.replace(regex, simple);
      }
    });

    return simplified;
  }

  // Break long sentences
  function breakSentences(sentence, maxWords) {
    const words = sentence.split(/\s+/);
    if (words.length <= maxWords) return [sentence];

    const chunks = [];
    const breakPoints = [', ', '; ', ' and ', ' but ', ' or ', ' because ', ' when ', ' if '];
    
    // Try to break at natural points
    let remaining = sentence;
    while (remaining.length > 0) {
      if (remaining.split(/\s+/).length <= maxWords) {
        chunks.push(remaining);
        break;
      }
      
      let found = false;
      for (const bp of breakPoints) {
        const idx = remaining.indexOf(bp, maxWords * 5);
        if (idx > 0 && idx < remaining.length * 0.7) {
          chunks.push(remaining.substring(0, idx).trim());
          remaining = remaining.substring(idx + bp.length).trim();
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Fallback: break by word count
        const chunk = remaining.split(/\s+/).slice(0, maxWords).join(' ');
        chunks.push(chunk);
        remaining = remaining.substring(chunk.length).trim();
      }
    }
    
    return chunks.filter(c => c.length > 0);
  }

  // Create simplified content with jargon highlighting
  function createSimplifiedContent(sentences, level, stats) {
    const fragment = document.createDocumentFragment();
    const maxWords = CONFIG.maxSentenceWords[level] || 18;
    
    sentences.forEach(sentence => {
      const simplified = simplifyText(sentence, stats);
      const chunks = breakSentences(simplified, maxWords);
      
      chunks.forEach(chunk => {
        const p = document.createElement('p');
        p.className = 'explain-simplified-paragraph';
        
        // Highlight jargon terms
        let html = chunk;
        Object.entries(JARGON_DICT).forEach(([term, definition]) => {
          const regex = new RegExp(`\\b(${term})\\b`, 'gi');
          html = html.replace(regex, (match) => {
            stats.jargonExplained++;
            return `<span class="explain-jargon-term" data-definition="${definition}" title="${definition}">${match}</span>`;
          });
        });
        
        p.innerHTML = html;
        fragment.appendChild(p);
      });
    });
    
    return fragment;
  }

  // ===== UI FUNCTIONS =====

  // Show complexity banner
  function showBanner() {
    if (document.getElementById('explain-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'explain-banner';
    banner.className = 'explain-banner';
    banner.innerHTML = `
      <div class="explain-banner-content">
        <div class="explain-banner-icon">🧠</div>
        <div class="explain-banner-text">
          <div class="explain-banner-title">Complex Content Detected</div>
          <div class="explain-banner-subtitle">Let me simplify this for you</div>
        </div>
        <button class="explain-banner-btn">Simplify</button>
        <button class="explain-banner-close">×</button>
      </div>
    `;

    document.body.appendChild(banner);

    banner.querySelector('.explain-banner-btn').onclick = () => {
      banner.remove();
      showOverlay();
    };

    banner.querySelector('.explain-banner-close').onclick = () => {
      banner.remove();
    };

    setTimeout(() => banner.classList.add('explain-banner-visible'), 100);
    setTimeout(() => banner.remove(), 10000);
  }

  // Show main overlay
  function showOverlay() {
    if (document.getElementById('explain-overlay')) return;

    const text = extractText();
    if (!text || text.length < 50) {
      showNotification('Not enough content to simplify', 'warning');
      return;
    }

    createOverlay(text);
  }

  // Create overlay UI
  function createOverlay(text) {
    const overlay = document.createElement('div');
    overlay.id = 'explain-overlay';
    overlay.className = 'explain-overlay';

    chrome.storage.sync.get(['readingLevel'], (data) => {
      const level = data.readingLevel || 'middle';
      
      overlay.innerHTML = `
        <div class="explain-backdrop"></div>
        <div class="explain-content">
          <div class="explain-header">
            <div class="explain-title">
              <span class="explain-icon">🧠</span>
              <span>Page Simplified</span>
            </div>
            <select class="explain-level-select" id="level-select">
              <option value="elementary" ${level === 'elementary' ? 'selected' : ''}>🌟 Elementary</option>
              <option value="middle" ${level === 'middle' ? 'selected' : ''}>📚 Middle School</option>
              <option value="high" ${level === 'high' ? 'selected' : ''}>🎓 High School</option>
            </select>
            <button class="explain-close" id="close-overlay">×</button>
          </div>
          
          <div class="explain-body">
            <div class="explain-panel">
              <h3>Original Content</h3>
              <div class="explain-original" id="original-content">
                <div class="explain-loading">Analyzing...</div>
              </div>
            </div>
            
            <div class="explain-panel">
              <h3>Simplified Content</h3>
              <div class="explain-simplified" id="simplified-content">
                <div class="explain-loading">Simplifying...</div>
              </div>
            </div>
          </div>
          
          <div class="explain-footer">
            <div class="explain-stats">
              <span>📝 Words simplified: <strong id="words-count">0</strong></span>
              <span>💡 Terms explained: <strong id="terms-count">0</strong></span>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      setTimeout(() => overlay.classList.add('explain-overlay-visible'), 50);

      // Event listeners
      overlay.querySelector('#close-overlay').onclick = () => closeOverlay(overlay);
      overlay.querySelector('.explain-backdrop').onclick = () => closeOverlay(overlay);
      
      const levelSelect = overlay.querySelector('#level-select');
      levelSelect.onchange = () => {
        const newLevel = levelSelect.value;
        chrome.storage.sync.set({ readingLevel: newLevel });
        processContent(text, newLevel, overlay);
      };

      // Initial processing
      processContent(text, level, overlay);
    });
  }

  // Process and display content
  function processContent(text, level, overlay) {
    const stats = { wordsSimplified: 0, jargonExplained: 0 };
    
    // Show original summary
    const originalSummary = summarizeText(text, level);
    const originalContainer = overlay.querySelector('#original-content');
    originalContainer.innerHTML = '';
    
    const originalFragment = document.createDocumentFragment();
    originalSummary.forEach(sentence => {
      const p = document.createElement('p');
      p.textContent = sentence;
      originalFragment.appendChild(p);
    });
    originalContainer.appendChild(originalFragment);

    // Show simplified content
    const simplifiedContainer = overlay.querySelector('#simplified-content');
    simplifiedContainer.innerHTML = '';
    const simplifiedFragment = createSimplifiedContent(originalSummary, level, stats);
    simplifiedContainer.appendChild(simplifiedFragment);

    // Update stats
    overlay.querySelector('#words-count').textContent = stats.wordsSimplified;
    overlay.querySelector('#terms-count').textContent = stats.jargonExplained;

    // Add tooltip listeners
    setTimeout(() => addTooltipListeners(simplifiedContainer), 100);

    // Update extension stats
    chrome.runtime.sendMessage({
      action: 'updateStats',
      data: { pages: 1, words: stats.wordsSimplified }
    });
  }

  // Add interactive tooltips to jargon terms
  function addTooltipListeners(container) {
    const terms = container.querySelectorAll('.explain-jargon-term');
    
    terms.forEach(term => {
      term.addEventListener('mouseenter', (e) => {
        const definition = e.target.dataset.definition;
        showTooltip(e.target, definition);
      });
      
      term.addEventListener('mouseleave', () => {
        removeTooltip();
      });
    });
  }

  // Show tooltip
  function showTooltip(element, text) {
    removeTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'explain-tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 10;
    
    // Adjust if off screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
      top = rect.bottom + 10;
      tooltip.classList.add('explain-tooltip-bottom');
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    
    setTimeout(() => tooltip.classList.add('explain-tooltip-visible'), 10);
  }

  // Remove tooltip
  function removeTooltip() {
    const existing = document.querySelector('.explain-tooltip');
    if (existing) existing.remove();
  }

  // Close overlay
  function closeOverlay(overlay) {
    overlay.classList.remove('explain-overlay-visible');
    setTimeout(() => overlay.remove(), 300);
  }

  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `explain-notification explain-notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('explain-notification-visible'), 10);
    setTimeout(() => {
      notification.classList.remove('explain-notification-visible');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ===== INITIALIZATION =====

  function init() {
    // Check if auto-detect is enabled
    chrome.storage.sync.get(['autoDetect'], (data) => {
      if (data.autoDetect !== false) {
        setTimeout(() => {
          const text = extractText();
          const analysis = analyzeComplexity(text);
          
          if (analysis.isComplex) {
            console.log('Complex content detected:', analysis);
            showBanner();
          }
        }, 2000);
      }
    });

    // Listen for manual trigger
    window.addEventListener('explain-page-trigger', () => {
      showOverlay();
    });
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
