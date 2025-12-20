// Popup Script v5.2 - Enhanced with Theme Support
"use strict";

class PopupController {
  constructor() {
    this.elements = {
      explainBtn: document.getElementById("explainBtn"),
      pagesCount: document.getElementById("pagesCount"),
      wordsCount: document.getElementById("wordsCount"),
      themeToggle: document.getElementById("themeToggle"),
    };

    this.init();
  }

  init() {
    // Verify elements exist before proceeding
    if (
      !this.elements.explainBtn ||
      !this.elements.pagesCount ||
      !this.elements.wordsCount
    ) {
      console.error("Required popup elements not found");
      return;
    }

    this.loadTheme();
    this.loadStats();
    this.attachEventListeners();
    this.addEntranceAnimation();
  }

  // ===== Theme Management =====
  loadTheme() {
    chrome.storage.sync.get(["theme"], (data) => {
      const theme = data.theme || "light";
      this.applyTheme(theme);
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  toggleTheme() {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    this.applyTheme(newTheme);
    chrome.storage.sync.set({ theme: newTheme });

    // Add subtle haptic feedback animation
    if (this.elements.themeToggle) {
      this.elements.themeToggle.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.elements.themeToggle.style.transform = "";
      }, 100);
    }
  }

  // ===== Stats Management =====
  loadStats() {
    chrome.storage.sync.get(["pagesExplained", "wordsSimplified"], (data) => {
      this.updateStats({
        pagesExplained: data.pagesExplained || 0,
        wordsSimplified: data.wordsSimplified || 0,
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
    const diff = target - current;
    const increment = Math.ceil(diff / 20);
    const duration = 500; // ms
    const stepTime = duration / 20;

    if (current < target) {
      element.textContent = this.formatNumber(
        Math.min(current + increment, target)
      );
      setTimeout(() => this.animateNumber(element, target), stepTime);
    } else {
      element.textContent = this.formatNumber(target);
    }
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }

  // ===== Entrance Animation =====
  addEntranceAnimation() {
    const sections = document.querySelectorAll(".popup-section");
    sections.forEach((section, index) => {
      section.style.animationDelay = `${0.1 + index * 0.1}s`;
    });
  }

  // ===== Event Listeners =====
  attachEventListeners() {
    // Explain button
    if (this.elements.explainBtn) {
      this.elements.explainBtn.addEventListener("click", () => {
        this.triggerExplanation();
      });
    }

    // Theme toggle
    if (this.elements.themeToggle) {
      this.elements.themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });
    }

    // Add hover effects to instruction items
    const instructionItems = document.querySelectorAll(".instruction-item");
    instructionItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        item.style.transform = "translateX(4px)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.transform = "";
      });
    });
  }

  // ===== Content Script Helpers =====
  async ensureContentScript(tab) {
    try {
      // Check if tab URL is valid for content script injection
      if (
        !tab.url ||
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://") ||
        tab.url.startsWith("edge://") ||
        tab.url.startsWith("about:") ||
        tab.url.startsWith("file://")
      ) {
        return false;
      }

      // Try to ping the content script
      try {
        await chrome.tabs.sendMessage(tab.id, { action: "ping" });
        return true;
      } catch (pingError) {
        // Content script not loaded, inject it
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"],
          });

          // Wait for script to initialize
          await new Promise((resolve) => setTimeout(resolve, 150));
          return true;
        } catch (injectError) {
          console.error("Failed to inject content script:", injectError);
          return false;
        }
      }
    } catch (error) {
      console.error("Error ensuring content script:", error);
      return false;
    }
  }

  // ===== Main Action =====
  async triggerExplanation() {
    if (!this.elements.explainBtn) return;

    // Add loading state
    this.setButtonLoading(true);

    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tabs || !tabs[0]) {
        this.showFeedback("No active tab found", "error");
        this.setButtonLoading(false);
        return;
      }

      const tab = tabs[0];

      // Check if we can access this page
      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://") ||
        tab.url.startsWith("edge://") ||
        tab.url.startsWith("about:") ||
        tab.url.startsWith("file://")
      ) {
        this.showFeedback(
          "Cannot simplify browser pages. Try a regular webpage!",
          "error"
        );
        this.setButtonLoading(false);
        return;
      }

      // Ensure content script is loaded
      const ready = await this.ensureContentScript(tab);

      if (!ready) {
        this.showFeedback(
          "Cannot access this page. Please refresh and try again.",
          "error"
        );
        this.setButtonLoading(false);
        return;
      }

      // Send message to simplify page
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "simplifyPage",
      });

      if (response && response.success) {
        this.showFeedback("Opening simplified page in new tab! ✨", "success");
        setTimeout(() => window.close(), 1500);
      } else {
        this.showFeedback("Failed to simplify. Please try again.", "error");
        this.setButtonLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);

      // Provide user-friendly error message
      let errorMessage = "Please refresh the page and try again.";

      if (error.message && error.message.includes("Cannot access")) {
        errorMessage = "Cannot access this page. Try a regular webpage.";
      } else if (
        error.message &&
        error.message.includes("Receiving end does not exist")
      ) {
        errorMessage = "Extension not ready. Please refresh the page.";
      }

      this.showFeedback(errorMessage, "error");
      this.setButtonLoading(false);
    }
  }

  // ===== Button States =====
  setButtonLoading(loading) {
    if (!this.elements.explainBtn) return;

    const btnIcon = this.elements.explainBtn.querySelector(".btn-icon");
    const btnText = this.elements.explainBtn.querySelector(".btn-text");
    const btnLoader = this.elements.explainBtn.querySelector(".btn-loader");

    this.elements.explainBtn.disabled = loading;

    if (loading) {
      if (btnIcon) btnIcon.hidden = true;
      if (btnText) btnText.textContent = "Processing";
      if (btnLoader) btnLoader.hidden = false;
    } else {
      if (btnIcon) btnIcon.hidden = false;
      if (btnText) btnText.textContent = "Simplify This Page";
      if (btnLoader) btnLoader.hidden = true;
    }
  }

  // ===== Feedback Messages =====
  showFeedback(message, type = "success") {
    // Remove any existing feedback
    const existingFeedback = document.querySelector(".feedback-message");
    if (existingFeedback) {
      existingFeedback.remove();
    }

    const feedback = document.createElement("div");
    feedback.className = `feedback-message feedback-${type}`;
    feedback.textContent = message;

    document.body.appendChild(feedback);

    // Auto dismiss
    const duration = type === "error" ? 4000 : 2500;
    setTimeout(() => {
      feedback.style.animation = "slideOutUp 0.3s ease forwards";
      setTimeout(() => feedback.remove(), 300);
    }, duration);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new PopupController();
});
