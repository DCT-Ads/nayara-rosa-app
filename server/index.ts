import cors from 'cors';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const isVercel = process.env.VERCEL === '1';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

if (isVercel && !process.env.DATABASE_URL?.includes('/tmp')) {
  process.env.DATABASE_URL = 'file:/tmp/nayara-rosa.db';
}

const prisma = new PrismaClient();
const app = express();
const PORT = Number(process.env.API_PORT) || 3001;

const ADMIN_EMAIL = 'admin@nayararosa';
const uploadsRoot = isVercel
  ? path.join('/tmp', 'uploads')
  : path.join(rootDir, 'public', 'uploads');
const trajetoriaDir = path.join(uploadsRoot, 'trajetoria');
const mediaDir = path.join(uploadsRoot, 'media');

fs.mkdirSync(trajetoriaDir, { recursive: true });
fs.mkdirSync(mediaDir, { recursive: true });

let dbReady: Promise<void> | null = null;

async function ensureDatabase() {
  if (!isVercel) return;
  const dbPath = '/tmp/nayara-rosa.db';
  const seedDb = path.join(rootDir, 'prisma', 'seed.db');
  if (!fs.existsSync(dbPath) && fs.existsSync(seedDb)) {
    fs.copyFileSync(seedDb, dbPath);
  }
  if (!fs.existsSync(dbPath)) {
    execSync('npx prisma db push --skip-generate', {
      cwd: rootDir,
      env: { ...process.env, DATABASE_URL: 'file:/tmp/nayara-rosa.db' },
      stdio: 'ignore',
    });
    try {
      execSync('npx tsx prisma/seed.ts', {
        cwd: rootDir,
        env: { ...process.env, DATABASE_URL: 'file:/tmp/nayara-rosa.db' },
        stdio: 'ignore',
      });
    } catch {
      /* seed opcional */
    }
  }
}

function makeStorage(dest: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.bin';
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    },
  });
}

const upload = multer({
  storage: makeStorage(trajetoriaDir),
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas foto ou vídeo'));
    }
  },
});

const uploadMedia = multer({
  storage: makeStorage(mediaDir),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      file.mimetype.startsWith('audio/')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Apenas áudio, vídeo ou imagem'));
    }
  },
});

function unlinkUpload(url: string) {
  if (!url?.startsWith('/uploads/')) return;
  const relative = url.replace(/^\//, '');
  const candidates = [
    path.join(uploadsRoot, relative.replace(/^uploads[\\/]/, '')),
    path.join(rootDir, 'public', relative),
  ];
  for (const oldPath of candidates) {
    if (fs.existsSync(oldPath)) fs.unlink(oldPath, () => undefined);
  }
}

function mapMedia(m: {
  id: string;
  title: string;
  artist: string;
  type: string;
  duration: string;
  coverUrl: string;
  mediaUrl: string;
  placeholder: string;
  plays: string;
  lyrics: string;
  sortOrder: number;
}) {
  const cover = m.coverUrl
    ? `url('${m.coverUrl}')`
    : m.placeholder ||
      'linear-gradient(145deg, #1A0A18 0%, #5C1840 50%, #2A0A20 100%)';
  return {
    id: m.id,
    title: m.title,
    artist: m.artist,
    type: m.type as 'musica' | 'video' | 'album',
    duration: m.duration,
    cover,
    coverUrl: m.coverUrl,
    mediaUrl: m.mediaUrl,
    placeholder: m.placeholder,
    plays: m.plays,
    lyrics: m.lyrics,
    sortOrder: m.sortOrder,
  };
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsRoot));
app.use('/uploads', express.static(path.join(rootDir, 'public', 'uploads')));
app.use((_req, _res, next) => {
  if (!dbReady) dbReady = ensureDatabase();
  void dbReady.then(() => next()).catch(next);
});

function isAdmin(req: express.Request): boolean {
  const email = String(req.headers['x-admin-email'] || '').toLowerCase().trim();
  return email === ADMIN_EMAIL;
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: 'Acesso restrito ao admin' });
  }
  return next();
}

function paramId(req: express.Request): string {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : String(id || '');
}

function mapEvent(e: {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  alertEnabled: boolean;
}) {
  return {
    id: e.id,
    title: e.title,
    type: e.type as 'show' | 'live' | 'lancamento',
    date: e.date,
    time: e.time,
    location: e.location,
    description: e.description,
    alertEnabled: e.alertEnabled,
  };
}

function mapMark(m: {
  id: string;
  year: string;
  title: string;
  caption: string;
  mediaUrl: string;
  mediaType: string;
  placeholder: string;
  sortOrder: number;
}) {
  return {
    id: m.id,
    year: m.year,
    title: m.title,
    caption: m.caption,
    mediaUrl: m.mediaUrl,
    mediaType: m.mediaType as 'none' | 'image' | 'video',
    placeholder: m.placeholder,
    sortOrder: m.sortOrder,
    image: m.mediaUrl
      ? `url('${m.mediaUrl}')`
      : m.placeholder || 'linear-gradient(145deg, #1A0A18 0%, #5C1840 50%, #2A0A20 100%)',
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/events', async (_req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
    res.json(events.map(mapEvent));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao listar eventos' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: paramId(req) } });
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    return res.json(mapEvent(event));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao buscar evento' });
  }
});

app.post('/api/events', requireAdmin, async (req, res) => {
  try {
    const { title, type, date, time, location, description, alertEnabled } = req.body;
    if (!title || !type || !date || !time || !location) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    if (!['show', 'live', 'lancamento'].includes(type)) {
      return res.status(400).json({ error: 'Tipo inválido' });
    }
    const event = await prisma.event.create({
      data: {
        title: String(title).trim(),
        type,
        date: String(date),
        time: String(time),
        location: String(location).trim(),
        description: String(description || ''),
        alertEnabled: Boolean(alertEnabled),
      },
    });
    return res.status(201).json(mapEvent(event));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao criar evento' });
  }
});

app.put('/api/events/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.event.findUnique({ where: { id: paramId(req) } });
    if (!existing) return res.status(404).json({ error: 'Evento não encontrado' });

    const { title, type, date, time, location, description, alertEnabled } = req.body;
    if (type && !['show', 'live', 'lancamento'].includes(type)) {
      return res.status(400).json({ error: 'Tipo inválido' });
    }

    const event = await prisma.event.update({
      where: { id: paramId(req) },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(type !== undefined && { type }),
        ...(date !== undefined && { date: String(date) }),
        ...(time !== undefined && { time: String(time) }),
        ...(location !== undefined && { location: String(location).trim() }),
        ...(description !== undefined && { description: String(description) }),
        ...(alertEnabled !== undefined && { alertEnabled: Boolean(alertEnabled) }),
      },
    });
    return res.json(mapEvent(event));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao atualizar evento' });
  }
});

app.patch('/api/events/:id/alert', requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.event.findUnique({ where: { id: paramId(req) } });
    if (!existing) return res.status(404).json({ error: 'Evento não encontrado' });

    const alertEnabled =
      typeof req.body.alertEnabled === 'boolean'
        ? req.body.alertEnabled
        : !existing.alertEnabled;

    const event = await prisma.event.update({
      where: { id: paramId(req) },
      data: { alertEnabled },
    });
    return res.json(mapEvent(event));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao atualizar alerta' });
  }
});

app.delete('/api/events/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.event.findUnique({ where: { id: paramId(req) } });
    if (!existing) return res.status(404).json({ error: 'Evento não encontrado' });
    await prisma.event.delete({ where: { id: paramId(req) } });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao excluir evento' });
  }
});

/* —— Trajetória —— */
app.get('/api/timeline', async (_req, res) => {
  try {
    const marks = await prisma.timelineMark.findMany({
      orderBy: [{ sortOrder: 'asc' }, { year: 'asc' }],
    });
    res.json(marks.map(mapMark));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao listar trajetória' });
  }
});

app.post('/api/timeline', requireAdmin, async (req, res) => {
  try {
    const { year, title, caption, sortOrder } = req.body;
    if (!year || !title || !caption) {
      return res.status(400).json({ error: 'Ano, título e texto são obrigatórios' });
    }
    const max = await prisma.timelineMark.aggregate({ _max: { sortOrder: true } });
    const mark = await prisma.timelineMark.create({
      data: {
        year: String(year).trim(),
        title: String(title).trim(),
        caption: String(caption).trim(),
        sortOrder:
          typeof sortOrder === 'number'
            ? sortOrder
            : (max._max.sortOrder ?? 0) + 10,
        placeholder:
          'linear-gradient(145deg, #1A0A18 0%, #5C1840 50%, #2A0A20 100%)',
      },
    });
    return res.status(201).json(mapMark(mark));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao criar marco' });
  }
});

app.put('/api/timeline/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.timelineMark.findUnique({ where: { id: paramId(req) } });
    if (!existing) return res.status(404).json({ error: 'Marco não encontrado' });

    const { year, title, caption, sortOrder } = req.body;
    const mark = await prisma.timelineMark.update({
      where: { id: paramId(req) },
      data: {
        ...(year !== undefined && { year: String(year).trim() }),
        ...(title !== undefined && { title: String(title).trim() }),
        ...(caption !== undefined && { caption: String(caption).trim() }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });
    return res.json(mapMark(mark));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao atualizar marco' });
  }
});

app.post(
  '/api/timeline/:id/media',
  requireAdmin,
  upload.single('media'),
  async (req, res) => {
    try {
      const existing = await prisma.timelineMark.findUnique({ where: { id: paramId(req) } });
      if (!existing) return res.status(404).json({ error: 'Marco não encontrado' });
      if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

      const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
      const mediaUrl = `/uploads/trajetoria/${req.file.filename}`;

      if (existing.mediaUrl?.startsWith('/uploads/')) {
        const oldPath = path.join(rootDir, 'public', existing.mediaUrl.replace(/^\//, ''));
        fs.unlink(oldPath, () => undefined);
      }

      const mark = await prisma.timelineMark.update({
        where: { id: paramId(req) },
        data: { mediaUrl, mediaType },
      });
      return res.json(mapMark(mark));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha ao enviar mídia' });
    }
  },
);

app.delete('/api/timeline/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.timelineMark.findUnique({ where: { id: paramId(req) } });
    if (!existing) return res.status(404).json({ error: 'Marco não encontrado' });

    unlinkUpload(existing.mediaUrl);
    await prisma.timelineMark.delete({ where: { id: paramId(req) } });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao excluir marco' });
  }
});

/* —— Player / Mídia —— */
app.get('/api/media', async (_req, res) => {
  try {
    const items = await prisma.mediaItem.findMany({
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });
    res.json(items.map(mapMedia));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao listar mídias' });
  }
});

app.post('/api/media', requireAdmin, async (req, res) => {
  try {
    const { title, artist, type, duration, lyrics, plays } = req.body;
    if (!title || !type) {
      return res.status(400).json({ error: 'Título e tipo são obrigatórios' });
    }
    if (!['musica', 'video', 'album'].includes(type)) {
      return res.status(400).json({ error: 'Tipo inválido' });
    }
    const max = await prisma.mediaItem.aggregate({ _max: { sortOrder: true } });
    const item = await prisma.mediaItem.create({
      data: {
        title: String(title).trim(),
        artist: String(artist || 'Nayara Rosa').trim(),
        type,
        duration: String(duration || '0:00'),
        lyrics: String(lyrics || ''),
        plays: String(plays || '0'),
        sortOrder: (max._max.sortOrder ?? 0) + 10,
        placeholder:
          'linear-gradient(145deg, #1A0A18 0%, #5C1840 50%, #2A0A20 100%)',
      },
    });
    return res.status(201).json(mapMedia(item));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao criar mídia' });
  }
});

app.put('/api/media/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.mediaItem.findUnique({ where: { id: paramId(req) } });
    if (!existing) return res.status(404).json({ error: 'Mídia não encontrada' });

    const { title, artist, type, duration, lyrics, plays, sortOrder } = req.body;
    if (type && !['musica', 'video', 'album'].includes(type)) {
      return res.status(400).json({ error: 'Tipo inválido' });
    }

    const item = await prisma.mediaItem.update({
      where: { id: paramId(req) },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(artist !== undefined && { artist: String(artist).trim() }),
        ...(type !== undefined && { type }),
        ...(duration !== undefined && { duration: String(duration) }),
        ...(lyrics !== undefined && { lyrics: String(lyrics) }),
        ...(plays !== undefined && { plays: String(plays) }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });
    return res.json(mapMedia(item));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao atualizar mídia' });
  }
});

app.post(
  '/api/media/:id/file',
  requireAdmin,
  uploadMedia.single('file'),
  async (req, res) => {
    try {
      const existing = await prisma.mediaItem.findUnique({ where: { id: paramId(req) } });
      if (!existing) return res.status(404).json({ error: 'Mídia não encontrada' });
      if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

      const mediaUrl = `/uploads/media/${req.file.filename}`;
      unlinkUpload(existing.mediaUrl);

      let type = existing.type;
      if (req.file.mimetype.startsWith('video/')) type = 'video';
      else if (req.file.mimetype.startsWith('audio/') && type === 'video') type = 'musica';

      const item = await prisma.mediaItem.update({
        where: { id: paramId(req) },
        data: { mediaUrl, type },
      });
      return res.json(mapMedia(item));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha ao enviar arquivo' });
    }
  },
);

app.post(
  '/api/media/:id/cover',
  requireAdmin,
  uploadMedia.single('cover'),
  async (req, res) => {
    try {
      const existing = await prisma.mediaItem.findUnique({ where: { id: paramId(req) } });
      if (!existing) return res.status(404).json({ error: 'Mídia não encontrada' });
      if (!req.file) return res.status(400).json({ error: 'Capa não enviada' });
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'Capa deve ser imagem' });
      }

      const coverUrl = `/uploads/media/${req.file.filename}`;
      if (existing.coverUrl.startsWith('/uploads/')) unlinkUpload(existing.coverUrl);

      const item = await prisma.mediaItem.update({
        where: { id: paramId(req) },
        data: { coverUrl },
      });
      return res.json(mapMedia(item));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha ao enviar capa' });
    }
  },
);

app.delete('/api/media/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.mediaItem.findUnique({ where: { id: paramId(req) } });
    if (!existing) return res.status(404).json({ error: 'Mídia não encontrada' });
    unlinkUpload(existing.mediaUrl);
    if (existing.coverUrl.startsWith('/uploads/')) unlinkUpload(existing.coverUrl);
    await prisma.mediaItem.delete({ where: { id: paramId(req) } });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao excluir mídia' });
  }
});

/* Produção: site + API no mesmo servidor */
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    return res.sendFile(path.join(distDir, 'index.html'));
  });
}

if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`API/site em http://localhost:${PORT}`);
    if (fs.existsSync(distDir)) {
      console.log('Servindo build de produção (dist/) — site + app PWA');
    }
  });
}

export default app;
