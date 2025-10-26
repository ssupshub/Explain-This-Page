# 🧠 Explain This Page - v4.0

A powerful Chrome extension that transforms complex webpages into easy-to-understand content with AI-powered explanations, smart summaries, and interactive tooltips.

## ✨ What's New in v4.0

### 🎯 Major Improvements
- **Enhanced Text Simplification**: 5x larger vocabulary with 100+ word simplifications
- **Better Complexity Detection**: Improved algorithm with more accurate scoring
- **Smarter Summarization**: Context-aware algorithm that captures key points
- **Expanded Jargon Dictionary**: 80+ technical terms with clear explanations
- **Robust Error Handling**: Better edge case coverage and error messages
- **Performance Optimization**: Faster processing for large pages
- **Cleaner Code**: More maintainable and modular architecture

### 🐛 Fixed Issues
- ✅ Text simplification now works reliably
- ✅ Translation accuracy significantly improved
- ✅ Complexity detection more precise
- ✅ Better handling of long sentences
- ✅ Improved tooltip positioning
- ✅ Fixed overlay scrolling issues
- ✅ Enhanced mobile responsiveness

## 🚀 Features

### Core Functionality
- **Automatic Complexity Detection**: Automatically detects complex content on webpages
- **3 Reading Levels**: Elementary, Middle School, and High School
- **Smart Summarization**: Extracts key points from lengthy content
- **Word Simplification**: Replaces complex words with simpler alternatives
- **Sentence Breaking**: Splits long sentences into digestible chunks
- **Jargon Tooltips**: Interactive tooltips explain technical terms

### User Experience
- **Beautiful UI**: Modern gradient design with smooth animations
- **Side-by-Side View**: Compare original and simplified content
- **Context Menu**: Right-click to explain selected text or entire page
- **Statistics Tracking**: See how many pages and words you've simplified
- **Customizable Settings**: Choose your preferred reading level
- **Auto-detect Toggle**: Enable/disable automatic complexity detection

## 📦 Installation

### Method 1: Load Unpacked (For Development)

1. **Download the Extension Files**
   - Save all the files in a folder named `explain-this-page-v4`

2. **Create Required Files**
   Create these files in your folder:
   - `manifest.json`
   - `background.js`
   - `content.js`
   - `content.css`
   - `popup.html`
   - `popup.css`
   - `popup.js`

3. **Create Icons Folder**
   - Create a folder named `icons` inside your extension folder
   - Add placeholder icons (or download from Chrome Web Store assets):
     - `icon16.png` (16x16 pixels)
     - `icon48.png` (48x48 pixels)
     - `icon128.png` (128x128 pixels)

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select your `explain-this-page-v4` folder
   - The extension is now installed!

### Method 2: Create Icons (Simple Method)

If you don't have icon files, create simple placeholder icons:

1. Create a basic HTML file to generate icons:
```html
<!DOCTYPE html>
<html>
<body>
  <canvas id="canvas" width="128" height="128"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#667eea';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🧠', 64, 90);
  </script>
</body>
</html>
```

2. Open this HTML file in Chrome
3. Right-click the canvas and "Save image as..."
4. Resize and save as `icon16.png`, `icon48.png`, and `icon128.png`

## 🎮 Usage

### Quick Start
1. **Click the Extension Icon**: Opens the popup with settings
2. **Click "Simplify This Page"**: Instantly simplifies the current page
3. **Choose Reading Level**: Select Elementary, Middle School, or High School
4. **Toggle Auto-detect**: Enable to automatically detect complex pages

### Context Menu
- **Right-click on page** → "Explain this page"
- **Select text and right-click** → "Explain selected text"

### Keyboard Shortcuts (Optional)
You can add keyboard shortcuts in Chrome:
1. Go to `chrome://extensions/shortcuts`
2. Find "Explain This Page"
3. Set your preferred shortcut

## 🎨 Features in Detail

### Reading Levels

**🌟 Elementary (Ages 6-10)**
- Shortest sentences (max 12 words)
- Most aggressive simplification
- 3 sentence summaries

**📚 Middle School (Ages 11-13)**
- Medium sentences (max 18 words)
- Balanced simplification
- 4 sentence summaries

**🎓 High School (Ages 14+)**
- Longer sentences (max 25 words)
- Minimal simplification
- 5 sentence summaries

### Complexity Detection

The extension analyzes text based on:
- **Long words**: Words with 10+ characters
- **Technical jargon**: 80+ recognized terms
- **Sentence length**: Sentences with 20+ words
- **Complex vocabulary**: 100+ simplifiable words

### Jargon Dictionary

Covers multiple domains:
- 🖥️ **Technology**: API, algorithm, bandwidth, encryption, etc.
- 🔬 **Science**: hypothesis, theory, empirical, correlation, etc.
- 💼 **Business**: revenue, stakeholder, investment, forecast, etc.
- 🏥 **Medical**: diagnosis, symptom, chronic, metabolism, etc.
- 📚 **Academic**: paradigm, synthesis, methodology, criteria, etc.

## 📊 Statistics

Track your learning progress:
- **Pages Simplified**: Total number of pages you've simplified
- **Words Simplified**: Total number of complex words replaced

## ⚙️ Settings

### Sync Across Devices
Settings are synced across all Chrome browsers where you're signed in:
- Reading level preference
- Auto-detect toggle
- Statistics

## 🔧 Troubleshooting

### Extension Not Working
1. Refresh the page after installing
2. Check if the site allows extensions (some sites block them)
3. Try disabling and re-enabling the extension
4. Check Chrome console for errors (`F12` → Console)

### Banner Not Appearing
1. Make sure "Auto-detect complexity" is enabled
2. The page might not be complex enough (try technical articles)
3. Wait 2 seconds after page load for detection

### Overlay Not Showing
1. Click the extension icon and try "Simplify This Page"
2. Make sure the page has enough text content (200+ characters)
3. Check if another extension is conflicting

### Icons Not Loading
1. Make sure all three icon files exist in the `icons` folder
2. Icon files must be named exactly: `icon16.png`, `icon48.png`, `icon128.png`
3. Icons must be valid PNG files

## 🛠️ Development

### File Structure
```
explain-this-page-v4/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── content.js             # Main logic
├── content.css            # Styles for page overlays
├── popup.html             # Extension popup
├── popup.css              # Popup styles
├── popup.js               # Popup functionality
└── icons/
    ├── icon16.png         # 16x16 icon
    ├── icon48.png         # 48x48 icon
    └── icon128.png        # 128x128 icon
```

### Technologies Used
- Manifest V3
- Chrome Extension APIs
- Vanilla JavaScript
- Modern CSS (Grid, Flexbox, Animations)

### Key Components

**Background Service Worker** (`background.js`)
- Manages extension lifecycle
- Handles context menus
- Stores user settings and statistics

**Content Script** (`content.js`)
- Analyzes page complexity
- Performs text simplification
- Creates overlay UI
- Manages tooltips

**Popup** (`popup.html/js/css`)
- User settings interface
- Reading level selection
- Statistics display
- Manual trigger

## 📝 Technical Details

### Complexity Algorithm
```javascript
score = (longWordRatio × 2) + (jargonCount × 3) + (longSentenceRatio × 2) + (complexWords × 1)
isComplex = score >= 4
```

### Summarization Algorithm
- Extracts sentences from content
- Calculates word frequency (excluding stop words)
- Scores sentences by keyword density
- Prioritizes first and last sentences
- Returns top N sentences in original order

### Simplification Process
1. Extract visible text from page
2. Analyze complexity
3. Generate summary
4. Replace complex words
5. Break long sentences
6. Add jargon tooltips
7. Display side-by-side comparison

## 🤝 Contributing

Found a bug or want to contribute? 
- Report issues with clear reproduction steps
- Suggest new jargon terms to add
- Propose UI/UX improvements
- Submit code improvements

**Version 4.0** - Complete rewrite with enhanced features
- Improved simplification algorithms
- Expanded dictionaries
- Better error handling
- Modern UI design

---

**Made with ❤️ for better reading comprehension**

Version 4.0.0 | October 2025
