/**
 * Atualiza mediaUrl/coverUrl no prisma/dev.db para URLs do GitHub Release media-v1
 * e copia o banco para prisma/seed.db (usado na Vercel).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const tag = 'media-v1';
const repo = 'DCT-Ads/nayara-rosa-app';
const baseUrl = `https://github.com/${repo}/releases/download/${tag}`;

const prisma = new PrismaClient({
  datasources: { db: { url: `file:${path.join(root, 'prisma', 'dev.db')}` } },
});

function toReleaseUrl(localUrl: string): string {
  if (!localUrl) return localUrl;
  if (localUrl.startsWith('http://') || localUrl.startsWith('https://')) return localUrl;
  const name = localUrl.split('/').pop();
  if (!name) return localUrl;
  return `${baseUrl}/${name}`;
}

async function main() {
  const items = await prisma.mediaItem.findMany({ orderBy: { sortOrder: 'asc' } });
  for (const item of items) {
    const mediaUrl = toReleaseUrl(item.mediaUrl);
    const coverUrl = toReleaseUrl(item.coverUrl);
    await prisma.mediaItem.update({
      where: { id: item.id },
      data: { mediaUrl, coverUrl },
    });
    console.log(`${item.type.padEnd(7)} ${item.title} → ${mediaUrl ? 'OK' : 'SEM ARQUIVO'}`);
  }

  const ambients = await prisma.ambientTrack.findMany();
  for (const a of ambients) {
    const mediaUrl = toReleaseUrl(a.mediaUrl);
    await prisma.ambientTrack.update({ where: { id: a.id }, data: { mediaUrl } });
    console.log(`ambient ${a.id} → ${mediaUrl ? 'OK' : 'SEM ARQUIVO'}`);
  }

  const devDb = path.join(root, 'prisma', 'dev.db');
  const seedDb = path.join(root, 'prisma', 'seed.db');
  fs.copyFileSync(devDb, seedDb);
  console.log('seed.db sincronizado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
