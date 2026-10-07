import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const p = new PrismaClient({
  datasources: { db: { url: `file:${path.resolve('prisma/seed.db')}` } },
});

const m = await p.mediaItem.findMany({ orderBy: { sortOrder: 'asc' } });
console.log('seed.db media:', m.length);
for (const x of m) {
  const ok = x.mediaUrl.startsWith('https://github.com/');
  console.log(`${ok ? 'OK' : 'NO'} | ${x.type} | ${x.title}`);
  if (!ok) console.log('   ', x.mediaUrl);
}
await p.$disconnect();
