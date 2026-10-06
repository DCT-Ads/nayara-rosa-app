import { isAdminEmail } from './events';

export type AmbientId = 'prayer' | 'devotion';

export type AmbientTrack = {
  id: AmbientId;
  title: string;
  artist: string;
  mediaUrl: string;
  label: string;
};

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

export async function fetchAmbient(): Promise<AmbientTrack[]> {
  const res = await fetch('/api/ambient');
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateAmbient(
  id: AmbientId,
  data: { title?: string; artist?: string },
  adminEmail: string,
): Promise<AmbientTrack> {
  const res = await fetch(`/api/ambient/${id}`, {
    method: 'PUT',
    headers: headers(adminEmail),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function uploadAmbientFile(
  id: AmbientId,
  file: File,
  adminEmail: string,
): Promise<AmbientTrack> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`/api/ambient/${id}/file`, {
    method: 'POST',
    headers: headers(adminEmail, false),
    body: form,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
