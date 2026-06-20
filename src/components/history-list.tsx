"use client";

import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { History, Download, Trash2, Search, Video, Music, Link2, Copy, Filter, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { useDownloaderStore } from "@/store/use-downloader-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function HistoryList() {
  const { history, clearHistory, removeHistoryItem } = useDownloaderStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "video" | "audio">("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "name">("newest");

  const filteredAndSortedHistory = useMemo(() => {
    let result = [...history];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(q) || item.url.toLowerCase().includes(q));
    }

    // Filter
    if (filter !== "all") {
      result = result.filter(item => item.format === filter);
    }

    // Sort
    result.sort((a, b) => {
      if (sort === "newest") return b.timestamp - a.timestamp;
      if (sort === "oldest") return a.timestamp - b.timestamp;
      if (sort === "name") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [history, searchQuery, filter, sort]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all download history?")) {
      clearHistory();
      toast.success("History cleared");
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (history.length === 0) return null;

  return (
    <div className="w-full space-y-6 mt-16 pt-8 border-t border-border/40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-bold tracking-tight">Recent Downloads</h2>
          <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium text-muted-foreground ml-2">
            {filteredAndSortedHistory.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search downloads..."
              className="pl-9 h-9 bg-card/50 backdrop-blur-sm border-border/50 text-sm focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2 border-border/50 bg-card/50">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Format</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setFilter("all")} className={cn(filter === "all" && "bg-muted")}>All Formats</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("video")} className={cn(filter === "video" && "bg-muted")}>Video Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("audio")} className={cn(filter === "audio" && "bg-muted")}>Audio Only</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSort("newest")} className={cn(sort === "newest" && "bg-muted")}>Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("oldest")} className={cn(sort === "oldest" && "bg-muted")}>Oldest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("name")} className={cn(sort === "name" && "bg-muted")}>Name (A-Z)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={handleClearHistory} className="h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-border/50 border-dashed"
            >
              No downloads match your filters.
            </motion.div>
          ) : (
            filteredAndSortedHistory.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="flex items-center gap-4 p-3 bg-card/40 backdrop-blur-sm border-border/50 hover:bg-muted/30 transition-colors group">
                  <div className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-6 h-6 opacity-20" />
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-medium">
                      {formatDuration(item.duration)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-medium text-sm truncate text-foreground/90 mb-1" title={item.title}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {item.format === "video" ? <Video className="w-3 h-3" /> : <Music className="w-3 h-3" />}
                        <span className="capitalize">{item.format}</span>
                      </span>
                      <span>•</span>
                      <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleCopyLink(item.url)} title="Copy original link">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 text-muted-foreground hover:text-foreground" title="Open original link">
                      <Link2 className="w-4 h-4" />
                    </a>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeHistoryItem(item.id)} title="Remove from history">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
