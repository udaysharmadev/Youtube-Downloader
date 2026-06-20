import { Shield, Lock, EyeOff, Server } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 flex-1 space-y-12">
      <div className="space-y-4 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">
          Your data stays yours. We designed our system with privacy as the core foundation.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/50 bg-card/40 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>100% Local Storage</CardTitle>
              <CardDescription>We don't want your data</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            Any download history, preferences, or settings you configure on YouTube Video Downloader are stored entirely locally on your device using browser-native APIs (like LocalStorage). We do not have user accounts, databases, or cloud syncing.
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/40 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Zero Telemetry</CardTitle>
              <CardDescription>No tracking, no analytics</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            We do not use third-party analytics, tracking cookies, or advertising networks. Our application is designed to be a safe, minimal environment.
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/40 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Transient Processing</CardTitle>
              <CardDescription>URLs are processed securely</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            When you enter a URL to download, the request is sent securely to our server which acts purely as a transient bridge. The media is streamed directly to you without being saved permanently on our servers. Once the download completes, the temporary stream is destroyed.
          </CardContent>
        </Card>
      </div>

      <div className="pt-8 border-t border-border/40 text-center">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
