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
  title: "YouTube Video Downloader",
  description: "Fast, reliable, and premium YouTube video and audio downloader.",
  openGraph: {
    title: "YouTube Video Downloader",
    description: "Fast, reliable, and premium YouTube video and audio downloader.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Video Downloader",
    description: "Fast, reliable, and premium YouTube video and audio downloader.",
  }
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
