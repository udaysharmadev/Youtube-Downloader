import { DownloaderForm } from "@/components/downloader-form";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden w-full px-4 pt-16 md:pt-32 pb-16">
      {/* Background gradients for modern SaaS feel */}
      <div className="absolute top-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/5 opacity-50 blur-[80px]"></div>
      </div>

      <div className="mx-auto w-full max-w-3xl flex flex-col items-center text-center space-y-8 z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Fast, secure, and limitless downloads
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
            Download media <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">without the hassle.</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground">
            Paste any YouTube URL below to instantly retrieve video and audio formats in the highest available quality.
          </p>
        </div>

        <div className="w-full mt-8">
          <DownloaderForm />
        </div>
      </div>
    </div>
  );
}
