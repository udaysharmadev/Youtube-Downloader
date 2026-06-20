import { useEffect, useRef } from 'react';
import { useDownloaderStore, QueueItem } from '@/store/use-downloader-store';
import { DownloaderService } from '@/lib/core/downloader';
import { trackEvent } from '@/lib/analytics';
import { toast } from 'sonner';

/**
 * Queue Manager Hook
 * 
 * Mount this hook at the root of the application (e.g. Layout or a global provider).
 * It listens to the global queue and automatically processes `pending` items one by one.
 */
export function useQueueManager() {
  const queue = useDownloaderStore((state) => state.queue);
  const updateQueueItem = useDownloaderStore((state) => state.updateQueueItem);
  const addHistoryItem = useDownloaderStore((state) => state.addHistoryItem);
  
  // Track the currently processing item to prevent concurrent downloads of the same item.
  const isProcessing = useRef(false);

  useEffect(() => {
    const processQueue = async () => {
      if (isProcessing.current) return;

      // Find the next pending item
      const nextItem = queue.find((item) => item.status === 'pending');
      
      if (!nextItem) return; // Nothing to process

      isProcessing.current = true;
      updateQueueItem(nextItem.id, { status: 'downloading', progress: 0 });
      trackEvent('download_initiated', { formatType: nextItem.format, quality: nextItem.qualityLabel, url: nextItem.url });

      try {
        const filename = `${nextItem.title.replace(/[^\w\s-]/gi, "")}.${nextItem.format === 'video' ? 'mp4' : 'mp3'}`; // Simple fallback container inference, can be improved.
        
        await DownloaderService.downloadMedia(
          nextItem.url,
          nextItem.itag,
          nextItem.type,
          filename,
          (progress) => {
            // Check if user paused/cancelled during download
            // Note: Since native browser streams can't be easily aborted here without an AbortController,
            // we update progress but real cancellation requires AbortSignal wiring. 
            // For now, we just update the progress state.
            updateQueueItem(nextItem.id, { progress });
          }
        );

        // Success
        updateQueueItem(nextItem.id, { status: 'completed', progress: 100 });
        toast.success(`Downloaded: ${nextItem.title}`);
        
        trackEvent("download_completed", { 
          formatType: nextItem.format, 
          quality: nextItem.qualityLabel 
        });

        // Add to history
        addHistoryItem({
          id: Date.now().toString(), // Or use item.id
          url: nextItem.url,
          title: nextItem.title,
          thumbnail: nextItem.thumbnail,
          duration: nextItem.duration,
          format: nextItem.format,
          timestamp: Date.now(),
        });

      } catch (error: any) {
        console.error('Queue download failed:', error);
        updateQueueItem(nextItem.id, { status: 'failed', error: error.message || 'Failed to download' });
        toast.error(`Failed to download: ${nextItem.title}`);
        trackEvent("download_failed", { error: error?.message });
      } finally {
        isProcessing.current = false;
        // The effect will re-trigger because queue state changed
      }
    };

    processQueue();
  }, [queue, updateQueueItem, addHistoryItem]);
}
