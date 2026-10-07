import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const p = new PrismaClient({
  datasources: { db: { url: `file:${path.resolve('prisma/dev.db')}` } },
});

const m = await p.mediaItem.findMany({ orderBy: { sortOrder: 'asc' } });
for (const x of m) {
  console.log(`${x.type} | ${x.title} | ${x.mediaUrl}`);
}
const a = await p.ambientTrack.findMany();
for (const x of a) {
  console.log(`ambient | ${x.id} | ${x.mediaUrl}`);
}
await p.$disconnect();
