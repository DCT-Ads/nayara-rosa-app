import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const p = new PrismaClient({
  datasources: { db: { url: `file:${path.resolve('prisma/seed.db')}` } },
});
const m = await p.mediaItem.findMany({
  where: { title: { contains: 'Cordas' } },
});
for (const x of m) console.log(`${x.title} => ${x.coverUrl}`);
await p.$disconnect();
