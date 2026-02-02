# 🧠 Explain This Page - v5.4 (Feb 2026)

A powerful Chrome extension that uses **Advanced Logic** to transform complex webpages into easy-to-understand content. Real simplification, not just word replacement!

![Version](https://img.shields.io/badge/version-5.4.0-blueviolet)
![Stack](https://img.shields.io/badge/stack-React_TS_Vite-blue)
![Theme](https://img.shields.io/badge/theme-Glassmorphism-cyan)

## ✨ What's New in v5.4 (Feb 2026 Update)

### 🌓 **Light & Dark Mode**

- **Theme Toggle**: Switch instantly between the classic deep dark glassmorphism and the new **Light Mode**.
- **Adaptive Contrast**: Text colors automatically adjust (Navy for Light, White for Dark) to ensure perfect readability in any lighting condition.

### 🎨 **Refined Glassmorphism**

- **Premium Design**: A stunning interface featuring frosted glass, gradients, and subtle animations.
- **Dedicated Viewer**: Replaced the old "blob URL" with a proper `viewer.html` for a stable reading experience.
- **Interactive Stats**: See exactly how much time you saved and how many jargon terms were explained.

---

## 🚀 Features

### Core Functionality

- **Full Page Simplification**: Process entire webpages in a beautiful, distraction-free reader.
- **Text Selection**: Right-click to simplify just the specific paragraph you need.
- **Smart Dictionary**: The engine replaces complex words and highlights jargon.
- **Jargon Tooltips**: Hover over highlighted terms to see instant definitions.

### User Experience

- **Auto-Injection**: No more "Please reload the page" errors—the extension handles connections intelligently.
- **Viewer Mode**: A dedicated reading environment with dark mode support.
- **Tools**: Copy to clipboard, nice typography, and time-saved estimates.

---

## 📦 Installation & Build

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Open a terminal in the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

### Loading in Chrome

1. Open Chrome: `chrome://extensions/`
2. Enable **"Developer mode"** (top right toggle).
3. Click **"Load unpacked"**.
4. Select the **`dist`** folder inside your project directory.
5. Done! 🎉

---

## 🎮 How to Use

### Method 1: Popup

1. Click the **Explain This Page** icon in the toolbar.
2. Click the big **Simplify** button.
3. Enjoy the simplified content in the Viewer.

### Method 2: Context Menu

1. Highlight any text on a webpage.
2. Right-click and choose **"Simplify Selected Text"**.

---

## 🔧 Technical details

- **Manifest V3**: Future-proof configuration.
- **Vite Multi-Page Build**: optimized bundles for Popup, Content Script, Background, and Viewer.
- **React Components**: Modular and reusable UI components.

---

**Version 5.4.0 | Feb 2026**
