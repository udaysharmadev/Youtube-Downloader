"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaCard } from "./media-card";
import { HistoryList } from "./history-list";

export function DownloaderForm() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [mediaInfo, setMediaInfo] = useState<any>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setUrl("");
    setMediaInfo(null);
    setState("idle");
    inputRef.current?.focus();
  };

  const fetchMetadata = async (targetUrl: string) => {
    if (!targetUrl) return;

    setState("loading");
    setMediaInfo(null);

    try {
      const res = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch metadata");
      }

      setMediaInfo({ ...data, url: targetUrl });
      setState("success");
    } catch (err: any) {
      toast.error(err.message);
      setState("error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMetadata(url);
  };

  return (
    <div className="w-full mx-auto space-y-12">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative group flex items-center shadow-sm rounded-2xl bg-card border border-border/50 p-2 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/30 transition-all duration-300 hover:shadow-md"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <Input
          ref={inputRef}
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-4 text-lg h-14 placeholder:text-muted-foreground/50"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div className="flex gap-2 relative z-10">
          <AnimatePresence>
            {url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-12 w-12 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={handleClear}
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            size="icon"
            className="rounded-xl h-12 w-12 font-medium transition-all duration-300 hover:scale-105 shadow-sm"
            disabled={state === "loading" || !url}
          >
            {state === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </Button>
        </div>
      </motion.form>

      <AnimatePresence mode="wait">
        {mediaInfo && (
          <motion.div
            key="media-card"
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <MediaCard
              info={mediaInfo}
              onDownloadStateChange={(newState) => setState(newState === "idle" ? "success" : newState)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <HistoryList />
    </div>
  );
}
