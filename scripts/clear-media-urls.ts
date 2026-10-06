import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: 'file:./prisma/seed.db' } },
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
