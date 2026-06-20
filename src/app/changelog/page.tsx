import { GitCommit, Tag } from "lucide-react";

export default function ChangelogPage() {
  const releases = [
    {
      version: "v2.1.0",
      date: "June 20, 2026",
      title: "The Media Platform Update",
      changes: [
        { type: "feat", text: "Added native support for YouTube playlists." },
        { type: "feat", text: "Implemented multi-line batch URL queue system." },
        { type: "feat", text: "Added persistent background download manager." },
        { type: "feat", text: "Created local Analytics and History dashboards." },
        { type: "feat", text: "Added elegant clipboard URL detection." },
        { type: "fix", text: "Resolved metadata parsing issues for unavailable videos." },
      ]
    },
    {
      version: "v2.0.0",
      date: "June 19, 2026",
      title: "Core Architecture Rewrite",
      changes: [
        { type: "feat", text: "Replaced broken youtubei.js with yt-dlp binary." },
        { type: "feat", text: "Added robust format filtering and duplicate removal." },
        { type: "feat", text: "Redesigned entire UI with shadcn/ui and framer-motion." },
        { type: "fix", text: "Fixed Turbopack chunk loading errors." },
        { type: "remove", text: "Removed deprecated ytdl-core dependencies." },
      ]
    },
    {
      version: "v1.0.0",
      date: "August 2024",
      title: "Initial Release",
      changes: [
        { type: "feat", text: "Basic video downloading via ytdl-core." },
        { type: "feat", text: "Initial Next.js application setup." },
      ]
    }
  ];

  const getBadgeColor = (type: string) => {
    switch(type) {
      case 'feat': return "bg-primary/10 text-primary border-primary/20";
      case 'fix': return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'remove': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 flex-1 space-y-10">
      <div className="space-y-2 border-b border-border/50 pb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <GitCommit className="w-8 h-8 text-primary" /> Changelog
        </h1>
        <p className="text-muted-foreground">New updates, improvements, and fixes.</p>
      </div>

      <div className="space-y-12">
        {releases.map((release) => (
          <div key={release.version} className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-4 md:gap-8 items-start">
              <div className="md:col-span-1 md:text-right mb-4 md:mb-0 md:pt-1">
                <div className="flex items-center md:justify-end gap-2 text-sm font-semibold text-muted-foreground">
                  <Tag className="w-4 h-4" /> {release.version}
                </div>
                <div className="text-sm text-muted-foreground/70 mt-1">{release.date}</div>
              </div>
              
              <div className="md:col-span-3 relative pb-8 md:pb-12 md:border-l md:border-border/50 md:pl-8 last:pb-0 last:border-transparent">
                <div className="hidden md:block absolute top-1.5 -left-[5px] w-[9px] h-[9px] rounded-full bg-border" />
                
                <h3 className="text-xl font-bold mb-6">{release.title}</h3>
                
                <ul className="space-y-4">
                  {release.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBadgeColor(change.type)}`}>
                        {change.type}
                      </span>
                      <span className="text-foreground/90 leading-relaxed pt-0.5">{change.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
