// Background Service Worker v4.0
'use strict';

class BackgroundService {
  constructor() {
    this.init();
  }

  init() {
    this.setupInstallListener();
    this.setupContextMenus();
    this.setupMessageHandlers();
    this.setupActionHandler();
  }

  setupInstallListener() {
    chrome.runtime.onInstalled.addListener((details) => {
      console.log('Explain This Page v4.0 installed:', details.reason);
      this.initializeDefaults();
      this.createContextMenus();
    });
  }

  initializeDefaults() {
    chrome.storage.sync.get(null, (data) => {
      const defaults = {
        readingLevel: data.readingLevel || 'middle',
        autoDetect: data.autoDetect !== undefined ? data.autoDetect : true,
        pagesExplained: data.pagesExplained || 0,
        wordsSimplified: data.wordsSimplified || 0,
        lastUsed: data.lastUsed || null
      };
      
      chrome.storage.sync.set(defaults, () => {
        console.log('Default settings initialized');
      });
    });
  }

  createContextMenus() {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'explain-selection',
        title: 'Explain selected text',
        contexts: ['selection']
      });

      chrome.contextMenus.create({
        id: 'explain-page',
        title: 'Explain this page',
        contexts: ['page']
      });
    });
  }

  setupContextMenus() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (!tab?.id) return;

      if (info.menuItemId === 'explain-selection') {
        this.handleTextSelection(tab, info.selectionText);
      } else if (info.menuItemId === 'explain-page') {
        this.triggerPageExplanation(tab.id);
      }
    });
  }

  handleTextSelection(tab, text) {
    if (!text || !text.trim()) return;

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (selectedText) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          z-index: 2147483647;
          max-width: 500px;
          font-family: system-ui, -apple-system, sans-serif;
        `;
        
        modal.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <h3 style="margin: 0; color: #1e293b; font-size: 18px;">Selected Text</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b;">&times;</button>
          </div>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">${selectedText}</p>
          </div>
          <button onclick="this.parentElement.remove(); window.dispatchEvent(new Event('explain-page-trigger'));" style="width: 100%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">
            Explain Full Page Instead
          </button>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.remove(), 10000);
      },
      args: [text]
    }).catch(console.error);
  }

  triggerPageExplanation(tabId) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => window.dispatchEvent(new Event('explain-page-trigger'))
    }).catch(console.error);
  }

  setupActionHandler() {
    chrome.action.onClicked.addListener((tab) => {
      if (tab?.id) this.triggerPageExplanation(tab.id);
    });
  }

  setupMessageHandlers() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true;
    });
  }

  handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'updateStats':
        this.updateStats(request.data, sendResponse);
        break;
      case 'getSettings':
        this.getSettings(sendResponse);
        break;
      case 'saveSettings':
        this.saveSettings(request.data, sendResponse);
        break;
      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  }

  updateStats(data, sendResponse) {
    chrome.storage.sync.get(['pagesExplained', 'wordsSimplified'], (current) => {
      const updated = {
        pagesExplained: (current.pagesExplained || 0) + (data.pages || 0),
        wordsSimplified: (current.wordsSimplified || 0) + (data.words || 0),
        lastUsed: Date.now()
      };
      
      chrome.storage.sync.set(updated, () => {
        sendResponse({ success: true, stats: updated });
      });
    });
  }

  getSettings(sendResponse) {
    chrome.storage.sync.get(null, (data) => {
      sendResponse({ success: true, settings: data });
    });
  }

  saveSettings(data, sendResponse) {
    chrome.storage.sync.set(data, () => {
      sendResponse({ success: true });
    });
  }
}

// Initialize
new BackgroundService();
