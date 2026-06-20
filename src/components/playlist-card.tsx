"use client";

import { useState } from "react";
import { Download, ListVideo, CheckCircle2, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDownloaderStore } from "@/store/use-downloader-store";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlaylistEntry {
  id: string;
  url: string;
  title: string;
  duration: number;
  thumbnail: string;
  uploader: string;
}

interface PlaylistInfo {
  type: "playlist";
  title: string;
  author: string;
  entries: PlaylistEntry[];
}

export function PlaylistCard({ info }: { info: PlaylistInfo }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(info.entries.map((e) => e.id)));
  const [isProcessing, setIsProcessing] = useState(false);
  const addToQueue = useDownloaderStore((state) => state.addToQueue);
  const defaultFormat = useDownloaderStore((state) => state.settings.defaultFormat);

  const toggleAll = () => {
    if (selectedIds.size === info.entries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(info.entries.map((e) => e.id)));
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleQueueSelected = async () => {
    if (selectedIds.size === 0) return;

    setIsProcessing(true);
    let successCount = 0;

    const selectedEntries = info.entries.filter(e => selectedIds.has(e.id));

    // For playlists, fetching deep info for each item takes too long natively.
    // We queue them as pending. The queue manager will process them.
    // However, the queue manager expects `itag` and formats to be available to download.
    // So we'll have to adjust `useQueueManager` to fetch format info before downloading if itag is missing.
    // Or we fetch info sequentially here and queue.
    
    // To keep it simple and user-friendly, we fetch info here and add to queue.
    for (const entry of selectedEntries) {
      try {
        const res = await fetch("/api/info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: entry.url }),
        });
        const data = await res.json();
        
        if (res.ok && data && data.formats) {
          const formatToUse = data.formats.find((f: any) => 
            defaultFormat === 'video' ? f.isRecommended : f.itag === 'bestaudio'
          ) || data.formats[0];

          if (formatToUse) {
            addToQueue({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              url: entry.url,
              title: data.title,
              thumbnail: data.thumbnail,
              duration: data.duration,
              format: formatToUse.type as 'video' | 'audio',
              qualityLabel: formatToUse.qualityLabel,
              itag: formatToUse.itag,
              type: formatToUse.type,
              status: 'pending',
              progress: 0,
              addedAt: Date.now(),
            });
            successCount++;
          }
        }
      } catch (err) {
        console.error("Failed to queue playlist item:", entry.id);
      }
    }

    setIsProcessing(false);
    toast.success(`Added ${successCount} items to queue!`);
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-md shadow-sm">
      <div className="p-6 border-b border-border/50 bg-muted/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
              <ListVideo className="w-4 h-4" />
              Playlist Detected
            </div>
            <h3 className="font-bold text-xl md:text-2xl line-clamp-2 leading-tight mb-2">
              {info.title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              By {info.author} • {info.entries.length} videos
            </p>
          </div>
          <Button
            onClick={handleQueueSelected}
            disabled={selectedIds.size === 0 || isProcessing}
            className="shrink-0 h-12 px-6 rounded-xl shadow-sm transition-all"
          >
            {isProcessing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
            ) : (
              <><Download className="w-4 h-4 mr-2" /> Queue {selectedIds.size}</>
            )}
          </Button>
        </div>
      </div>

      <div className="p-4 bg-muted/10 border-b border-border/50 flex items-center gap-3">
        <Checkbox
          checked={selectedIds.size === info.entries.length && info.entries.length > 0}
          onCheckedChange={toggleAll}
          id="select-all"
        />
        <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
          Select All
        </label>
      </div>

      <ScrollArea className="h-[400px] w-full">
        <div className="divide-y divide-border/30">
          {info.entries.map((entry, idx) => (
            <label
              key={entry.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
            >
              <Checkbox
                checked={selectedIds.has(entry.id)}
                onCheckedChange={() => toggleSelection(entry.id)}
                className="shrink-0"
              />
              <div className="relative w-24 aspect-video bg-muted rounded-md overflow-hidden shrink-0">
                {entry.thumbnail ? (
                  <img src={entry.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-6 h-6 opacity-20" />
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                  {Math.floor(entry.duration / 60)}:{(entry.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {idx + 1}. {entry.title}
                </h4>
              </div>
            </label>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
