import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/slug';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'transgas-public';

const RULES = {
  pdf: { types: ['application/pdf'], maxBytes: 10 * 1024 * 1024, label: 'PDF (máx. 10 MB)' },
  image: { types: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 5 * 1024 * 1024, label: 'imagen JPG, PNG o WebP (máx. 5 MB)' },
} as const;

export type UploadKind = keyof typeof RULES;

export class UploadError extends Error {}

/** Sube un archivo al bucket público de Supabase Storage y devuelve su URL pública. */
export async function uploadPublicFile(file: File, folder: string, kind: UploadKind) {
  const rule = RULES[kind];
  if (!(rule.types as readonly string[]).includes(file.type)) throw new UploadError(`El archivo debe ser ${rule.label}.`);
  if (file.size > rule.maxBytes) throw new UploadError(`El archivo supera el tamaño máximo: ${rule.label}.`);

  const supabase = createAdminClient();
  const ext = kind === 'pdf' ? 'pdf' : file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'archivo';
  const path = `${folder}/${Date.now()}-${base}.${ext}`;
  const body = Buffer.from(await file.arrayBuffer());

  let { error } = await supabase.storage.from(BUCKET).upload(path, body, { contentType: file.type, upsert: false });
  if (error && /not found|bucket/i.test(error.message)) {
    // Primera vez: crear el bucket público y reintentar.
    await supabase.storage.createBucket(BUCKET, { public: true });
    ({ error } = await supabase.storage.from(BUCKET).upload(path, body, { contentType: file.type, upsert: false }));
  }
  if (error) throw new UploadError(`No se pudo subir el archivo: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deletePublicFile(path: string | null | undefined) {
  if (!path) return;
  try {
    await createAdminClient().storage.from(BUCKET).remove([path]);
  } catch (e) {
    console.error('[storage] no se pudo borrar', path, e);
  }
}
