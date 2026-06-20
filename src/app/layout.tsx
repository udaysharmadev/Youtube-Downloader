import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "YouTube Downloader - Fast & Free Media Extraction",
    template: "%s | YouTube Downloader",
  },
  description: "Download YouTube videos in 4K, 8K, and high-quality MP3 formats instantly. Fast, secure, zero ads, and 100% open source.",
  keywords: ["youtube downloader", "video downloader", "mp3 converter", "4k downloader", "open source", "yt-dlp"],
  authors: [{ name: "Uday Sharma", url: "https://github.com/udaysharmadev" }],
  creator: "Uday Sharma",
  metadataBase: new URL("https://youtube-downloader.udaysharma.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://youtube-downloader.udaysharma.dev",
    title: "YouTube Downloader - Fast & Free Media Extraction",
    description: "Download YouTube videos in 4K, 8K, and high-quality MP3 formats instantly. Fast, secure, zero ads, and 100% open source.",
    siteName: "YouTube Downloader",
    images: [
      {
        url: "https://raw.githubusercontent.com/udaysharmadev/Youtube-Downloader/main/public/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Downloader Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Downloader - Fast & Free Media Extraction",
    description: "Download YouTube videos in 4K, 8K, and high-quality MP3 formats instantly.",
    creator: "@udaysharmatech",
    images: ["https://raw.githubusercontent.com/udaysharmadev/Youtube-Downloader/main/public/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <Toaster position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
