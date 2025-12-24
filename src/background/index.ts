chrome.runtime.onMessage.addListener(
  (request: { action: string; data?: any; text?: string }) => {
    if (request.action === "openViewer") {
      chrome.tabs.create({ url: chrome.runtime.getURL("viewer.html") });
    }

    if (request.action === "updateStats") {
      chrome.storage.local.get(["stats"], (result) => {
        const current = result.stats || { pages: 0, words: 0 };
        const updated = {
          pages: current.pages + (request.data?.pages || 0),
          words: current.words + (request.data?.words || 0),
        };
        chrome.storage.local.set({ stats: updated });
      });
    }
  }
);

// Setup Context Menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "simplify-selection",
    title: "Simplify Selected Text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "simplify-selection" && tab?.id) {
    chrome.tabs
      .sendMessage(tab.id, {
        action: "simplifySelection",
        text: info.selectionText,
      })
      .catch((err) => {
        console.log("Could not send message to tab (probably stale):", err);
      });
  }
});
