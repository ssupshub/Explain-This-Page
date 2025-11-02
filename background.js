// Background Service Worker v5.0 - Fixed
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

  async ensureContentScript(tabId) {
    try {
      // Try to ping the content script
      await chrome.tabs.sendMessage(tabId, { action: 'ping' });
      return true;
    } catch (error) {
      // Content script not loaded, inject it
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
        
        // Wait a bit for script to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
      } catch (injectError) {
        console.error('Failed to inject content script:', injectError);
        return false;
      }
    }
  }

  async simplifySelection(tabId) {
    try {
      // Ensure content script is loaded
      const ready = await this.ensureContentScript(tabId);
      
      if (!ready) {
        this.showErrorNotification(tabId, 'Cannot access this page. Try refreshing.');
        return;
      }

      // Send message to simplify selection
      await chrome.tabs.sendMessage(tabId, { action: 'simplifySelection' });
      
    } catch (err) {
      console.error('Error simplifying selection:', err);
      this.showErrorNotification(tabId, 'Please select some text first, then try again.');
    }
  }

  async simplifyPage(tabId) {
    try {
      // Ensure content script is loaded
      const ready = await this.ensureContentScript(tabId);
      
      if (!ready) {
        this.showErrorNotification(tabId, 'Cannot access this page. Try refreshing.');
        return;
      }

      // Send message to simplify page
      await chrome.tabs.sendMessage(tabId, { action: 'simplifyPage' });
      
    } catch (err) {
      console.error('Error simplifying page:', err);
      this.showErrorNotification(tabId, 'Please refresh the page and try again.');
    }
  }

  showErrorNotification(tabId, message) {
    // Try to show notification via content script
    chrome.tabs.sendMessage(tabId, {
      action: 'showNotification',
      message: message
    }).catch(() => {
      // If that fails, show browser notification
      chrome.notifications?.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Explain This Page',
        message: message
      }).catch(() => {
        // Silently fail if notifications not available
        console.log('Notification failed:', message);
      });
    });
  }

  setupMessageHandlers() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep channel open for async response
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
      case 'ping':
        // Used to check if background script is responsive
        sendResponse({ success: true });
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