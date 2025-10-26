// Popup Script v4.0
'use strict';

class PopupController {
  constructor() {
    this.elements = {
      explainBtn: document.getElementById('explainBtn'),
      autoDetect: document.getElementById('autoDetect'),
      pagesCount: document.getElementById('pagesCount'),
      wordsCount: document.getElementById('wordsCount'),
      levelRadios: document.querySelectorAll('input[name="level"]')
    };
    
    this.init();
  }

  init() {
    this.loadSettings();
    this.loadStats();
    this.attachEventListeners();
  }

  loadSettings() {
    chrome.storage.sync.get(['readingLevel', 'autoDetect'], (data) => {
      // Set reading level
      const level = data.readingLevel || 'middle';
      this.elements.levelRadios.forEach(radio => {
        if (radio.value === level) {
          radio.checked = true;
        }
      });

      // Set auto-detect
      this.elements.autoDetect.checked = data.autoDetect !== false;
    });
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
    this.animateNumber(this.elements.pagesCount, stats.pagesExplained);
    this.animateNumber(this.elements.wordsCount, stats.wordsSimplified);
  }

  animateNumber(element, target) {
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
    // Explain button
    this.elements.explainBtn.addEventListener('click', () => {
      this.triggerExplanation();
    });

    // Reading level change
    this.elements.levelRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.saveSettings({ readingLevel: radio.value });
          this.showFeedback('Reading level updated!');
        }
      });
    });

    // Auto-detect toggle
    this.elements.autoDetect.addEventListener('change', () => {
      this.saveSettings({ autoDetect: this.elements.autoDetect.checked });
      this.showFeedback(
        this.elements.autoDetect.checked 
          ? 'Auto-detect enabled!' 
          : 'Auto-detect disabled!'
      );
    });
  }

  triggerExplanation() {
    // Add loading state
    this.elements.explainBtn.disabled = true;
    this.elements.explainBtn.innerHTML = `
      <span class="btn-icon">⏳</span>
      Processing...
    `;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        this.showError('No active tab found');
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => window.dispatchEvent(new Event('explain-page-trigger'))
      }).then(() => {
        this.showFeedback('Page is being simplified!');
        setTimeout(() => window.close(), 1000);
      }).catch((error) => {
        console.error('Error:', error);
        this.showError('Failed to simplify page');
        this.resetButton();
      });
    });
  }

  resetButton() {
    this.elements.explainBtn.disabled = false;
    this.elements.explainBtn.innerHTML = `
      <span class="btn-icon">✨</span>
      Simplify This Page
    `;
  }

  saveSettings(settings) {
    chrome.storage.sync.set(settings, () => {
      console.log('Settings saved:', settings);
    });
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
    `;
    
    document.body.appendChild(feedback);
    setTimeout(() => {
      feedback.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
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
