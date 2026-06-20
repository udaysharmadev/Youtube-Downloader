"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { History, Search, Download, Trash2, ArrowUpDown, Music, Video, DownloadCloud } from "lucide-react";
import { useDownloaderStore } from "@/store/use-downloader-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc";
type FilterOption = "all" | "video" | "audio";

export default function HistoryPage() {
  const [isClient, setIsClient] = useState(false);
  const { history, removeHistoryItem, clearHistory } = useDownloaderStore();
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [filter, setFilter] = useState<FilterOption>("all");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="p-8">Loading history...</div>;

  const filteredHistory = history.filter(item => {
    if (filter !== "all" && item.format !== filter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filteredHistory.sort((a, b) => {
    switch (sort) {
      case "date-desc": return b.timestamp - a.timestamp;
      case "date-asc": return a.timestamp - b.timestamp;
      case "name-asc": return a.title.localeCompare(b.title);
      case "name-desc": return b.title.localeCompare(a.title);
      default: return 0;
    }
  });

  const exportAsCsv = () => {
    if (history.length === 0) return;
    
    const headers = ["Title", "URL", "Format", "Date"];
    const rows = history.map(h => [
      `"${h.title.replace(/"/g, '""')}"`,
      h.url,
      h.format,
      new Date(h.timestamp).toISOString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `youtube_downloader_history_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("History exported to CSV");
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 flex-1 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <History className="w-8 h-8 text-primary" /> Download History
          </h1>
          <p className="text-muted-foreground">Manage and export your previous downloads.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAsCsv} disabled={history.length === 0} className="rounded-xl shadow-sm">
            <DownloadCloud className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button variant="destructive" onClick={clearHistory} disabled={history.length === 0} className="rounded-xl shadow-sm">
            <Trash2 className="w-4 h-4 mr-2" /> Clear All
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search history..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-12 rounded-xl shadow-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterOption)}
          >
            <option value="all">All Formats</option>
            <option value="video">Video Only</option>
            <option value="audio">Audio Only</option>
          </select>

          <Button 
            variant="outline" 
            className="h-12 rounded-xl shadow-sm px-3"
            onClick={() => setSort(sort === "date-desc" ? "date-asc" : "date-desc")}
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No history found</p>
          <p className="text-sm">Your download history will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm shadow-sm group hover:shadow-md transition-all">
              <div className="flex p-4 gap-4">
                <div className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {item.format === 'audio' ? <Music className="w-4 h-4 opacity-30" /> : <Video className="w-4 h-4 opacity-30" />}
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 rounded font-medium">
                    {item.format.toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <h4 className="text-sm font-semibold line-clamp-2 leading-tight" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      {format(item.timestamp, "MMM d, yyyy")}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeHistoryItem(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
