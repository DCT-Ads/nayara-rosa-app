/**
 * Publica arquivos de public/uploads/media em um GitHub Release
 * e atualiza mediaUrl/coverUrl no SQLite (dev.db → seed.db).
 *
 * Uso: npx tsx scripts/publish-media-release.ts
 * Requer: gh autenticado + prisma/dev.db com itens de mídia.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const mediaDir = path.join(root, 'public', 'uploads', 'media');
const tag = 'media-v1';
const repo = 'DCT-Ads/nayara-rosa-app';
const baseUrl = `https://github.com/${repo}/releases/download/${tag}`;

const prisma = new PrismaClient({
  datasources: { db: { url: `file:${path.join(root, 'prisma', 'dev.db')}` } },
});

function gh(args: string[]) {
  return execFileSync('gh', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function toReleaseUrl(localUrl: string): string {
  if (!localUrl) return localUrl;
  if (localUrl.startsWith('http://') || localUrl.startsWith('https://')) return localUrl;
  const name = localUrl.split('/').pop();
  if (!name) return localUrl;
  return `${baseUrl}/${name}`;
}

async function main() {
  if (!fs.existsSync(mediaDir)) throw new Error(`Pasta não encontrada: ${mediaDir}`);
  const files = fs.readdirSync(mediaDir).filter((f) => !f.startsWith('.'));
  if (!files.length) throw new Error('Nenhum arquivo em public/uploads/media');

  console.log(`Arquivos locais: ${files.length}`);

  // Cria release se não existir
  try {
    gh(['release', 'view', tag, '--repo', repo]);
    console.log(`Release ${tag} já existe.`);
  } catch {
    console.log(`Criando release ${tag}...`);
    gh([
      'release',
      'create',
      tag,
      '--repo',
      repo,
      '--title',
      'Nayara Rosa — mídia (vídeos/áudios)',
      '--notes',
      'Arquivos de mídia do Player (persistentes para o site na Vercel).',
    ]);
  }

  // Upload (gh ignora se já existir com --clobber)
  for (const file of files) {
    const full = path.join(mediaDir, file);
    console.log(`Enviando ${file} (${(fs.statSync(full).size / 1e6).toFixed(1)} MB)...`);
    try {
      gh([
        'release',
        'upload',
        tag,
        full,
        '--repo',
        repo,
        '--clobber',
      ]);
    } catch (err) {
      console.warn(`Falha ao enviar ${file}:`, err);
    }
  }

  const items = await prisma.mediaItem.findMany();
  console.log(`Atualizando ${items.length} itens no banco...`);
  for (const item of items) {
    const mediaUrl = toReleaseUrl(item.mediaUrl);
    const coverUrl = toReleaseUrl(item.coverUrl);
    if (mediaUrl === item.mediaUrl && coverUrl === item.coverUrl) continue;
    await prisma.mediaItem.update({
      where: { id: item.id },
      data: { mediaUrl, coverUrl },
    });
    console.log(`  ✓ ${item.title}`);
  }

  const ambients = await prisma.ambientTrack.findMany();
  for (const a of ambients) {
    const mediaUrl = toReleaseUrl(a.mediaUrl);
    if (mediaUrl === a.mediaUrl) continue;
    await prisma.ambientTrack.update({
      where: { id: a.id },
      data: { mediaUrl },
    });
    console.log(`  ✓ ambient ${a.id}`);
  }

  // Snapshot para a Vercel (seed.db)
  const devDb = path.join(root, 'prisma', 'dev.db');
  const seedDb = path.join(root, 'prisma', 'seed.db');
  fs.copyFileSync(devDb, seedDb);
  console.log('seed.db atualizado a partir de dev.db');
  console.log('Pronto. Faça commit de prisma/seed.db e deploy.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
