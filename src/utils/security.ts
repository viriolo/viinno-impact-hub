import DOMPurify from 'dompurify';

export const sanitizeFileName = (fileName: string): string => {
  // Remove any path components and non-ASCII characters
  const sanitized = fileName
    .replace(/^.*[\\\/]/, '') // Remove path
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .replace(/[^a-zA-Z0-9.-]/g, '_'); // Replace other unsafe characters with underscore
  
  // Ensure the filename isn't too long
  const maxLength = 255;
  const extension = sanitized.split('.').pop() || '';
  const name = sanitized.slice(0, -(extension.length + 1));
  
  if (name.length + extension.length + 1 > maxLength) {
    return `${name.slice(0, maxLength - extension.length - 1)}.${extension}`;
  }
  
  return sanitized;
};

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private timeWindow: number;

  constructor(maxAttempts: number = 5, timeWindow: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < this.timeWindow);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return true;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return false;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}