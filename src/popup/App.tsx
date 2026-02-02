import { ThemeToggle } from "../components/ThemeToggle";

// ... existing imports ...

      <header className="flex w-full justify-between items-center mb-8 relative z-10">
        <div className="flex items-center">
          <div className="p-3 glass-button rounded-xl mr-4 shadow-lg shadow-primary/20">
            <Sparkles size={24} className="text-secondary animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Explain This Page
            </h1>
            <p className="text-xs text-muted font-medium tracking-wide">
              AI SIMPLIFIER
            </p>
          </div>
        </div>
        <ThemeToggle />
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
              <h2 className="text-2xl font-bold mb-1 text-main group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
                Simplify
              </h2>
              <p className="text-xs text-muted group-hover:text-main transition-colors">Generate summary & stats</p>
            </div>
            <div
              className={`p-4 rounded-full bg-white/10 group-hover:bg-primary/20 transition-all ${
                loading ? "animate-spin" : ""
              }`}
            >
              {loading ? (
                <Zap size={24} className="text-yellow-300" />
              ) : (
                <ChevronRight size={24} className="text-main" />
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
            <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-bold">
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
            <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-bold">
              Words
            </div>
          </GlassCard>
        </div>

        <GlassCard
          className="py-4 px-5 flex items-start gap-3 bg-glass-bg"
          delay={0.3}
        >
          <div className="mt-1 p-1.5 rounded bg-accent/20">
            <FileText size={14} className="text-accent-foreground text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-main mb-1">Quick Tip</p>
            <p className="text-[11px] text-muted leading-relaxed">
              You can simplify specific sections by selecting text and using the
              right-click menu.
            </p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
