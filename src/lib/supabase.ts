import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gtwzadsohgmppcwovhuh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0d3phZHNvaGdtcHBjd292aHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNzQzMTksImV4cCI6MjEwODc1MDMxOX0.EGKdFzuW_otufX1nT5yHpLWAEy4vpbIHOwBylCJm3zI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
