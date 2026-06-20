import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

function isValidYoutubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const url = body?.url;

    if (!url || !isValidYoutubeUrl(url)) {
      return NextResponse.json({ error: "A valid YouTube URL is required." }, { status: 400 });
    }

    let stdout: string;
    try {
      // --flat-playlist ensures we don't deeply parse every video in a playlist.
      // For single videos, it behaves normally.
      const result = await execFileAsync("yt-dlp", ["--dump-single-json", "--flat-playlist", "--no-warnings", url], {
        maxBuffer: 20 * 1024 * 1024,
        timeout: 30000,
      });
      stdout = result.stdout;
    } catch (err: any) {
      if (err.code === "ENOENT") {
        return NextResponse.json({ error: "yt-dlp is not installed on the server." }, { status: 503 });
      }
      if (err.killed || err.code === "ETIMEDOUT") {
        return NextResponse.json({ error: "Request timed out while analyzing the URL." }, { status: 504 });
      }
      return NextResponse.json({ error: "Failed to extract information." }, { status: 500 });
    }

    const info = JSON.parse(stdout);

    if (info._type === "playlist") {
      // Playlist handling
      return NextResponse.json({
        type: "playlist",
        title: info.title || "Unknown Playlist",
        author: info.uploader || "Unknown",
        entries: (info.entries || []).map((e: any) => ({
          id: e.id,
          url: e.url || `https://www.youtube.com/watch?v=${e.id}`,
          title: e.title || "Unknown",
          duration: e.duration || 0,
          thumbnail: e.thumbnails?.[0]?.url || "",
          uploader: e.uploader || info.uploader,
        })),
      });
    }

    // Single video handling
    const title = info.title || "Unknown Title";
    const thumbnail = info.thumbnail || "";
    const duration = info.duration || 0;
    const author = info.uploader || "Unknown";
    const viewCount = info.view_count || 0;

    const allFormats = info.formats || [];

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

    const videoMap = new Map<string, any>();
    for (const f of rawVideoFormats) {
      const key = `${f.height}-${f.fps}-${f.container}`;
      if (!videoMap.has(key) || (f.filesize > (videoMap.get(key).filesize || 0))) {
        videoMap.set(key, f);
      }
    }

    const uniqueVideoFormats = Array.from(videoMap.values());

    uniqueVideoFormats.sort((a: any, b: any) => {
      if (b.height !== a.height) return b.height - a.height;
      return b.fps - a.fps;
    });

    const finalVideoFormats = uniqueVideoFormats.map((f: any, index: number) => ({
      ...f,
      qualityLabel: f.height ? `${f.height}p` : f.qualityLabel,
      isRecommended: index === 0,
    }));

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
      type: "single",
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
