# 🚀 Quick Start Guide - Explain This Page v4.0

Get your extension up and running in 5 minutes!

## Step 1: Create Project Folder

Create a new folder on your computer:
```
explain-this-page-v4/
```

## Step 2: Clone All Files

### Required Files:
1. ✅ `manifest.json` - Extension configuration
2. ✅ `background.js` - Background service worker
3. ✅ `content.js` - Main functionality
4. ✅ `content.css` - Styling
5. ✅ `popup.html` - Popup interface
6. ✅ `popup.css` - Popup styling
7. ✅ `popup.js` - Popup logic

## Step 3: Create Icons

### Option A: Use Icon Generator (Recommended)
1. Save the `icon-generator.html` file
2. Open it in Chrome
3. Click the "Download" buttons to get all three icons
4. Create an `icons` folder in your extension directory
5. Move the downloaded icons into the `icons` folder

### Option B: Create Simple Icons Manually
1. Create a folder named `icons` in your extension directory
2. You can use any 16x16, 48x48, and 128x128 PNG images
3. Name them exactly: `icon16.png`, `icon48.png`, `icon128.png`

### Option C: Use Placeholder
If you don't have icons, temporarily use any PNG images and rename them. The extension will work, just without pretty icons!

## Step 4: Load Extension in Chrome

### Installation Steps:
1. Open Chrome
2. Go to `chrome://extensions/`
3. Turn ON "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select your `explain-this-page-v4` folder
6. Done! 🎉

### Verify Installation:
- You should see the extension in your Chrome toolbar
- Click it to see the popup
- Visit any webpage with complex content to test

## Step 5: Test It Out

### Test Sites (Complex Content):
Try these sites to see the extension in action:

1. **Wikipedia Technical Articles**
   - https://en.wikipedia.org/wiki/Quantum_mechanics
   - https://en.wikipedia.org/wiki/Machine_learning

2. **Academic Papers**
   - https://arxiv.org/
   - Any university research page

3. **Technical Documentation**
   - https://developer.mozilla.org/
   - Any programming documentation

4. **News Articles**
   - Scientific American
   - Nature.com articles

### What Should Happen:
1. **Auto-detect** (if enabled): After 2 seconds, a banner appears at the top
2. **Manual trigger**: Click extension icon → "Simplify This Page"
3. **Overlay appears**: Side-by-side comparison of original and simplified content
4. **Hover over yellow terms**: See tooltip explanations

## Step 6: Customize Settings

### In the Popup:
1. **Reading Level**: Choose Elementary, Middle School, or High School
2. **Auto-detect**: Toggle automatic complexity detection
3. **Statistics**: Track your progress

### Settings are Synced:
Your preferences sync across all Chrome browsers where you're signed in!

## 🎯 Quick Usage Guide

### Three Ways to Use:

#### 1. Automatic Detection
- Enable "Auto-detect complexity" in settings
- Banner appears automatically on complex pages
- Click "Simplify" button

#### 2. Extension Icon
- Click the brain icon in your toolbar
- Click "Simplify This Page"
- Instant simplification!

#### 3. Right-Click Menu
- Right-click anywhere → "Explain this page"
- Select text → Right-click → "Explain selected text"

## 🐛 Troubleshooting

### Extension Not Showing Up?
```
✓ Check if Developer mode is ON
✓ Refresh Chrome extensions page
✓ Make sure all files are in the folder
✓ Check browser console for errors (F12)
```

### Banner Not Appearing?
```
✓ Wait 2-3 seconds after page loads
✓ Check if auto-detect is enabled
✓ Try a more complex webpage
✓ Refresh the page
```

### Icons Not Working?
```
✓ Ensure icons folder exists
✓ Check icon filenames (must be exact)
✓ Icons must be valid PNG files
✓ Try reloading the extension
```

### Overlay Not Opening?
```
✓ Check if page has enough text (200+ chars)
✓ Try clicking extension icon manually
✓ Check console for JavaScript errors
✓ Some sites block extensions (rare)
```

## 📁 Final Folder Structure

Your folder should look like this:

```
explain-this-page-v4/
│
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── manifest.json
├── background.js
├── content.js
├── content.css
├── popup.html
├── popup.css
└── popup.js
```

## ✅ Checklist

Before loading the extension:

- [ ] Created main folder
- [ ] Added all 7 required files
- [ ] Created icons folder
- [ ] Added all 3 icon files
- [ ] Opened chrome://extensions/
- [ ] Enabled Developer mode
- [ ] Loaded unpacked extension
- [ ] Extension icon appears in toolbar
- [ ] Tested on a complex webpage

## 🎨 Customization Tips

### Change Colors
Edit `content.css` and `popup.css`:
```css
/* Change gradient colors */
background: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
```

### Adjust Reading Levels
Edit `content.js`:
```javascript
const CONFIG = {
  maxSentenceWords: {
    elementary: 12,  // Make sentences shorter/longer
    middle: 18,
    high: 25
  }
};
```

### Add More Jargon Terms
Edit `content.js` - find `JARGON_DICT`:
```javascript
const JARGON_DICT = {
  'your_term': 'simple explanation',
  // Add more terms here
};
```

### Add More Word Simplifications
Edit `content.js` - find `WORD_SIMPLIFY`:
```javascript
const WORD_SIMPLIFY = {
  'complex_word': 'simple_word',
  // Add more here
};
```

## 🔥 Pro Tips

### 1. Keyboard Shortcut (Optional)
1. Go to `chrome://extensions/shortcuts`
2. Find "Explain This Page"
3. Set your shortcut (e.g., Ctrl+Shift+E)

### 2. Pin the Extension
- Right-click the extension icon
- Select "Pin" to keep it visible

### 3. Use on PDFs
The extension works on PDF files opened in Chrome!

### 4. Works Offline
Once loaded, the extension works without internet connection

### 5. Share Settings
Your settings sync across devices when signed into Chrome

## 📊 Understanding the Stats

### Pages Simplified
- Counts each time you use the simplification feature
- Persists across browser sessions
- Syncs across devices

### Words Simplified
- Tracks complex words replaced with simple ones
- Shows your learning progress
- Resets only if you clear extension data

## 🎓 Best Practices

### When to Use:
- ✅ Reading technical documentation
- ✅ Understanding academic papers
- ✅ Learning new subjects
- ✅ Helping students with homework
- ✅ Breaking down complex news articles

### Choose Right Reading Level:
- **Elementary**: Very complex topics or young readers
- **Middle School**: General web browsing (default)
- **High School**: Lighter simplification, more detail

### Jargon Tooltips:
- Hover over highlighted yellow terms
- Read the simple explanation
- Click to keep tooltip open (if needed)

## 🆘 Need Help?

### Common Issues:

**Issue**: Extension crashes on certain pages
**Solution**: Some sites have anti-extension measures. Try a different site.

**Issue**: Overlay is blank
**Solution**: Page might not have enough text. Minimum 200 characters needed.

**Issue**: Settings don't save
**Solution**: Check Chrome sync is enabled. Go to chrome://settings/syncSetup

**Issue**: Extension suddenly stops working
**Solution**: 
1. Go to chrome://extensions/
2. Find the extension
3. Click the refresh icon
4. Reload the webpage

## 🚀 Next Steps

1. **Test Thoroughly**: Try on 5-10 different websites
2. **Adjust Settings**: Find your preferred reading level
3. **Explore Features**: Try all three trigger methods
4. **Share Feedback**: Note what works well and what doesn't
5. **Customize**: Modify colors or add new jargon terms

## 🎉 You're Ready!

The extension is now fully functional. Enjoy simplified web browsing!

### Quick Test Checklist:
- [ ] Extension icon visible in toolbar
- [ ] Popup opens when clicked
- [ ] Can change reading level
- [ ] Banner appears on complex pages
- [ ] Overlay shows side-by-side content
- [ ] Jargon tooltips work on hover
- [ ] Statistics update correctly
- [ ] Context menu options work

## 📚 Additional Resources

### Understanding the Code:
- `manifest.json` - Extension configuration and permissions
- `background.js` - Manages extension lifecycle and settings
- `content.js` - Core simplification logic and UI
- `content.css` - Styles for on-page elements
- `popup.html/js/css` - Extension popup interface

### Key Features in Code:
- **Complexity Detection**: Line ~300 in content.js
- **Text Simplification**: Line ~400 in content.js
- **Summarization**: Line ~350 in content.js
- **Jargon Dictionary**: Line ~50 in content.js
- **Word Simplifications**: Line ~120 in content.js

### Performance Notes:
- Extension uses minimal memory (~2-5MB)
- No external API calls (everything runs locally)
- No tracking or analytics
- No data collection

## 🔒 Privacy & Security

### What the Extension Does:
- ✅ Reads page text to analyze complexity
- ✅ Stores settings in Chrome sync storage
- ✅ Counts statistics locally

### What it Doesn't Do:
- ❌ No external servers contacted
- ❌ No user data collected
- ❌ No browsing history tracked
- ❌ No personal information stored

### Permissions Explained:
- **scripting**: To inject simplification UI
- **activeTab**: To read current page content
- **storage**: To save your settings
- **contextMenus**: For right-click menu

---

## 🎊 Congratulations!

You've successfully installed and configured **Explain This Page v4.0**!

**Happy simplified reading!** 🧠✨

---

*Version 4.0.0 | October 2025*
*For questions or issues, check the README.md file*
