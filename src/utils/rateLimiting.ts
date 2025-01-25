import { createClient } from '@supabase/supabase-js';

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

export const checkRateLimit = async (userId: string, action: string): Promise<boolean> => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Get recent activities
  const { data: activities, error } = await supabase
    .from('user_activities')
    .select('created_at')
    .eq('user_id', userId)
    .eq('activity_type', action)
    .gte('created_at', new Date(windowStart).toISOString());

  if (error) {
    console.error('Rate limiting error:', error);
    return false; // Allow the request if we can't check the rate limit
  }

  return (activities?.length || 0) >= MAX_REQUESTS;
};