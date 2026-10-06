/** Mapeamento oficial das fotos (Roberta) + conteúdo do app */

export const PHOTO_MAP = {
  login:
    'Foto: óculos escuros, sorrindo, rua charmosa — golden hour (full-screen login)',
  launchBanner: [
    'Capa oficial single "Cordas de Amor" — logo Avance Music',
    'Capa "Cordas de Amor" — versão @nayararosaof',
  ],
  mediaThumbs: [
    'Palco look marrom — de pé sorrindo',
    'Palco look marrom — cantando ao microfone',
  ],
  prayer: [
    'Ministração — ajoelhada sendo abençoada',
    'Ministração — mão levantada com microfone',
  ],
  trajetoria: [
    'Palco luz azul "Jesus" — intensidade',
    'Tela ADOS/Incendeia',
    'Sorrindo apontando câmera com microfone',
  ],
  agenda: 'Arte AGENDA ABERTA — neon rosa + contato (45) 9858-5431',
} as const;

/** Gradientes fotográficos de placeholder até as fotos oficiais serem adicionadas em /public/images/ */
export const images = {
  login: "url('/images/login-golden-hour.jpg')",
  cordasDeAmor: "url('/images/cordas-de-amor-avance.jpg')",
  calendarStage: "url('/images/calendar-israel-stage.jpg')",
  cordasAlt: "url('/images/cordas-de-amor-destaque.jpg')",
  stageSmile:
    'linear-gradient(180deg, #2A1812 0%, #5C2E1A 45%, #1A1210 100%)',
  stageMic:
    'linear-gradient(200deg, #1E1010 0%, #7A2E18 55%, #120C0A 100%)',
  prayerKneel: "url('/images/altar-oracao.jpg')",
  prayerHand:
    'linear-gradient(160deg, #12100C 0%, #6B5030 50%, #D4A57444 80%, #0A0908 100%)',
  jesusBlue:
    'linear-gradient(180deg, #0A1020 0%, #1A3A6B 40%, #0C1828 100%)',
  ados:
    'linear-gradient(145deg, #1A0A18 0%, #5C1840 50%, #2A0A20 100%)',
  pointCamera:
    'linear-gradient(200deg, #2A1810 0%, #8B4020 50%, #1A1008 100%)',
  agendaNeon: "url('/images/agenda-aberta.jpg')",
  avatar:
    'linear-gradient(135deg, #E91E8C, #F5A623)',
} as const;

export type Track = {
  id: string;
  title: string;
  artist: string;
  type: 'musica' | 'video' | 'album';
  duration: string;
  cover: string;
  coverUrl?: string;
  mediaUrl?: string;
  lyrics?: string;
  plays?: string;
  sortOrder?: number;
};

export type EventItem = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  type: 'show' | 'live' | 'lancamento';
  alertEnabled?: boolean;
};

export type PrayerRequest = {
  id: string;
  author: string;
  text: string;
  prayedCount: number;
  timeAgo: string;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  days: number;
  progress: number;
  seal?: string;
};

export type TimelineMark = {
  id: string;
  year: string;
  title: string;
  caption: string;
  image: string;
  mediaUrl?: string;
  mediaType?: 'none' | 'image' | 'video';
  placeholder?: string;
  sortOrder?: number;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'evento' | 'musica' | 'oracao' | 'sistema';
};

export const tracks: Track[] = [
  {
    id: '1',
    title: 'Cordas de Amor',
    artist: 'Nayara Rosa',
    type: 'musica',
    duration: '3:42',
    cover: images.cordasDeAmor,
    plays: '12.4k',
  },
  {
    id: '2',
    title: 'Cordas de Amor (Clipe Oficial)',
    artist: 'Nayara Rosa',
    type: 'video',
    duration: '4:08',
    cover: images.cordasAlt,
    plays: '8.1k',
  },
  {
    id: '3',
    title: 'Incendeia',
    artist: 'Nayara Rosa',
    type: 'musica',
    duration: '5:15',
    cover: images.stageMic,
    plays: '9.7k',
  },
  {
    id: '4',
    title: 'Jesus (Ao Vivo)',
    artist: 'Nayara Rosa',
    type: 'video',
    duration: '6:22',
    cover: images.jesusBlue,
    plays: '15.2k',
  },
  {
    id: '5',
    title: 'Ministração — Altar',
    artist: 'Nayara Rosa',
    type: 'musica',
    duration: '7:01',
    cover: images.prayerHand,
    plays: '6.3k',
  },
  {
    id: '6',
    title: 'ADOS Sessions',
    artist: 'Nayara Rosa',
    type: 'album',
    duration: '32:10',
    cover: images.ados,
    plays: '4.9k',
  },
];

export const events: EventItem[] = [];

export const prayers: PrayerRequest[] = [
  {
    id: 'p1',
    author: 'Ana Clara',
    text: 'Peço oração pela saúde da minha mãe e restauração da família.',
    prayedCount: 128,
    timeAgo: '2h',
  },
  {
    id: 'p2',
    author: 'Marcos',
    text: 'Direção divina para uma decisão profissional importante.',
    prayedCount: 64,
    timeAgo: '5h',
  },
  {
    id: 'p3',
    author: 'Juliana',
    text: 'Gratidão e força para continuar a jornada de fé.',
    prayedCount: 91,
    timeAgo: '1d',
  },
];

export const missions: Mission[] = [
  {
    id: 'm1',
    title: 'Ore 7 dias seguidos',
    description: 'Dedique 10 minutos diários em oração no Altar Virtual.',
    days: 7,
    progress: 4,
    seal: 'Fiel',
  },
  {
    id: 'm2',
    title: 'Compartilhe gratidão',
    description: 'Envie 3 testemunhos de gratidão à comunidade.',
    days: 3,
    progress: 1,
    seal: 'Testemunha',
  },
  {
    id: 'm3',
    title: 'Jejum de 24h',
    description: 'Um dia de jejum com foco em intercessão.',
    days: 1,
    progress: 0,
    seal: 'Consagrado',
  },
];

export const trajetoria: TimelineMark[] = [];

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Show amanhã',
    body: 'Lembrete: Show Cordas de Amor Tour — Cascavel, 20:00',
    time: 'Agora',
    read: false,
    type: 'evento',
  },
  {
    id: 'n2',
    title: 'Novo lançamento',
    body: 'Cordas de Amor já está no Player de Mídia',
    time: '3h',
    read: false,
    type: 'musica',
  },
  {
    id: 'n3',
    title: 'Alguém orou com você',
    body: '12 pessoas oraram no seu pedido recente',
    time: '1d',
    read: true,
    type: 'oracao',
  },
  {
    id: 'n4',
    title: 'Missão em andamento',
    body: 'Você está no dia 4 de 7 — continue firme!',
    time: '2d',
    read: true,
    type: 'sistema',
  },
];

export const CONTACT_PHONE = '(45) 9858-5431';
export const CONTACT_PHONE_RAW = '554598585431';
