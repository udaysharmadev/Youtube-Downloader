/**
 * Core Downloader Service
 * 
 * This abstracts all interaction with the backend and browser APIs.
 * It is framework-agnostic so it can be easily shared with a browser extension.
 */

export interface MediaFormat {
  itag: string;
  qualityLabel: string;
  resolution: string;
  fps: number | null;
  vcodec: string;
  acodec: string;
  container: string;
  type: string;
  filesize: number | null;
  isRecommended?: boolean;
}

export interface MediaInfo {
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
  viewCount: number;
  formats: MediaFormat[];
  // Discriminator for future playlist support
  type?: 'single' | 'playlist';
  videos?: MediaInfo[]; // If playlist
}

export class DownloaderService {
  /**
   * Fetches metadata for a given YouTube URL.
   */
  static async getInfo(url: string): Promise<MediaInfo> {
    const res = await fetch('/api/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to fetch info' }));
      throw new Error(err.error || 'Failed to fetch media info');
    }

    return await res.json();
  }

  /**
   * Downloads media using the browser's native API.
   * Streams the file from the backend and triggers a save dialog.
   * 
   * @param onProgress - Optional callback for download progress (0-100)
   */
  static async downloadMedia(
    url: string,
    itag: string,
    type: string,
    filename: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const response = await fetch(`/api/download?url=${encodeURIComponent(url)}&itag=${encodeURIComponent(itag)}&type=${type}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Download failed");
      throw new Error(errorText);
    }

    const reader = response.body?.getReader();
    const contentLength = +(response.headers.get("Content-Length") || 0);

    if (!reader) throw new Error("Stream not available");

    let receivedLength = 0;
    const chunks: BlobPart[] = [];

    for (;;) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      receivedLength += value.byteLength;

      if (onProgress) {
        if (contentLength) {
          onProgress((receivedLength / contentLength) * 100);
        } else {
          // Fallback approximate progress if size is unknown
          onProgress(Math.min(95, (receivedLength / (1024 * 1024 * 50)) * 100));
        }
      }
    }

    const blob = new Blob(chunks);
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);

    if (onProgress) onProgress(100);
  }
}
