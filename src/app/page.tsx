import { DownloaderForm } from "@/components/downloader-form";
import { Star, Shield, Zap, Info } from "lucide-react";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden w-full px-4 pt-16 md:pt-32 pb-16">
      {/* Background gradients for modern SaaS feel */}
      <div className="absolute top-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/5 opacity-50 blur-[80px]"></div>
      </div>

      <div className="mx-auto w-full max-w-3xl flex flex-col items-center text-center space-y-8 z-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="https://github.com/udaysharmadev/Youtube-Downloader"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:bg-muted/80 hover:text-foreground hover:border-border"
            >
              <div className="flex items-center text-yellow-500 mr-2">
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
              </div>
              Open Source
              <GithubIcon className="ml-2 h-4 w-4" />
            </a>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
            Download media <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">without the hassle.</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground">
            Paste any YouTube URL below to instantly retrieve video and audio formats in the highest available quality.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="flex items-center text-xs font-medium text-muted-foreground">
              <Shield className="mr-1.5 h-3.5 w-3.5 text-green-500" />
              100% Secure
            </div>
            <div className="flex items-center text-xs font-medium text-muted-foreground">
              <Zap className="mr-1.5 h-3.5 w-3.5 text-yellow-500" />
              Lightning Fast
            </div>
            <div className="flex items-center text-xs font-medium text-muted-foreground">
              <Info className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
              No Ads or Tracking
            </div>
          </div>
        </div>

        <div className="w-full mt-8">
          <DownloaderForm />
        </div>
      </div>
    </div>
  );
}
