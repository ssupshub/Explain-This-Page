import { Dictionary } from "./dictionary";

interface SimplifyResult {
  text: string;
  stats: {
    wordsChanged: number;
    paragraphs: number;
    jargonTerms: number;
    readingTime: number;
  };
}

export function processContent(text: string): SimplifyResult {
  let simplified = text;
  let wordsChanged = 0;

  // 1. Replace complex words
  Object.entries(Dictionary.wordSimplify).forEach(([complex, simple]) => {
    const regex = new RegExp(`\\b${complex}\\b`, "gi");
    const matches = simplified.match(regex);
    if (matches) {
      wordsChanged += matches.length;
      simplified = simplified.replace(regex, simple);
    }
  });

  // 2. Highlight Jargon (wrap in spans)
  // We will return HTML string or React nodes?
  // For Viewer text, HTML string is easiest to store/render safely if we trust it,
  // but better to return text and list of jargon?
  // Actually the requirement is "Highlight Jargon".
  // We can wrap jargon in <span class="jargon" data-tip="...">
  let jargonCount = 0;
  Object.entries(Dictionary.jargonDefinitions).forEach(([term, definition]) => {
    const regex = new RegExp(`\\b(${term})\\b`, "gi");
    if (regex.test(simplified)) {
      jargonCount++;
      // Use a special marker we can parse in React, or just HTML
      simplified = simplified.replace(
        regex,
        `<span class="jargon-term text-primary font-medium border-b border-primary/30 cursor-help transition-colors hover:bg-primary/10 relative group" data-tip="${definition}">$1</span>`,
      );
    }
  });

  // 3. Break long sentences
  simplified = breakLongSentences(simplified);

  // 4. Format paragraphs
  const paragraphs = simplified
    .split("\n\n")
    .filter((p) => p.trim().length > 0);
  const formattedHTML = paragraphs
    .map((p) => `<p class="mb-6 text-lg leading-relaxed">${p}</p>`)
    .join("");

  return {
    text: formattedHTML,
    stats: {
      wordsChanged,
      paragraphs: paragraphs.length,
      jargonTerms: jargonCount,
      readingTime: Math.ceil(text.split(/\s+/).length / 200),
    },
  };
}

function breakLongSentences(text: string): string {
  // Simple heuristic from original code
  return text.replace(/([^.!?]+[.!?]+)/g, (sentence) => {
    const words = sentence.trim().split(/\s+/);
    if (words.length > 25) {
      const breakPoints = [", and ", ", but ", ", because ", ", when "];
      for (const bp of breakPoints) {
        if (sentence.includes(bp)) {
          return sentence.replace(bp, `.${bp.trim()} `); // Super simple split
        }
      }
    }
    return sentence;
  });
}
