import { useEffect, useState } from "react";
import { processContent } from "../utils/processor";
import { GlassCard } from "../components/GlassCard";
import { BookOpen, Copy, Download, ExternalLink } from "lucide-react";

export default function App() {
  const [data, setData] = useState<{
    title: string;
    content: string;
    originalUrl: string;
  } | null>(null);
  const [result, setResult] = useState<ReturnType<
    typeof processContent
  > | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["simplifiedContent"], (res) => {
        if (res.simplifiedContent) {
          setData(res.simplifiedContent);
          const processed = processContent(res.simplifiedContent.content);
          setResult(processed);
        }
        setLoading(false);
      });
    } else {
      // Mock for dev
      setData({
        title: "Mock Page",
        content:
          "This is a demonstration of the simplification process. It utilizes algorithms to elucidate complex terminology.",
        originalUrl: "https://example.com",
      });
      setResult(
        processContent(
          "This is a demonstration of the simplification process. It utilizes algorithms to elucidate complex terminology.",
        ),
      );
      setLoading(false);
    }
  }, []);

  const handleMouseOver = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("jargon-term")) {
      const tip = target.getAttribute("data-tip");
      if (tip) {
        const rect = target.getBoundingClientRect();
        setActiveTooltip({
          x: rect.left + rect.width / 2,
          y: rect.top,
          text: tip,
        });
      }
    } else {
      setActiveTooltip(null);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-white/50">
        Simulating Intelligence...
      </div>
    );
  if (!data || !result)
    return (
      <div className="flex h-screen items-center justify-center text-white/50">
        No content found. Try simplifying a page first.
      </div>
    );

  return (
    <div
      className="min-h-screen p-8 max-w-5xl mx-auto pb-20"
      onMouseOver={handleMouseOver}
    >
      {/* Background - handled by global CSS, removing manual blob for cleaner look */}

      {activeTooltip && (
        <div
          className="glass-panel fixed z-[100] px-4 py-3 text-white text-sm rounded-lg shadow-2xl -translate-x-1/2 -translate-y-[calc(100%+10px)] max-w-xs"
          style={{ left: activeTooltip.x, top: activeTooltip.y }}
        >
          <div className="font-semibold text-accent mb-1 text-xs uppercase tracking-wide">
            Definition
          </div>
          {activeTooltip.text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 bg-gray-900/50 backdrop-blur rotate-45 border-r border-b border-white/10"></div>
        </div>
      )}

      <header className="mb-10 flex items-end justify-between animate-fade-in-up">
        <div>
          <a
            href={data.originalUrl}
            target="_blank"
            className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-4 text-sm font-medium"
          >
            <ExternalLink size={14} /> View Original Page
          </a>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 leading-tight max-w-3xl">
            {data.title}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            className="glass-button p-3 rounded-xl text-white/80 hover:text-white"
            title="Copy Text"
            onClick={() =>
              navigator.clipboard.writeText(
                document.querySelector(".prose")?.textContent || "",
              )
            }
          >
            <Copy size={20} />
          </button>
          <button
            className="glass-button p-3 rounded-xl text-white/80 hover:text-white"
            title="Print / save as PDF"
            onClick={() => window.print()}
          >
            <Download size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatBox
          label="Time Saved"
          value={`${result.stats.readingTime} min`}
          delay={0.1}
          icon={<BookOpen size={18} className="text-primary" />}
        />
        <StatBox
          label="Complexity"
          value={`-${result.stats.wordsChanged}`}
          sub="terms"
          delay={0.2}
        />
        <StatBox
          label="Jargon"
          value={`${result.stats.jargonTerms}`}
          sub="explained"
          delay={0.3}
        />
        <StatBox
          label="Paragraphs"
          value={`${result.stats.paragraphs}`}
          delay={0.4}
        />
      </div>

      <GlassCard
        className="p-8 md:p-12 min-h-[500px] border-primary/10 shadow-2xl shadow-primary/5"
        delay={0.5}
      >
        <div
          className="prose prose-invert prose-lg max-w-none text-gray-300 [&>p]:mb-6 [&>p]:leading-loose"
          dangerouslySetInnerHTML={{ __html: result.text }}
        />
      </GlassCard>
    </div>
  );
}

const StatBox = ({ label, value, sub, delay, icon }: any) => (
  <GlassCard
    className="text-center py-6 px-4 flex flex-col items-center justify-center bg-white/5 border-white/10 hover:border-primary/30 transition-colors duration-300"
    delay={delay}
  >
    {icon && <div className="mb-2 opacity-80">{icon}</div>}
    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-1 tracking-tight">
      {value}
    </div>
    <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
      {label} {sub && <span className="opacity-50"> {sub}</span>}
    </div>
  </GlassCard>
);
