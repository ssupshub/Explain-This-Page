import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check storage or system preference
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["theme"], (result) => {
        if (result.theme) {
          setIsDark(result.theme === "dark");
        } else {
          // Default to dark
          setIsDark(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Save preference
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ theme: isDark ? "dark" : "light" });
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-xl transition-all glass-button hover:bg-white/20 text-primary"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};
