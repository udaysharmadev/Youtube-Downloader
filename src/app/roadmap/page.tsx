import { Map, CheckCircle2, CircleDashed, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function RoadmapPage() {
  const items = [
    {
      status: "completed",
      title: "Core Extraction Engine",
      description: "Migration from deprecated ytdl-core to stable yt-dlp binary.",
      date: "Q2 2026",
    },
    {
      status: "completed",
      title: "Media Platform UI",
      description: "Clean, developer-focused interface built with Next.js 15 and Tailwind.",
      date: "Q2 2026",
    },
    {
      status: "completed",
      title: "Playlists & Batch Processing",
      description: "Native support for YouTube playlists and multi-line batch queues.",
      date: "Q2 2026",
    },
    {
      status: "completed",
      title: "Queue System & Analytics",
      description: "Persistent background queue manager and local analytics dashboard.",
      date: "Q2 2026",
    },
    {
      status: "in-progress",
      title: "Browser Extension Foundation",
      description: "Decoupling API logic to prepare for Chrome and Firefox extensions.",
      date: "Q3 2026",
    },
    {
      status: "planned",
      title: "Native Desktop App",
      description: "Electron or Tauri wrapper for native filesystem access and faster downloads.",
      date: "Q4 2026",
    },
    {
      status: "planned",
      title: "Multi-platform Support",
      description: "Support for Twitter, TikTok, and Instagram extraction via yt-dlp.",
      date: "Q4 2026",
    },
  ];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 flex-1 space-y-10">
      <div className="space-y-2 border-b border-border/50 pb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Map className="w-8 h-8 text-primary" /> Roadmap
        </h1>
        <p className="text-muted-foreground">What we are building next for the open-source downloader.</p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
        {items.map((item, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
              {item.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {item.status === 'in-progress' && <CircleDashed className="w-5 h-5 text-primary animate-spin-slow" />}
              {item.status === 'planned' && <Clock className="w-5 h-5 opacity-50" />}
            </div>
            
            <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-6 bg-card/40 backdrop-blur-sm border-border/50 shadow-sm transition-all hover:shadow-md hover:bg-muted/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <span className="text-xs font-semibold px-2 py-1 bg-background rounded-md border border-border/50 text-muted-foreground whitespace-nowrap">
                  {item.date}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
