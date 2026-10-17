import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzmceuctjmfpdetxlvlo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    'sb_publishable_pFIeMep6_OaZs01hWkZuog_sYiWeOfL';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Pomocná funkcia na bezpečný dopyt s fallbackom na lokálne dáta
export async function fetchFromSupabaseOrFallback<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  fallbackData: T
): Promise<T> {
  try {
    const { data, error } = await queryFn();
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      return fallbackData;
    }
    return data;
  } catch {
    return fallbackData;
  }
}
