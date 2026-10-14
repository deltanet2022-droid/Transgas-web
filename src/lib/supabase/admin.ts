import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Cliente con service role: saltea RLS. SOLO servidor, para administrar usuarios de Auth
 * y subir archivos a Storage desde el CRM.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
