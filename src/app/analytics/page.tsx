"use client";

import { useEffect, useState } from "react";
import { BarChart3, Download, Music, Video, CalendarDays, Activity } from "lucide-react";
import { useDownloaderStore } from "@/store/use-downloader-store";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false);
  const history = useDownloaderStore((state) => state.history);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 space-y-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const totalDownloads = history.length;
  const audioCount = history.filter(h => h.format === 'audio').length;
  const videoCount = history.filter(h => h.format === 'video').length;

  // Most active day
  const days = history.reduce((acc, curr) => {
    const date = new Date(curr.timestamp).toLocaleDateString(undefined, { weekday: 'long' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostActiveDay = Object.entries(days).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 flex-1 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" /> Analytics
        </h1>
        <p className="text-muted-foreground">Your personal download metrics and usage history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <span className="text-sm font-medium">Total Downloads</span>
            <Download className="w-4 h-4" />
          </div>
          <h3 className="text-4xl font-bold">{totalDownloads}</h3>
        </Card>

        <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <span className="text-sm font-medium">Videos</span>
            <Video className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-4xl font-bold">{videoCount}</h3>
        </Card>

        <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <span className="text-sm font-medium">Audio</span>
            <Music className="w-4 h-4 text-secondary" />
          </div>
          <h3 className="text-4xl font-bold">{audioCount}</h3>
        </Card>

        <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <span className="text-sm font-medium">Most Active Day</span>
            <CalendarDays className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-bold truncate">{mostActiveDay}</h3>
        </Card>
      </div>

      {totalDownloads > 0 && (
        <Card className="p-8 border-border/50 bg-card/40 backdrop-blur-md shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Activity Distribution
          </h3>
          <div className="h-4 flex rounded-full overflow-hidden bg-muted">
            {totalDownloads > 0 && (
              <>
                <div 
                  style={{ width: `${(videoCount / totalDownloads) * 100}%` }} 
                  className="bg-primary hover:opacity-80 transition-opacity" 
                  title={`Videos: ${videoCount}`}
                />
                <div 
                  style={{ width: `${(audioCount / totalDownloads) * 100}%` }} 
                  className="bg-secondary hover:opacity-80 transition-opacity"
                  title={`Audio: ${audioCount}`}
                />
              </>
            )}
          </div>
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" /> Videos ({Math.round((videoCount / totalDownloads) * 100) || 0}%)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" /> Audio ({Math.round((audioCount / totalDownloads) * 100) || 0}%)
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
