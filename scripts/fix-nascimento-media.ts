import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const baby = '/uploads/trajetoria/1791239567599-2crym7.jpg';

async function main() {
  // Conforme pedido: foto no marco Nascimento e Milagre
  await prisma.timelineMark.update({
    where: { id: 'cmuvtki7k0000v560uj2ig4dw' },
    data: { mediaUrl: baby, mediaType: 'image' },
  });
  console.log('Foto do bebê no Nascimento e Milagre — enquadramento centralizado no rostinho');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
