import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DownloadHistoryItem {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
  format: 'audio' | 'video';
  timestamp: number;
}

export type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';

export interface QueueItem {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
  format: 'audio' | 'video';
  qualityLabel: string;
  itag: string;
  type: string;
  status: DownloadStatus;
  progress: number;
  error?: string;
  addedAt: number;
}

export interface DownloaderSettings {
  defaultFormat: 'video' | 'audio';
  autoDownload: boolean;
}

interface DownloaderStore {
  history: DownloadHistoryItem[];
  queue: QueueItem[];
  settings: DownloaderSettings;
  addHistoryItem: (item: DownloadHistoryItem) => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
  addToQueue: (item: QueueItem) => void;
  updateQueueItem: (id: string, updates: Partial<QueueItem>) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  updateSettings: (settings: Partial<DownloaderSettings>) => void;
}

export const useDownloaderStore = create<DownloaderStore>()(
  persist(
    (set) => ({
      history: [],
      queue: [],
      settings: {
        defaultFormat: 'video',
        autoDownload: false,
      },
      addHistoryItem: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 200), // Increased history limit for analytics
        })),
      removeHistoryItem: (id) =>
        set((state) => ({
          history: state.history.filter((i) => i.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
      addToQueue: (item) =>
        set((state) => ({
          queue: [...state.queue, item],
        })),
      updateQueueItem: (id, updates) =>
        set((state) => ({
          queue: state.queue.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      removeFromQueue: (id) =>
        set((state) => ({
          queue: state.queue.filter((i) => i.id !== id),
        })),
      clearQueue: () => set({ queue: [] }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'yt-downloader-storage',
      // On rehydration, reset 'downloading' items to 'pending'
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.queue = state.queue.map(item => 
            item.status === 'downloading' ? { ...item, status: 'pending', progress: 0 } : item
          );
        }
      },
    }
  )
);
