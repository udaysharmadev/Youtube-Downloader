import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const url = body?.url;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL." }, { status: 400 });
    }

    let stdout: string;
    try {
      const result = await execFileAsync("yt-dlp", ["--dump-single-json", "--no-warnings", url], {
        maxBuffer: 10 * 1024 * 1024,
        timeout: 30000,
      });
      stdout = result.stdout;
    } catch (err: any) {
      if (err.code === "ENOENT") {
        return NextResponse.json({ error: "yt-dlp is not installed on the server." }, { status: 503 });
      }
      if (err.killed || err.code === "ETIMEDOUT") {
        return NextResponse.json({ error: "Request timed out while analyzing the video." }, { status: 504 });
      }
      return NextResponse.json({ error: "Failed to extract video information." }, { status: 500 });
    }

    const info = JSON.parse(stdout);

    const title = info.title || "Unknown Title";
    const thumbnail = info.thumbnail || "";
    const duration = info.duration || 0;
    const author = info.uploader || "Unknown";
    const viewCount = info.view_count || 0;

    const allFormats = info.formats || [];

    // Filter to real video formats (must have video codec).
    // Exclude storyboard (mhtml) and m3u8 streams
    const rawVideoFormats = allFormats
      .filter((f: any) =>
        f.vcodec !== "none" &&
        f.vcodec &&
        f.ext !== "mhtml" &&
        f.protocol !== "m3u8_native" &&
        f.protocol !== "m3u8"
      )
      .map((f: any) => ({
        itag: f.format_id,
        qualityLabel: f.format_note || f.resolution || "Unknown",
        resolution: f.resolution || "Unknown",
        fps: Math.round(f.fps) || 30,
        vcodec: f.vcodec,
        acodec: f.acodec,
        container: f.ext,
        type: "video" as const,
        filesize: f.filesize || f.filesize_approx || null,
        height: f.height || 0,
      }));

    // Remove duplicates based on height, fps, and container so we don't show identical visual streams
    const videoMap = new Map<string, any>();
    for (const f of rawVideoFormats) {
      // Create a unique key for the quality card
      const key = `${f.height}-${f.fps}-${f.container}`;
      // Keep the one with the highest filesize if there are duplicates (usually higher bitrate)
      if (!videoMap.has(key) || (f.filesize > (videoMap.get(key).filesize || 0))) {
        videoMap.set(key, f);
      }
    }

    const uniqueVideoFormats = Array.from(videoMap.values());

    // Sort descending by height, then by fps
    uniqueVideoFormats.sort((a: any, b: any) => {
      if (b.height !== a.height) return b.height - a.height;
      return b.fps - a.fps;
    });

    // Identify recommended (Highest available quality)
    const finalVideoFormats = uniqueVideoFormats.map((f: any, index: number) => ({
      ...f,
      qualityLabel: f.height ? `${f.height}p` : f.qualityLabel,
      isRecommended: index === 0, // Highest quality gets the badge
    }));

    // Audio Formats
    // Find the best native audio filesize to approximate MP3 size
    const bestNativeAudio = allFormats
      .filter((f: any) => f.vcodec === "none" && f.acodec !== "none")
      .sort((a: any, b: any) => (b.abr || 0) - (a.abr || 0))[0];

    const baseAudioSize = bestNativeAudio?.filesize || bestNativeAudio?.filesize_approx || null;

    const audioFormats = [
      {
        itag: "bestaudio",
        qualityLabel: "Best Available Audio",
        resolution: "Audio Only",
        fps: null,
        vcodec: "none",
        acodec: bestNativeAudio?.acodec || "Unknown",
        container: bestNativeAudio?.ext || "m4a",
        type: "audio" as const,
        filesize: baseAudioSize,
        isRecommended: false,
      },
      {
        itag: "mp3-320",
        qualityLabel: "MP3 320 kbps",
        resolution: "Audio Only",
        fps: null,
        vcodec: "none",
        acodec: "mp3",
        container: "mp3",
        type: "audio" as const,
        filesize: duration ? (320 * 1000 * duration) / 8 : null,
        isRecommended: false,
      },
      {
        itag: "mp3-192",
        qualityLabel: "MP3 192 kbps",
        resolution: "Audio Only",
        fps: null,
        vcodec: "none",
        acodec: "mp3",
        container: "mp3",
        type: "audio" as const,
        filesize: duration ? (192 * 1000 * duration) / 8 : null,
        isRecommended: false,
      },
      {
        itag: "mp3-128",
        qualityLabel: "MP3 128 kbps",
        resolution: "Audio Only",
        fps: null,
        vcodec: "none",
        acodec: "mp3",
        container: "mp3",
        type: "audio" as const,
        filesize: duration ? (128 * 1000 * duration) / 8 : null,
        isRecommended: false,
      }
    ];

    const formats = [...finalVideoFormats, ...audioFormats];

    return NextResponse.json({
      title,
      thumbnail,
      duration,
      author,
      viewCount,
      formats,
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
