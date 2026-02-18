"use client";

import { useState, useCallback, useEffect } from "react";

interface CounterData {
  id: string;
  currentCount: number;
  target: number;
  lifetimeCount: number;
  lastUpdated: string;
}

export default function TasbeehCounter() {
  const [counter, setCounter] = useState<CounterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState("");

  // Fetch counter on mount
  useEffect(() => {
    fetchCounter();
  }, []);

  const fetchCounter = async () => {
    try {
      const res = await fetch("/api/counter");
      if (res.ok) {
        const data = await res.json();
        setCounter(data);
      }
    } catch (err) {
      console.error("Failed to fetch counter:", err);
    } finally {
      setLoading(false);
    }
  };

  const increment = useCallback(async () => {
    if (!counter) return;

    // Optimistic update
    setCounter((prev) =>
      prev
        ? {
            ...prev,
            currentCount: prev.currentCount + 1,
            lifetimeCount: prev.lifetimeCount + 1,
          }
        : prev
    );
    setAnimating(true);
    setTimeout(() => setAnimating(false), 200);

    try {
      const res = await fetch("/api/counter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "increment" }),
      });
      if (res.ok) {
        const data = await res.json();
        setCounter(data);
      }
    } catch (err) {
      console.error("Failed to increment:", err);
      fetchCounter(); // re-sync on error
    }
  }, [counter]);

  const reset = useCallback(async () => {
    if (!counter) return;

    setCounter((prev) => (prev ? { ...prev, currentCount: 0 } : prev));

    try {
      const res = await fetch("/api/counter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        const data = await res.json();
        setCounter(data);
      }
    } catch (err) {
      console.error("Failed to reset:", err);
      fetchCounter();
    }
  }, [counter]);

  const changeTarget = useCallback(async () => {
    const target = parseInt(newTarget, 10);
    if (!target || target < 1) return;

    try {
      const res = await fetch("/api/counter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setTarget", target }),
      });
      if (res.ok) {
        const data = await res.json();
        setCounter(data);
        setEditingTarget(false);
        setNewTarget("");
      }
    } catch (err) {
      console.error("Failed to set target:", err);
    }
  }, [newTarget]);

  // Keyboard support: press Space or Enter to increment
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        (e.key === " " || e.key === "Enter") &&
        !editingTarget &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "BUTTON"
      ) {
        e.preventDefault();
        increment();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [increment, editingTarget]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!counter) {
    return (
      <div className="text-center py-20 text-emerald-300">
        <p>Could not load counter data. Please try refreshing.</p>
      </div>
    );
  }

  const progress = counter.target > 0 ? (counter.currentCount / counter.target) * 100 : 0;
  const completedRounds = counter.target > 0 ? Math.floor(counter.lifetimeCount / counter.target) : 0;
  const isComplete = counter.currentCount >= counter.target;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto px-4">
      {/* Progress Ring */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background ring */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-emerald-900/40"
          />
          {/* Progress ring */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - Math.min(progress, 100) / 100)}
            className={`transition-all duration-300 ${
              isComplete ? "text-amber-400" : "text-emerald-400"
            }`}
          />
        </svg>

        {/* Center count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-5xl sm:text-6xl font-bold transition-transform duration-200 ${
              animating ? "scale-110" : "scale-100"
            } ${isComplete ? "text-amber-300" : "text-emerald-200"}`}
          >
            {counter.currentCount}
          </span>
          <span className="text-sm text-emerald-400/70 mt-1">
            / {counter.target}
          </span>
        </div>
      </div>

      {/* Tap / Click button */}
      <button
        onClick={increment}
        className={`w-full max-w-xs py-5 rounded-2xl text-xl font-semibold transition-all duration-150 active:scale-95 select-none ${
          isComplete
            ? "bg-amber-600/80 hover:bg-amber-500 text-amber-100"
            : "bg-emerald-600 hover:bg-emerald-500 text-white"
        }`}
      >
        {isComplete ? "☪ Target Reached — Keep Going" : "☪ Tap to Count"}
      </button>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-6 text-sm text-emerald-300/80">
        <div className="text-center">
          <p className="text-lg font-semibold text-emerald-200">
            {counter.lifetimeCount.toLocaleString()}
          </p>
          <p>Lifetime</p>
        </div>
        <div className="w-px h-8 bg-emerald-700/50" />
        <div className="text-center">
          <p className="text-lg font-semibold text-emerald-200">
            {completedRounds}
          </p>
          <p>Rounds</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="flex-1 py-2.5 rounded-xl bg-emerald-800/50 border border-emerald-700/40 text-emerald-300 hover:bg-emerald-800 transition text-sm"
        >
          Reset Count
        </button>

        {editingTarget ? (
          <div className="flex-1 flex gap-2">
            <input
              type="number"
              min={1}
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="e.g. 33"
              className="w-full px-3 py-2.5 rounded-xl bg-emerald-900 border border-emerald-700 text-emerald-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && changeTarget()}
            />
            <button
              onClick={changeTarget}
              className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-500 transition"
            >
              ✓
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setNewTarget(String(counter.target));
              setEditingTarget(true);
            }}
            className="flex-1 py-2.5 rounded-xl bg-emerald-800/50 border border-emerald-700/40 text-emerald-300 hover:bg-emerald-800 transition text-sm"
          >
            Set Target
          </button>
        )}
      </div>

      <p className="text-xs text-emerald-500/50 mt-2">
        Press <kbd className="px-1.5 py-0.5 rounded border border-emerald-700/40 text-emerald-400/60">Space</kbd> or tap to count
      </p>
    </div>
  );
}
