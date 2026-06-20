"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Info, Home, DownloadCloud, Star, History, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { GithubIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/history", label: "History", icon: History },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/about", label: "About", icon: Info },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/github/stars")
      .then((res) => res.json())
      .then((data) => {
        if (data.stars !== null) {
          setStars(data.stars);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
            <DownloadCloud className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            YouTube Downloader
          </span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-4">
          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "hidden md:flex gap-2 rounded-md h-8 px-3 items-center text-sm font-medium transition-colors",
                    isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block w-px h-4 bg-border/60 mx-1"></div>

          <a 
            href="https://github.com/udaysharmadev/Youtube-Downloader" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 h-8 px-3 rounded-full border border-border/50 bg-muted/30 hover:bg-muted/80 hover:border-border transition-all text-sm font-medium"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Star on GitHub</span>
            {stars !== null && (
              <span className="flex items-center gap-1 text-muted-foreground ml-1">
                <Star className="w-3 h-3 fill-muted-foreground" />
                {stars}
              </span>
            )}
          </a>

          <div className="flex md:hidden gap-1 ml-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                    isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
