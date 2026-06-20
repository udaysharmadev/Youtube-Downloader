"use client";

import { useState } from "react";
import { Download, Video, CheckCircle2, Loader2, Music, Clock, Eye, Calendar, User, Star } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDownloaderStore } from "@/store/use-downloader-store";
import { cn } from "@/lib/utils";

interface MediaFormat {
  itag: string;
  qualityLabel: string;
  resolution: string;
  fps: number | null;
  vcodec: string;
  acodec: string;
  container: string;
  type: string;
  filesize: number | null;
  isRecommended?: boolean;
}

interface MediaInfo {
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
  viewCount: number;
  formats: MediaFormat[];
}

interface MediaCardProps {
  info: MediaInfo;
  onDownloadStateChange: (state: "idle" | "loading" | "error" | "success") => void;
}

export function MediaCard({ info, onDownloadStateChange }: MediaCardProps) {
  const defaultFormat = info.formats.find(f => f.isRecommended) || info.formats[0];
  const [selectedItag, setSelectedItag] = useState<string>(defaultFormat?.itag || "");
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const addHistoryItem = useDownloaderStore((state) => state.addHistoryItem);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatFilesize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleDownload = async () => {
    const selectedFormat = info.formats.find(f => f.itag === selectedItag) || info.formats[0];
    if (!selectedFormat) return;

    setIsDownloading(true);
    setIsSuccess(false);
    setProgress(0);
    onDownloadStateChange("loading");

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(info.url)}&itag=${encodeURIComponent(selectedFormat.itag)}&type=${selectedFormat.type}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Download failed");
        throw new Error(errorText);
      }

      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get("Content-Length") || 0);

      if (!reader) throw new Error("Stream not available");

      let receivedLength = 0;
      const chunks: BlobPart[] = [];

      for (;;) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.byteLength;

        if (contentLength) {
          setProgress((receivedLength / contentLength) * 100);
        } else {
          setProgress((prev) => Math.min(prev + (100 - prev) * 0.05, 95));
        }
      }

      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${info.title.replace(/[^\w\s-]/gi, "")}.${selectedFormat.container}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      setProgress(100);
      setIsSuccess(true);
      onDownloadStateChange("success");

      addHistoryItem({
        id: Date.now().toString(),
        url: info.url,
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        format: selectedFormat.type as "video" | "audio",
        timestamp: Date.now(),
      });

      toast.success("Download completed successfully!");

      setTimeout(() => {
        setIsSuccess(false);
        setProgress(0);
        onDownloadStateChange("idle");
      }, 3000);

    } catch (error: any) {
      onDownloadStateChange("error");
      toast.error(error?.message || "Failed to download media.");
      setProgress(0);
    } finally {
      setIsDownloading(false);
    }
  };

  const getFormatIcon = (type: string) => {
    return type === "audio" ? <Music className="w-4 h-4" /> : <Video className="w-4 h-4" />;
  };

  // Group formats
  const videoFormats = info.formats.filter(f => f.type === "video");
  const audioFormats = info.formats.filter(f => f.type === "audio");

  return (
    <Card className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-md shadow-sm">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-[320px] shrink-0 bg-muted/30 p-4 flex items-center justify-center">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md group">
            {info.thumbnail ? (
              <img
                src={info.thumbnail}
                alt={info.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Video className="w-12 h-12 opacity-20" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {formatDuration(info.duration)}
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-bold text-xl md:text-2xl line-clamp-2 leading-tight mb-3">
              {info.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="font-medium text-foreground/80">{info.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{formatViewCount(info.viewCount)} views</span>
              </div>
            </div>

            <div className="space-y-6">
              {videoFormats.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                    <Video className="w-4 h-4 text-primary" /> Video Qualities
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {videoFormats.map((f) => (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={f.itag}
                        onClick={() => setSelectedItag(f.itag)}
                        disabled={isDownloading}
                        className={cn(
                          "flex flex-col items-start justify-between p-4 rounded-xl border text-left transition-all relative overflow-hidden",
                          selectedItag === f.itag 
                            ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                            : "border-border/50 bg-card/50 hover:bg-muted/80 hover:border-border hover:shadow-sm",
                          isDownloading && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {selectedItag === f.itag && (
                          <motion.div layoutId="active-bg" className="absolute inset-0 bg-primary/5 z-0" />
                        )}
                        {f.isRecommended && (
                          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm flex items-center gap-1 z-10">
                            <Star className="w-3 h-3 fill-current" /> Recommended
                          </div>
                        )}
                        <div className="relative z-10 w-full">
                          <div className="flex items-center justify-between w-full mb-2">
                            <span className={cn(
                              "font-bold text-lg",
                              selectedItag === f.itag ? "text-primary" : "text-foreground"
                            )}>
                              {f.qualityLabel}
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-md text-muted-foreground">
                              {f.fps ? `${f.fps} FPS` : "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                            <span>{f.container.toUpperCase()} • {f.vcodec.split(".")[0].toUpperCase()}</span>
                            <span>{formatFilesize(f.filesize)}</span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {audioFormats.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                    <Music className="w-4 h-4 text-primary" /> Audio Options
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {audioFormats.map((f) => (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={f.itag}
                        onClick={() => setSelectedItag(f.itag)}
                        disabled={isDownloading}
                        className={cn(
                          "flex flex-col items-start justify-between p-4 rounded-xl border text-left transition-all relative overflow-hidden",
                          selectedItag === f.itag 
                            ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                            : "border-border/50 bg-card/50 hover:bg-muted/80 hover:border-border hover:shadow-sm",
                          isDownloading && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {selectedItag === f.itag && (
                          <motion.div layoutId="active-bg" className="absolute inset-0 bg-primary/5 z-0" />
                        )}
                        <div className="relative z-10 w-full">
                          <div className="flex items-center justify-between w-full mb-2">
                            <span className={cn(
                              "font-bold",
                              selectedItag === f.itag ? "text-primary" : "text-foreground"
                            )}>
                              {f.qualityLabel}
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-md text-muted-foreground">
                              {f.container.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-end text-xs text-muted-foreground font-medium">
                            <span>{formatFilesize(f.filesize) || "Unknown Size"}</span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 mt-auto pt-4 border-t border-border/40">
            <AnimatePresence>
              {(isDownloading || isSuccess) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground flex items-center gap-2">
                      {isSuccess ? (
                        <span className="text-green-500 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Complete</span>
                      ) : (
                        <span className="text-primary flex items-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</span>
                      )}
                    </span>
                    <span className="tabular-nums">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-muted/50" />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              className="w-full rounded-xl h-12 text-base font-medium transition-all shadow-sm"
              onClick={handleDownload}
              disabled={isDownloading || isSuccess || info.formats.length === 0}
              variant={isSuccess ? "secondary" : "default"}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Saved to Device
                </>
              ) : isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Media...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Now
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
