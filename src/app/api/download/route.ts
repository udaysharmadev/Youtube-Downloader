import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { createReadStream, unlinkSync, statSync, readdirSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { randomBytes } from "crypto";

const execFileAsync = promisify(execFile);

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

function findTempFile(dir: string, prefix: string): string | null {
  try {
    const files = readdirSync(dir);
    const match = files.find(f => f.startsWith(prefix));
    return match ? join(dir, match) : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get("url");
  const type = searchParams.get("type") || "video";
  const itag = searchParams.get("itag");

  if (!url) {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return new NextResponse("Invalid YouTube URL", { status: 400 });
  }

  const tempId = randomBytes(8).toString("hex");
  const tempDir = tmpdir();
  const tempPrefix = `yt-dl-${tempId}`;
  const tempTemplate = join(tempDir, `${tempPrefix}.%(ext)s`);

  try {
    const args: string[] = [];
    if (type === "audio") {
      if (itag && itag.startsWith("mp3-")) {
        const bitrate = itag.split("-")[1] + "K";
        args.push("-x", "--audio-format", "mp3", "--audio-quality", bitrate, "-o", tempTemplate, "--no-warnings", url);
      } else {
        args.push("-f", itag || "bestaudio", "-x", "--audio-format", "mp3", "--audio-quality", "0", "-o", tempTemplate, "--no-warnings", url); // Fallback bestaudio to MP3 as well, or just native? The user wants "best available audio". Let's stick to native for "bestaudio"
      }
    } else {
      // For video, we want to download the specified video format and merge it with the best audio.
      const formatStr = itag ? `${itag}+bestaudio/best` : "bestvideo+bestaudio/best";
      args.push("-f", formatStr, "--merge-output-format", "mp4", "-o", tempTemplate, "--no-warnings", url);
    }

    // Let's fix the fallback for bestaudio: if it's 'bestaudio', don't extract to mp3 unless specified.
    if (type === "audio" && (!itag || itag === "bestaudio" || !itag.startsWith("mp3-"))) {
      args.length = 0; // reset
      args.push("-f", itag || "bestaudio", "-o", tempTemplate, "--no-warnings", url);
    }

    await execFileAsync("yt-dlp", args, {
      timeout: 5 * 60 * 1000,
      maxBuffer: 10 * 1024 * 1024,
    });

    const tempPath = findTempFile(tempDir, tempPrefix);
    if (!tempPath) {
      return new NextResponse("Download completed but file not found", { status: 500 });
    }

    let fileSize: number;
    try {
      fileSize = statSync(tempPath).size;
    } catch {
      return new NextResponse("Download completed but file not found", { status: 500 });
    }

    const actualExt = tempPath.split(".").pop() || (type === "audio" ? "m4a" : "mp4");
    const contentType = type === "audio"
      ? (actualExt === "webm" ? "audio/webm" : "audio/mp4")
      : "video/mp4";

    const nodeStream = createReadStream(tempPath);

    const stream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        nodeStream.on("end", () => {
          controller.close();
          try { unlinkSync(tempPath); } catch {}
        });
        nodeStream.on("error", (err) => {
          controller.error(err);
          try { unlinkSync(tempPath); } catch {}
        });
      },
      cancel() {
        nodeStream.destroy();
        try { unlinkSync(tempPath); } catch {}
      },
    });

    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="download.${actualExt}"`);
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", fileSize.toString());

    return new NextResponse(stream, { headers });
  } catch (error: any) {
    const tempPath = findTempFile(tempDir, tempPrefix);
    if (tempPath) try { unlinkSync(tempPath); } catch {}

    if (error.code === "ENOENT") {
      return new NextResponse("yt-dlp is not installed on the server", { status: 503 });
    }
    if (error.killed) {
      return new NextResponse("Download timed out", { status: 504 });
    }
    return new NextResponse("Failed to download", { status: 500 });
  }
}
