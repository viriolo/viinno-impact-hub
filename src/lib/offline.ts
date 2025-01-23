import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Queue for storing offline actions
const offlineQueue: Array<{
  table: string;
  action: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
}> = [];

// Check network status
export const isOnline = () => navigator.onLine;

// Listen for network changes
export const initializeOfflineSupport = () => {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
};

// Handle going offline
const handleOffline = () => {
  toast.error("You are offline. Changes will be synchronized when connection is restored.");
};

// Handle coming back online
const handleOnline = async () => {
  toast.info("Back online. Synchronizing data...");
  await syncOfflineData();
  toast.success("Data synchronized successfully!");
};

// Add action to offline queue
export const queueOfflineAction = (
  table: string,
  action: 'insert' | 'update' | 'delete',
  data: any
) => {
  offlineQueue.push({
    table,
    action,
    data,
    timestamp: Date.now(),
  });
  localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
};

// Sync offline data when back online
const syncOfflineData = async () => {
  const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
  
  for (const item of queue) {
    try {
      switch (item.action) {
        case 'insert':
          await supabase.from(item.table).insert(item.data);
          break;
        case 'update':
          await supabase.from(item.table).update(item.data).eq('id', item.data.id);
          break;
        case 'delete':
          await supabase.from(item.table).delete().eq('id', item.data.id);
          break;
      }
    } catch (error) {
      console.error(`Failed to sync ${item.action} operation:`, error);
    }
  }
  
  localStorage.removeItem('offlineQueue');
};