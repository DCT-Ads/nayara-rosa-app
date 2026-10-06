import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dbPath = path.join(root, 'prisma', 'seed.db').replace(/\\/g, '/');

const prisma = new PrismaClient({
  datasources: { db: { url: `file:${dbPath}` } },
});

const items = await prisma.mediaItem.findMany();
for (const item of items) {
  if (item.mediaUrl && /\.(mp4|mp3|webm|mov)$/i.test(item.mediaUrl)) {
    await prisma.mediaItem.update({
      where: { id: item.id },
      data: { mediaUrl: '' },
    });
    console.log('cleared', item.title);
  }
}
await prisma.$disconnect();
