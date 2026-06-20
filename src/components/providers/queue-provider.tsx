"use client";

import { useQueueManager } from "@/lib/hooks/use-queue-manager";

export function QueueProvider({ children }: { children: React.ReactNode }) {
  // Initialize the queue manager globally
  useQueueManager();

  return <>{children}</>;
}
