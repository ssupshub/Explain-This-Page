# 🚀 Quick Start Guide - Explain This Page v5.2

Get your AI-powered reading assistant running in minutes.

## 📦 Step 1: Installation

1. **Download/Clone** the project files to a folder (e.g., `explain-this-page-v5`).
2. Open **Chrome** and navigate to `chrome://extensions/`.
3. Toggle **Developer mode** to **ON** (top right corner).
4. Click **Load unpacked**.
5. Select your `explain-this-page-v5` folder.

**Success!** You should see the "Explain This Page" card in your extensions list.

---

## 🎮 Step 2: Simplification Methods

There are 3 ways to use the extension:

### 1. The "Full Page" Method

_Best for: Long articles, documentation, wikis._

- Click the **Brain Icon** 🧠 in your Chrome toolbar.
- Click **"Simplify This Page"**.
- A **new tab** will open with the entire page simplified.

### 2. The "Selection" Method

_Best for: Specific paragraphs or confusing sentences._

- **Highlight** any text on a webpage.
- **Right-click** the selection.
- Click **"Simplify selected text"**.

### 3. The "Right-Click" Method

_Best for: Quick access without the toolbar._

- Right-click anywhere on a page background.
- Select **"Explain this page"**.

---

## 🎨 Step 3: Exploring the New Interface

Once the new tab opens, try these features:

### 🌗 Dark Mode

Click the Sun/Moon icon in the top right corner to toggle between Light Mode and Dark Mode. It defaults to your system preference!

### 📊 Statistics

Check the bar below the header to see:

- **Method**: How it was processed.
- **Words Changed**: How many complex words were simplified.
- **Read Time**: Estimated time to read the simplified version.

### 📂 Export & Actions

- **Download PDF**: Save the simplified article for offline reading.
- **Copy**: Copy the text to your clipboard.
- **View Original**: Open the original URL in a separate tab.

---

## 💡 Troubleshooting

**Q: The new tab isn't opening!**
A: Check your address bar for a "Pop-up blocked" icon. Extensions opening new tabs can sometimes be flagged by strict browser settings. Allow pop-ups for this extension.

**Q: It says "Not enough content".**
A: The extension requires at least 100 characters of text to work effective. Try it on a longer article.

**Q: The PDF looks different.**
A: The PDF export uses your browser's print engine. It removes some interface elements (buttons) to keep the document clean.

---

## 🏗️ Project Structure

For developers or curious users:

- `manifest.json`: Configuration (v5.2.0, Manifest V3).
- `content.js`: The brain. Extracts text, runs simplification logic, and builds the new tab HTML.
- `popup.html/css`: The toolbar menu interface.
- `background.js`: Handles context menus and installation events.
- `dictionary.js`: (Optional) External data for words/jargon.

---

_Enjoy your simplified reading experience!_
