import { DownloaderForm } from "@/components/downloader-form";
import { Star, Shield, Zap, Info } from "lucide-react";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden w-full px-4 pt-16 md:pt-32 pb-16">
      {/* Clean, minimalist background */}
      <div className="absolute top-0 -z-10 h-full w-full bg-background"></div>

      <div className="mx-auto w-full max-w-3xl flex flex-col items-center text-center space-y-8 z-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="https://github.com/udaysharmadev/Youtube-Downloader"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground hover:border-border"
            >
              Open Source on GitHub
              <GithubIcon className="ml-2 h-4 w-4" />
            </a>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            YouTube Downloader
          </h1>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground">
            An open-source interface for yt-dlp. Enter a YouTube URL to extract native video formats and merge audio streams.
          </p>
        </div>

        <div className="w-full mt-8">
          <DownloaderForm />
        </div>
      </div>
    </div>
  );
}
