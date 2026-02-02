import { useEffect, useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { Sparkles, FileText, Zap, ChevronRight } from "lucide-react";

export default function App() {
  const [stats, setStats] = useState({ pages: 0, words: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["stats"], (result) => {
        if (result.stats) setStats(result.stats);
      });
    }
  }, []);

  const handleSimplify = async () => {
    setLoading(true);
    if (typeof chrome !== "undefined" && chrome.tabs) {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (tab.id) {
          const sendMessage = async () => {
            return await chrome.tabs.sendMessage(tab.id!, {
              action: "simplify",
            });
          };

          try {
            await sendMessage();
            window.close();
          } catch (err) {
            // If message fails, try injecting the script dynamically
            console.log("Script not ready, injecting...", err);
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["content.js"],
            });

            // Wait a moment for script to initialize
            setTimeout(async () => {
              try {
                await sendMessage();
                window.close();
              } catch (e) {
                setLoading(false);
                alert(
                  "Could not connect. Please refresh the page and try again.",
                );
              }
            }, 500);
          }
        }
      } catch (e) {
        setLoading(false);
        alert("Unexpected error: " + (e as Error).message);
      }
    } else {
      // Dev mode simulation
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="w-[380px] p-6 text-white min-h-[400px] flex flex-col items-center">
      {/* Ambient Back Glow - Central Bottom Glow */}
      <div className="fixed bottom-[-100px] left-1/2 transform -translate-x-1/2 w-[300px] h-[300px] bg-primary/30 rounded-full blur-[80px] pointer-events-none fade-in" />
      <div className="fixed top-[-100px] left-1/2 transform -translate-x-1/2 w-[200px] h-[200px] bg-secondary/10 rounded-full blur-[60px] pointer-events-none" />

      <header className="flex w-full justify-start items-center mb-8 relative z-10">
        <div className="p-3 glass-button rounded-xl mr-4 shadow-lg shadow-primary/20">
          <Sparkles size={24} className="text-secondary animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-xl leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Explain This Page
          </h1>
          <p className="text-xs text-secondary/80 font-medium tracking-wide">
            AI SIMPLIFIER
          </p>
        </div>
      </header>

      <main className="w-full relative z-10">
        <button
          onClick={handleSimplify}
          disabled={loading}
          className="w-full glass-button group relative overflow-hidden rounded-2xl p-6 mb-8 text-left transition-all hover:scale-[1.02] active:scale-[0.98] border-primary/30 hover:border-primary/60 shadow-xl shadow-primary/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-accent transition-all">
                Simplify
              </h2>
              <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                Generate summary & stats
              </p>
            </div>
            <div
              className={`p-4 rounded-full bg-white/10 group-hover:bg-primary/20 transition-all ${
                loading ? "animate-spin" : ""
              }`}
            >
              {loading ? (
                <Zap size={24} className="text-yellow-300" />
              ) : (
                <ChevronRight size={24} />
              )}
            </div>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <GlassCard
            className="text-center py-5 flex flex-col justify-center items-center"
            delay={0.1}
          >
            <div className="text-3xl font-bold text-gradient mb-1">
              {stats.pages}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
              Pages
            </div>
          </GlassCard>
          <GlassCard
            className="text-center py-5 flex flex-col justify-center items-center"
            delay={0.2}
          >
            <div className="text-3xl font-bold text-gradient mb-1">
              {(stats.words / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
              Words
            </div>
          </GlassCard>
        </div>

        <GlassCard
          className="py-4 px-5 flex items-start gap-3 bg-white/5"
          delay={0.3}
        >
          <div className="mt-1 p-1.5 rounded bg-accent/20">
            <FileText size={14} className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-white/90 mb-1">Quick Tip</p>
            <p className="text-[11px] text-white/60 leading-relaxed">
              You can simplify specific sections by selecting text and using the
              right-click menu.
            </p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
