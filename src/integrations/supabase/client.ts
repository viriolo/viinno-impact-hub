// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xnlcfihmomvaeaanppwy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubGNmaWhtb212YWVhYW5wcHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MDU5ODAsImV4cCI6MjA1MTk4MTk4MH0.txtAW8aGCrKpkwgEI8LeuEfS31m-LNUpYicUzW9QzQU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);