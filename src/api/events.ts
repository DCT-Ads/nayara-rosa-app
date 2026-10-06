import type { EventItem } from '../data/content';

const ADMIN_EMAIL = 'admin@nayararosa';

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase().trim() === ADMIN_EMAIL;
}

function headers(adminEmail?: string | null): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (adminEmail && isAdminEmail(adminEmail)) {
    h['x-admin-email'] = ADMIN_EMAIL;
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

export type EventInput = {
  title: string;
  type: EventItem['type'];
  date: string;
  time: string;
  location: string;
  description: string;
  alertEnabled: boolean;
};

export async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch('/api/events');
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createEvent(
  data: EventInput,
  adminEmail: string,
): Promise<EventItem> {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: headers(adminEmail),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateEvent(
  id: string,
  data: Partial<EventInput>,
  adminEmail: string,
): Promise<EventItem> {
  const res = await fetch(`/api/events/${id}`, {
    method: 'PUT',
    headers: headers(adminEmail),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function toggleEventAlert(
  id: string,
  alertEnabled: boolean,
  adminEmail: string,
): Promise<EventItem> {
  const res = await fetch(`/api/events/${id}/alert`, {
    method: 'PATCH',
    headers: headers(adminEmail),
    body: JSON.stringify({ alertEnabled }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function deleteEvent(id: string, adminEmail: string): Promise<void> {
  const res = await fetch(`/api/events/${id}`, {
    method: 'DELETE',
    headers: headers(adminEmail),
  });
  if (!res.ok) throw new Error(await parseError(res));
}
