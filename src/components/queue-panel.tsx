"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListVideo, X, Play, Pause, Trash2, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useDownloaderStore } from "@/store/use-downloader-store";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function QueuePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const queue = useDownloaderStore((state) => state.queue);
  const removeFromQueue = useDownloaderStore((state) => state.removeFromQueue);
  const updateQueueItem = useDownloaderStore((state) => state.updateQueueItem);

  const activeCount = queue.filter(q => q.status === 'pending' || q.status === 'downloading').length;

  if (queue.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 sm:w-96 bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden mb-4 pointer-events-auto"
          >
            <div className="p-4 bg-muted/50 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <ListVideo className="w-4 h-4" /> Downloads ({queue.length})
              </h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {queue.slice().reverse().map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        "p-3 rounded-xl border border-border/50 bg-background/50 space-y-2 relative group",
                        item.status === 'downloading' && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <div className="flex gap-3 items-start">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="w-16 h-10 object-cover rounded-md shrink-0" />
                        ) : (
                          <div className="w-16 h-10 bg-muted rounded-md shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" title={item.title}>{item.title}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                            <span className="uppercase">{item.format}</span> • <span>{item.qualityLabel}</span>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1">
                          {item.status === 'pending' && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => removeFromQueue(item.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                          {(item.status === 'completed' || item.status === 'failed') && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFromQueue(item.id)}>
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status === 'downloading' && (
                          <>
                            <Progress value={item.progress} className="h-1.5 flex-1" />
                            <span className="text-[10px] font-medium tabular-nums shrink-0">{Math.round(item.progress)}%</span>
                          </>
                        )}
                        {item.status === 'pending' && (
                          <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Waiting in queue...
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <span className="text-[10px] font-medium text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        )}
                        {item.status === 'failed' && (
                          <span className="text-[10px] font-medium text-destructive flex items-center gap-1" title={item.error}>
                            <AlertCircle className="w-3 h-3" /> Failed
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-full shadow-xl pointer-events-auto transition-all duration-300 flex items-center gap-2 px-4 h-12",
          activeCount > 0 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-card text-foreground border border-border/50 hover:bg-muted"
        )}
      >
        {activeCount > 0 ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ListVideo className="w-4 h-4" />
        )}
        <span className="font-medium text-sm">
          {activeCount > 0 ? `${activeCount} active` : `Queue (${queue.length})`}
        </span>
        {isOpen ? <ChevronDown className="w-4 h-4 ml-1 opacity-50" /> : <ChevronUp className="w-4 h-4 ml-1 opacity-50" />}
      </Button>
    </div>
  );
}
