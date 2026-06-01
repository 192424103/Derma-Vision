import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeGetDate(timestamp: any): Date | null {
  if (!timestamp) return null;
  
  // 1. If it's already a Date
  if (timestamp instanceof Date) {
    return isNaN(timestamp.getTime()) ? null : timestamp;
  }
  
  // 2. If it has a toDate method (Firestore Timestamp)
  if (typeof timestamp.toDate === 'function') {
    try {
      return timestamp.toDate();
    } catch (_) {
      // Fallback
    }
  }
  
  // 3. If it is a serialized Firestore Timestamp with seconds/nanoseconds
  if (typeof timestamp === 'object' && typeof timestamp.seconds === 'number') {
    const d = new Date(timestamp.seconds * 1000);
    return isNaN(d.getTime()) ? null : d;
  }
  
  // 4. If it is a string or number
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const d = new Date(timestamp);
    return isNaN(d.getTime()) ? null : d;
  }
  
  return null;
}

export function formatDateSafe(timestamp: any, option: 'date' | 'time' | 'datetime' = 'date'): string {
  const d = safeGetDate(timestamp);
  if (!d) return 'Processing...';
  
  try {
    if (option === 'time') return d.toLocaleTimeString();
    if (option === 'datetime') return d.toLocaleString();
    return d.toLocaleDateString();
  } catch (e) {
    return 'Processing...';
  }
}
