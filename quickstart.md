# 🚀 Quick Start Guide - Explain This Page v5.3

Get your AI-powered reading assistant running in minutes.

## 📦 Step 1: Installation & Build

Since v5.3, the extension requires a build step.

1. **Download/Clone** the project files to a folder.
2. Open a terminal in that folder and run:
   ```bash
   npm install
   npm run build
   ```
3. Open **Chrome** and navigate to `chrome://extensions/`.
4. Toggle **Developer mode** to **ON** (top right corner).
5. Click **Load unpacked**.
6. Select the **`dist`** folder inside your project directory.

**Success!** You should see the "Explain This Page" card in your extensions list.

---

## 🎮 Step 2: Simplification Methods

There are 2 main ways to use the extension:

### 1. The "Popup" Method

_Best for: Quick full-page simplification._

- Click the **Brain Icon** 🧠 in your Chrome toolbar.
- Click the big **Simplify** button.
- A **new tab** will open with the entire page simplified in the Premium Viewer.

### 2. The "Selection" Method

_Best for: Specific paragraphs or confusing sentences._

- **Highlight** any text on a webpage.
- **Right-click** the selection.
- Click **"Simplify selected text"**.

---

## 🎨 Step 3: Exploring the Interface

### 💎 Glassmorphism UI

The new interface uses modern design principles with frosted glass effects and smooth transitions.

### 📊 Statistics

Check the stats boxes in the Viewer to see:

- **Time Saved**: Estimated minutes saved by reading the simplified version.
- **Complexity**: Number of terms simplified.
- **Jargon**: Count of technical terms explained.

### 📂 Export & Actions

- **Download PDF**: Save the simplified article for offline reading.
- **Copy**: Copy the text to your clipboard.
- **View Original**: Link back to the source page.

---

## 💡 Troubleshooting

**Q: "Could not connect to page" error?**
A: This usually happens on internal Chrome pages or if the page hasn't finished loading. Try refreshing the page once. v5.3 includes auto-injection to minimize this.

**Q: The Viewer tab is blank.**
A: Ensure you have run `npm run build` and loaded the `dist` folder, not the root folder.

---

## 🏗️ Project Structure

- `src/`: Source code (React + TypeScript).
  - `popup/`: Popup interface code.
  - `viewer/`: The simplified reader page.
  - `content/`: Page extraction logic.
  - `background/`: Extension service worker.
- `public/`: Static assets and `manifest.json`.
- `dist/`: The compiled extension (generated after build).

---

_Enjoy your simplified reading experience!_
**Version 5.3.0 | December 2025**
