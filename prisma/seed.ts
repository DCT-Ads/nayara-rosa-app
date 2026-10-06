import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedEvents = [
  {
    title: 'Show — Cordas de Amor Tour',
    date: '2026-10-18',
    time: '20:00',
    location: 'Cascavel — PR',
    description:
      'Noite especial com o lançamento ao vivo de Cordas de Amor. Venha adorar conosco.',
    type: 'show',
    alertEnabled: true,
  },
  {
    title: 'Live no Instagram',
    date: '2026-10-12',
    time: '19:30',
    location: '@nayararosaof',
    description: 'Bastidores, testemunhos e prévia do novo single.',
    type: 'live',
    alertEnabled: false,
  },
  {
    title: 'Lançamento Digital',
    date: '2026-10-25',
    time: '00:00',
    location: 'Todas as plataformas',
    description: 'Cordas de Amor disponível em streaming mundial.',
    type: 'lancamento',
    alertEnabled: false,
  },
  {
    title: 'Culto de Adoração',
    date: '2026-11-02',
    time: '19:00',
    location: 'Igreja Assembléia — Foz do Iguaçu',
    description: 'Ministração e noite de oração com a cantora.',
    type: 'show',
    alertEnabled: false,
  },
];

const seedTimeline = [
  {
    year: '2001',
    title: 'Nascimento e Milagre',
    caption:
      'Nayara Rosa nasce em 26 de junho de 2001, em um lar cristão. Aos 3 aninhos de idade, logo após receber a cura (um milagre em sua vida), ela começa a cantar na igreja pastoreada por seu pai, na cidade de Paranaguá.',
    placeholder:
      'linear-gradient(180deg, #1A1510 0%, #4A3820 40%, #C9A06A33 70%, #0E0C0A 100%)',
    sortOrder: 10,
  },
  {
    year: '2010',
    title: 'Vitória no Eleva Paraná',
    caption:
      'Nayara Rosa vence o Eleva Paraná, um marco importante que impulsiona sua trajetória na música.',
    placeholder: 'linear-gradient(145deg, #1A0A18 0%, #5C1840 50%, #2A0A20 100%)',
    sortOrder: 20,
  },
  {
    year: '2018',
    title: 'Primeiros passos',
    caption: 'A voz que nasceu no altar — início da jornada ministerial.',
    placeholder: 'linear-gradient(200deg, #2A1810 0%, #8B4020 50%, #1A1008 100%)',
    sortOrder: 30,
  },
  {
    year: '2020',
    title: 'Um novo capítulo: o casamento',
    caption:
      'Nayara Rosa se casa, iniciando um novo e especial capítulo em sua vida pessoal e espiritual.',
    placeholder:
      'linear-gradient(160deg, #12100C 0%, #6B5030 50%, #D4A57444 80%, #0A0908 100%)',
    sortOrder: 40,
  },
  {
    year: '2021',
    title: 'ADOS / Incendeia',
    caption: 'Noites que incendiaram corações e abriram portas.',
    placeholder: 'linear-gradient(145deg, #1A0A18 0%, #5C1840 50%, #2A0A20 100%)',
    sortOrder: 50,
  },
  {
    year: '2023',
    title: 'Chegada de Ellóa',
    caption:
      'Nasce Ellóa, a filhinha de Nayara Rosa, trazendo ainda mais amor e propósito à sua jornada de fé e música.',
    placeholder:
      'linear-gradient(180deg, #1A1510 0%, #4A3820 40%, #C9A06A33 70%, #0E0C0A 100%)',
    sortOrder: 60,
  },
  {
    year: '2023',
    title: 'Jesus — luz azul',
    caption: 'Intensidade no palco, presença no espírito.',
    placeholder: 'linear-gradient(180deg, #0A1020 0%, #1A3A6B 40%, #0C1828 100%)',
    sortOrder: 70,
  },
  {
    year: '2026',
    title: 'Cordas de Amor',
    caption: 'Um novo capítulo: música, fé e propósito unidos.',
    placeholder: "url('/images/cordas-de-amor-destaque.jpg')",
    sortOrder: 80,
  },
];

const seedMedia = [
  {
    title: 'Cordas de Amor',
    artist: 'Nayara Rosa',
    type: 'musica',
    duration: '3:42',
    plays: '12.4k',
    placeholder: "url('/images/cordas-de-amor-avance.jpg')",
    coverUrl: '/images/cordas-de-amor-avance.jpg',
    sortOrder: 10,
    lyrics: 'Nas cordas de amor que o céu entoou…\nCada nota um altar, cada verso um sim.',
  },
  {
    title: 'Cordas de Amor (Clipe Oficial)',
    artist: 'Nayara Rosa',
    type: 'video',
    duration: '4:08',
    plays: '8.1k',
    placeholder: "url('/images/cordas-de-amor-destaque.jpg')",
    coverUrl: '/images/cordas-de-amor-destaque.jpg',
    sortOrder: 20,
  },
  {
    title: 'Incendeia',
    artist: 'Nayara Rosa',
    type: 'musica',
    duration: '5:15',
    plays: '9.7k',
    placeholder: 'linear-gradient(200deg, #1E1010 0%, #7A2E18 55%, #120C0A 100%)',
    sortOrder: 30,
  },
  {
    title: 'Jesus (Ao Vivo)',
    artist: 'Nayara Rosa',
    type: 'video',
    duration: '6:22',
    plays: '15.2k',
    placeholder: 'linear-gradient(180deg, #0A1020 0%, #1A3A6B 40%, #0C1828 100%)',
    sortOrder: 40,
  },
  {
    title: 'Ministração — Altar',
    artist: 'Nayara Rosa',
    type: 'musica',
    duration: '7:01',
    plays: '6.3k',
    placeholder:
      'linear-gradient(160deg, #12100C 0%, #6B5030 50%, #D4A57444 80%, #0A0908 100%)',
    sortOrder: 50,
  },
  {
    title: 'ADOS Sessions',
    artist: 'Nayara Rosa',
    type: 'album',
    duration: '32:10',
    plays: '4.9k',
    placeholder: 'linear-gradient(145deg, #1A0A18 0%, #5C1840 50%, #2A0A20 100%)',
    sortOrder: 60,
  },
];

async function main() {
  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.createMany({ data: seedEvents });
    console.log(`Seed eventos: ${seedEvents.length} criados.`);
  } else {
    console.log(`Seed eventos ignorado: já existem ${eventCount}.`);
  }

  const markCount = await prisma.timelineMark.count();
  if (markCount === 0) {
    await prisma.timelineMark.createMany({ data: seedTimeline });
    console.log(`Seed trajetória: ${seedTimeline.length} marcos criados.`);
  } else {
    console.log(`Seed trajetória ignorado: já existem ${markCount} marcos.`);
  }

  const mediaCount = await prisma.mediaItem.count();
  if (mediaCount === 0) {
    await prisma.mediaItem.createMany({ data: seedMedia });
    console.log(`Seed mídia: ${seedMedia.length} itens criados.`);
  } else {
    console.log(`Seed mídia ignorado: já existem ${mediaCount} itens.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
