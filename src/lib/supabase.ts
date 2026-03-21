import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  global: {
    // Next.js의 fetch 캐시를 비활성화하여 항상 최신 데이터를 가져옴
    fetch: (url, options = {}) =>
      fetch(url as RequestInfo, { ...options, cache: 'no-store' })
  }
});
