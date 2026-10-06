import type { TimelineMark } from '../data/content';
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

export type TimelineInput = {
  year: string;
  title: string;
  caption: string;
  sortOrder?: number;
};

export async function fetchTimeline(): Promise<TimelineMark[]> {
  const res = await fetch('/api/timeline');
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createTimelineMark(
  data: TimelineInput,
  adminEmail: string,
): Promise<TimelineMark> {
  const res = await fetch('/api/timeline', {
    method: 'POST',
    headers: headers(adminEmail),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateTimelineMark(
  id: string,
  data: Partial<TimelineInput>,
  adminEmail: string,
): Promise<TimelineMark> {
  const res = await fetch(`/api/timeline/${id}`, {
    method: 'PUT',
    headers: headers(adminEmail),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function uploadTimelineMedia(
  id: string,
  file: File,
  adminEmail: string,
): Promise<TimelineMark> {
  const form = new FormData();
  form.append('media', file);
  const res = await fetch(`/api/timeline/${id}/media`, {
    method: 'POST',
    headers: headers(adminEmail, false),
    body: form,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function deleteTimelineMark(id: string, adminEmail: string): Promise<void> {
  const res = await fetch(`/api/timeline/${id}`, {
    method: 'DELETE',
    headers: headers(adminEmail),
  });
  if (!res.ok) throw new Error(await parseError(res));
}
