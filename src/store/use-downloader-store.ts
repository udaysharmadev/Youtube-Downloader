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

export interface DownloaderSettings {
  defaultFormat: 'video' | 'audio';
  autoDownload: boolean;
}

interface DownloaderStore {
  history: DownloadHistoryItem[];
  settings: DownloaderSettings;
  addHistoryItem: (item: DownloadHistoryItem) => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
  updateSettings: (settings: Partial<DownloaderSettings>) => void;
}

export const useDownloaderStore = create<DownloaderStore>()(
  persist(
    (set) => ({
      history: [],
      settings: {
        defaultFormat: 'video',
        autoDownload: false,
      },
      addHistoryItem: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 50),
        })),
      removeHistoryItem: (id) =>
        set((state) => ({
          history: state.history.filter((i) => i.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'yt-downloader-storage',
    }
  )
);
