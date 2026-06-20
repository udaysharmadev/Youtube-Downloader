"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Trash2, Settings2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useDownloaderStore } from "@/store/use-downloader-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, clearHistory } = useDownloaderStore();

  const handleClearHistory = () => {
    clearHistory();
    toast.success("Download history cleared successfully.");
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 flex-1 space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Settings2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        </div>
        <p className="text-muted-foreground ml-14">Manage your application preferences and data.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-border/50 bg-card/40 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/20 border-b border-border/40 pb-4">
            <CardTitle className="text-lg">Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-3">
              <button
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                  theme === "light" 
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20" 
                    : "border-border/50 bg-card/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                onClick={() => setTheme("light")}
              >
                <Sun className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                  theme === "dark" 
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20" 
                    : "border-border/50 bg-card/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                onClick={() => setTheme("dark")}
              >
                <Moon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                  theme === "system" 
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20" 
                    : "border-border/50 bg-card/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                onClick={() => setTheme("system")}
              >
                <Monitor className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/40 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/20 border-b border-border/40 pb-4">
            <CardTitle className="text-lg">Preferences</CardTitle>
            <CardDescription>
              Manage your default download settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Default Format</p>
                <p className="text-sm text-muted-foreground">Select the format you prefer when downloading.</p>
              </div>
              <div className="flex gap-2 shrink-0 bg-muted/30 p-1 rounded-xl border border-border/50">
                <button
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    settings.defaultFormat === "video" 
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => updateSettings({ defaultFormat: "video" })}
                >
                  Video
                </button>
                <button
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    settings.defaultFormat === "audio" 
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => updateSettings({ defaultFormat: "audio" })}
                >
                  Audio
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="bg-destructive/10 border-b border-destructive/10 pb-4">
            <div className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="w-5 h-5" />
              <CardTitle className="text-lg">Data Management</CardTitle>
            </div>
            <CardDescription className="text-destructive/80">
              Manage the data stored locally on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Clear Local History</p>
                <p className="text-sm text-muted-foreground">Permanently delete all local download records.</p>
              </div>
              <Button variant="destructive" className="shrink-0" onClick={handleClearHistory}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Everything
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
