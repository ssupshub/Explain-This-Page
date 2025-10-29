// Background Service Worker v5.0
'use strict';

class BackgroundService {
  constructor() {
    this.init();
  }

  init() {
    this.setupInstallListener();
    this.setupContextMenus();
    this.setupMessageHandlers();
  }

  setupInstallListener() {
    chrome.runtime.onInstalled.addListener((details) => {
      console.log('Explain This Page v5.0 installed:', details.reason);
      this.initializeDefaults();
      this.createContextMenus();
    });
  }

  initializeDefaults() {
    chrome.storage.sync.get(null, (data) => {
      const defaults = {
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
      // Context menu for selected text
      chrome.contextMenus.create({
        id: 'explain-selection',
        title: '🧠 Simplify selected text',
        contexts: ['selection']
      });

      // Context menu for full page
      chrome.contextMenus.create({
        id: 'explain-page',
        title: '🧠 Simplify this page',
        contexts: ['page']
      });
    });
  }

  setupContextMenus() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (!tab?.id) return;

      if (info.menuItemId === 'explain-selection') {
        this.simplifySelection(tab.id);
      } else if (info.menuItemId === 'explain-page') {
        this.simplifyPage(tab.id);
      }
    });
  }

  simplifySelection(tabId) {
    chrome.tabs.sendMessage(tabId, { action: 'simplifySelection' })
      .catch(err => {
        console.error('Error simplifying selection:', err);
        this.showNotification(tabId, 'Please refresh the page and try again.');
      });
  }

  simplifyPage(tabId) {
    chrome.tabs.sendMessage(tabId, { action: 'simplifyPage' })
      .catch(err => {
        console.error('Error simplifying page:', err);
        this.showNotification(tabId, 'Please refresh the page and try again.');
      });
  }

  showNotification(tabId, message) {
    chrome.tabs.sendMessage(tabId, {
      action: 'showNotification',
      message: message
    }).catch(() => {
      // Silently fail if content script not loaded
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