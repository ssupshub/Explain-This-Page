// Popup Script v5.0 - Error Fixed
'use strict';

class PopupController {
  constructor() {
    this.elements = {
      explainBtn: document.getElementById('explainBtn'),
      pagesCount: document.getElementById('pagesCount'),
      wordsCount: document.getElementById('wordsCount')
    };
    
    this.init();
  }

  init() {
    // Verify elements exist before proceeding
    if (!this.elements.explainBtn || !this.elements.pagesCount || !this.elements.wordsCount) {
      console.error('Required popup elements not found');
      return;
    }

    this.loadStats();
    this.attachEventListeners();
  }

  loadStats() {
    chrome.storage.sync.get(['pagesExplained', 'wordsSimplified'], (data) => {
      this.updateStats({
        pagesExplained: data.pagesExplained || 0,
        wordsSimplified: data.wordsSimplified || 0
      });
    });
  }

  updateStats(stats) {
    if (this.elements.pagesCount && this.elements.wordsCount) {
      this.animateNumber(this.elements.pagesCount, stats.pagesExplained);
      this.animateNumber(this.elements.wordsCount, stats.wordsSimplified);
    }
  }

  animateNumber(element, target) {
    if (!element) return;
    
    const current = parseInt(element.textContent) || 0;
    const increment = Math.ceil((target - current) / 20);
    
    if (current < target) {
      element.textContent = Math.min(current + increment, target);
      setTimeout(() => this.animateNumber(element, target), 20);
    } else {
      element.textContent = target;
    }
  }

  attachEventListeners() {
    if (!this.elements.explainBtn) return;

    // Explain button
    this.elements.explainBtn.addEventListener('click', () => {
      this.triggerExplanation();
    });
  }

  async ensureContentScript(tab) {
    try {
      // Check if tab URL is valid for content script injection
      if (!tab.url || 
          tab.url.startsWith('chrome://') || 
          tab.url.startsWith('chrome-extension://') ||
          tab.url.startsWith('edge://') ||
          tab.url.startsWith('about:')) {
        return false;
      }

      // Try to ping the content script
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
        return true;
      } catch (pingError) {
        // Content script not loaded, inject it
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
          
          // Wait for script to initialize
          await new Promise(resolve => setTimeout(resolve, 100));
          return true;
        } catch (injectError) {
          console.error('Failed to inject content script:', injectError);
          return false;
        }
      }
    } catch (error) {
      console.error('Error ensuring content script:', error);
      return false;
    }
  }

  async triggerExplanation() {
    if (!this.elements.explainBtn) return;

    // Add loading state
    this.elements.explainBtn.disabled = true;
    this.elements.explainBtn.innerHTML = `
      <span class="btn-icon">⏳</span>
      Processing...
    `;

    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tabs || !tabs[0]) {
        this.showError('No active tab found');
        this.resetButton();
        return;
      }

      const tab = tabs[0];

      // Check if we can access this page
      if (tab.url.startsWith('chrome://') || 
          tab.url.startsWith('chrome-extension://') ||
          tab.url.startsWith('edge://') ||
          tab.url.startsWith('about:')) {
        this.showError('Cannot simplify browser pages. Try a regular webpage!');
        this.resetButton();
        return;
      }

      // Ensure content script is loaded
      const ready = await this.ensureContentScript(tab);
      
      if (!ready) {
        this.showError('Cannot access this page. Please refresh and try again.');
        this.resetButton();
        return;
      }

      // Send message to simplify page
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'simplifyPage' });
      
      if (response && response.success) {
        this.showFeedback('Opening simplified page in new tab!');
        setTimeout(() => window.close(), 1500);
      } else {
        this.showError('Failed to simplify. Please try again.');
        this.resetButton();
      }
      
    } catch (error) {
      console.error('Error:', error);
      
      // Provide user-friendly error message
      let errorMessage = 'Please refresh the page and try again.';
      
      if (error.message && error.message.includes('Cannot access')) {
        errorMessage = 'Cannot access this page. Try a regular webpage.';
      } else if (error.message && error.message.includes('Receiving end does not exist')) {
        errorMessage = 'Extension not ready. Please refresh the page.';
      }
      
      this.showError(errorMessage);
      this.resetButton();
    }
  }

  resetButton() {
    if (!this.elements.explainBtn) return;

    this.elements.explainBtn.disabled = false;
    this.elements.explainBtn.innerHTML = `
      <span class="btn-icon">✨</span>
      Simplify This Page
    `;
  }

  showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    setTimeout(() => {
      feedback.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }

  showError(message) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      animation: slideDown 0.3s ease;
      max-width: 300px;
      text-align: center;
    `;
    
    document.body.appendChild(feedback);
    setTimeout(() => {
      feedback.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});