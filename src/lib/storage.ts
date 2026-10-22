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

/** Los primeros bytes de cada formato. El tipo que informa el navegador se puede falsificar; el contenido real no. */
function hasValidSignature(buf: Buffer, mime: string): boolean {
  const starts = (...bytes: number[]) => bytes.every((b, i) => buf[i] === b);
  switch (mime) {
    case 'application/pdf':
      return starts(0x25, 0x50, 0x44, 0x46, 0x2d); // %PDF-
    case 'image/jpeg':
      return starts(0xff, 0xd8, 0xff);
    case 'image/png':
      return starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    case 'image/webp':
      return buf.length > 12 && buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP';
    default:
      return false;
  }
}

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
  if (!hasValidSignature(body, file.type)) throw new UploadError(`El contenido del archivo no es válido: debe ser ${rule.label}. Probá exportarlo de nuevo.`);

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
