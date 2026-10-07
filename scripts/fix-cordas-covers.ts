import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dbPath = path.join(root, 'prisma', 'dev.db');

const prisma = new PrismaClient({
  datasources: { db: { url: `file:${dbPath}` } },
});

function normalizeCover(url: string): string {
  if (!url) return url;
  if (url.includes('cordas-de-amor-avance.jpg')) return '/images/cordas-de-amor-avance.jpg';
  if (url.includes('cordas-de-amor-destaque.jpg')) return '/images/cordas-de-amor-destaque.jpg';
  return url;
}

const items = await prisma.mediaItem.findMany();
for (const item of items) {
  const coverUrl = normalizeCover(item.coverUrl);
  if (coverUrl === item.coverUrl) continue;
  await prisma.mediaItem.update({
    where: { id: item.id },
    data: { coverUrl },
  });
  console.log(`fixed cover: ${item.title} -> ${coverUrl}`);
}

fs.copyFileSync(dbPath, path.join(root, 'prisma', 'seed.db'));
console.log('seed.db atualizado');
await prisma.$disconnect();
