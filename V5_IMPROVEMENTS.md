# 🎯 Version 5 Series Improvements

This document outlines the major evolution from v4 to the v5.x series.

## 🌟 v5.2: Visual Polish & Tools

_Latest Update_

The focus of v5.2 was making the experience **beautiful** and **useful**.

### key Changes:

- **Glassmorphism Design**: Replaced flat colors with modern, translucent materials.
- **Dark Mode**: First-class support for dark themes.
- **Productivity Tools**: PDF Export and Clipboard actions added.
- **Statistics**: Enhanced reading time calculations.

---

## 💥 v5.0: The Architecture Shift

### Problem: The Overlay Era (v4)

In v4, we used an "overlay" (a popup inside the page).

- **Cons**: Blocked by ad-blockers, cramped space, broke page layout, difficult to read long content.

### Solution: The New Tab Approach (v5)

We now extract the content and open it in a pristine **New Tab**.

- **Pros**:
  - ✅ **100% Reliable** (No blocking)
  - ✅ **Unlimited Space** (Good for 10,000+ word articles)
  - ✅ **Distraction Free** (No ads, no sidebars)
  - ✅ **Secure** (Runs in a sandbox)

---

## 📊 Comparison: v4 vs v5.x

| Feature       | v4.0 (Old)         | v5.2 (New)               |
| ------------- | ------------------ | ------------------------ |
| **Display**   | Page Overlay       | **Dedicated New Tab**    |
| **Theme**     | Light Only         | **Light + Dark + Glass** |
| **Capacity**  | ~500 words         | **50,000+ words**        |
| **Blocking**  | Frequently Blocked | **Never Blocked**        |
| **Export**    | None               | **PDF Download**         |
| **Selection** | No                 | **Yes (Right-click)**    |

---

## 🛠️ Technical Improvements in v5

### Content Extraction

**Old**: Grabbed just the `<p>` tags.
**New**: Intelligently scans `article`, `section`, `div`, `li`, and excludes navigational elements/footers to build a clean "Reader Mode" text.

### Detection Logic

**Old**: Simple word matching.
**New**: Context-aware regex patterns that preserve sentence structure and grammar (Active Voice conversion, Sentence Breaking).

### Privacy

**Old**: Some implementation plans considered external APIs.
**New**: v5.2 runs **100% Locally** using advanced dictionary & regex algorithms. Private and fast.
