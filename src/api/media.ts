import type { Track } from '../data/content';
import { isAdminEmail } from './events';

function headers(adminEmail?: string | null, json = true): HeadersInit {
  const h: Record<string, string> = {};
  if (json) h['Content-Type'] = 'application/json';
  if (adminEmail && isAdminEmail(adminEmail)) {
    h['x-admin-email'] = 'admin@nayararosa';
  }
  return h;
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error || res.statusText;
  } catch {
    return res.statusText || 'Erro na requisição';
  }
}

export type MediaInput = {
  title: string;
  artist: string;
  type: Track['type'];
  duration: string;
  lyrics?: string;
  plays?: string;
};

export async function fetchMedia(): Promise<Track[]> {
  const res = await fetch('/api/media');
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createMedia(
  data: MediaInput,
  adminEmail: string,
): Promise<Track> {
  const res = await fetch('/api/media', {
    method: 'POST',
    headers: headers(adminEmail),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateMedia(
  id: string,
  data: Partial<MediaInput>,
  adminEmail: string,
): Promise<Track> {
  const res = await fetch(`/api/media/${id}`, {
    method: 'PUT',
    headers: headers(adminEmail),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function uploadMediaFile(
  id: string,
  file: File,
  adminEmail: string,
): Promise<Track> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`/api/media/${id}/file`, {
    method: 'POST',
    headers: headers(adminEmail, false),
    body: form,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function uploadMediaCover(
  id: string,
  file: File,
  adminEmail: string,
): Promise<Track> {
  const form = new FormData();
  form.append('cover', file);
  const res = await fetch(`/api/media/${id}/cover`, {
    method: 'POST',
    headers: headers(adminEmail, false),
    body: form,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function deleteMedia(id: string, adminEmail: string): Promise<void> {
  const res = await fetch(`/api/media/${id}`, {
    method: 'DELETE',
    headers: headers(adminEmail),
  });
  if (!res.ok) throw new Error(await parseError(res));
}
