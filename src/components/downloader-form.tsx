"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ArrowRight, ClipboardPaste } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDownloaderStore } from "@/store/use-downloader-store";
import { MediaCard } from "./media-card";
import { PlaylistCard } from "./playlist-card";
import { HistoryList } from "./history-list";
import { Skeleton } from "@/components/ui/skeleton";

export function DownloaderForm() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [mediaInfo, setMediaInfo] = useState<any>(null);
  const [clipboardUrl, setClipboardUrl] = useState<string | null>(null);
  const addToQueue = useDownloaderStore((state) => state.addToQueue);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleClear = () => {
    setUrl("");
    setMediaInfo(null);
    setState("idle");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to clear
      if (e.key === "Escape") {
        handleClear();
      }
      // Focus input on any typing if not focused
      if (document.activeElement !== inputRef.current && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clipboard detection
    const checkClipboard = async () => {
      try {
        if (!navigator.clipboard) return;
        const text = await navigator.clipboard.readText();
        if (text && (text.includes("youtube.com") || text.includes("youtu.be"))) {
          if (text !== url) {
            setClipboardUrl(text);
          }
        } else {
          setClipboardUrl(null);
        }
      } catch (err) {
        // Ignore permission errors silently
      }
    };

    window.addEventListener("focus", checkClipboard);
    // Initial check (may prompt user depending on browser, so we wait for focus usually, but let's try)
    checkClipboard();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focus", checkClipboard);
    };
  }, [url]);

  const fetchMetadata = async (targetUrl: string) => {
    if (!targetUrl) return;

    // Check if multiple URLs are passed
    const urls = targetUrl.split(/\r?\n/).map(u => u.trim()).filter(u => u);
    
    if (urls.length > 1) {
      // Batch mode
      setState("loading");
      setMediaInfo(null);
      let successCount = 0;

      for (const u of urls) {
        try {
          // Just queue them directly with minimal info, let queue manager fetch deep info?
          // No, Queue needs format. We have to fetch metadata to get formats.
          // For simplicity, we just fetch them.
          const res = await fetch("/api/info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: u }),
          });
          const data = await res.json();
          if (res.ok && data) {
            // Queue it automatically
            const defaultFormat = data.formats?.find((f: any) => f.isRecommended) || data.formats?.[0];
            if (defaultFormat) {
              addToQueue({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                url: u,
                title: data.title,
                thumbnail: data.thumbnail,
                duration: data.duration,
                format: defaultFormat.type as 'video' | 'audio',
                qualityLabel: defaultFormat.qualityLabel,
                itag: defaultFormat.itag,
                type: defaultFormat.type,
                status: 'pending',
                progress: 0,
                addedAt: Date.now(),
              });
              successCount++;
            }
          }
        } catch (err) {
          // Skip failures in batch
        }
      }
      
      setState("idle");
      setUrl("");
      if (successCount > 0) {
        toast.success(`Queued ${successCount} items successfully!`);
      } else {
        toast.error("Failed to process batch URLs.");
      }
      return;
    }

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

  const handlePasteClipboard = () => {
    if (clipboardUrl) {
      setUrl(clipboardUrl);
      setClipboardUrl(null);
      fetchMetadata(clipboardUrl);
    }
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
        <textarea
          ref={inputRef}
          placeholder="Paste one or multiple YouTube URLs..."
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-4 py-4 text-lg min-h-[56px] max-h-32 placeholder:text-muted-foreground/50 resize-none outline-none"
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

      <AnimatePresence>
        {clipboardUrl && !url && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePasteClipboard}
              className="rounded-full shadow-sm border border-border/50 text-xs gap-2 px-4 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              YouTube link detected. Paste now.
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {state === "loading" && !mediaInfo && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full bg-card/40 backdrop-blur-md rounded-xl border border-border/50 p-6 flex flex-col md:flex-row gap-6 shadow-sm"
          >
            <div className="w-full md:w-[320px] shrink-0">
              <Skeleton className="w-full aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="flex-1 space-y-4 py-2">
              <Skeleton className="h-8 w-3/4 bg-muted/50" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24 bg-muted/50" />
                <Skeleton className="h-4 w-24 bg-muted/50" />
              </div>
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Skeleton className="h-16 w-full rounded-xl bg-muted/50" />
                <Skeleton className="h-16 w-full rounded-xl bg-muted/50" />
                <Skeleton className="h-16 w-full rounded-xl bg-muted/50" />
              </div>
            </div>
          </motion.div>
        )}

        {mediaInfo && state !== "loading" && (
          <motion.div
            key="media-card"
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            {mediaInfo.type === 'playlist' ? (
              <PlaylistCard info={mediaInfo} />
            ) : (
              <MediaCard
                info={mediaInfo}
                onDownloadStateChange={(newState) => setState(newState === "idle" ? "success" : newState)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <HistoryList />
    </div>
  );
}
