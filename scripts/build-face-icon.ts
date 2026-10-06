import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outIcons = path.join(root, 'public', 'icons');
const outImages = path.join(root, 'public', 'images');
const heroSrc = path.join(outImages, 'nayara-rosa-hero.jpg');
const logoSrc = path.join(outIcons, 'logo-nr.png');

async function main() {
  if (!fs.existsSync(heroSrc)) throw new Error(`Missing ${heroSrc}`);
  if (!fs.existsSync(logoSrc)) throw new Error(`Missing ${logoSrc}`);

  const size = 1024;
  const meta = await sharp(heroSrc).metadata();
  const w = meta.width || 1024;
  const h = meta.height || 1024;

  // Recorte bem no rostinho (foto 1024² — face à direita / meio-baixo)
  const side = Math.floor(Math.min(w, h) * 0.42);
  const extract = {
    left: Math.floor(w * 0.4),
    top: Math.floor(h * 0.3),
    width: side,
    height: side,
  };

  const faceCrop = await sharp(heroSrc)
    .extract(extract)
    .resize(size, size, { fit: 'cover' })
    .modulate({ brightness: 0.97, saturation: 1.05 })
    .png()
    .toBuffer();

  const vignette = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="48%" cy="42%" r="68%">
          <stop offset="55%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>
  `);

  const badgeSize = 210;
  const badgePad = 40;
  const logoPng = await sharp(logoSrc)
    .resize(badgeSize, badgeSize, { fit: 'cover' })
    .png()
    .toBuffer();

  const circle = Buffer.from(`
    <svg width="${badgeSize}" height="${badgeSize}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${badgeSize / 2}" cy="${badgeSize / 2}" r="${badgeSize / 2}" fill="#fff"/>
    </svg>
  `);
  const badgeRound = await sharp(logoPng)
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const ring = Buffer.from(`
    <svg width="${badgeSize + 12}" height="${badgeSize + 12}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${(badgeSize + 12) / 2}" cy="${(badgeSize + 12) / 2}" r="${(badgeSize + 12) / 2 - 3}"
        fill="none" stroke="#F5A623" stroke-width="6" opacity="0.95"/>
    </svg>
  `);

  const appIcon = await sharp(faceCrop)
    .composite([
      { input: vignette, blend: 'over' },
      {
        input: ring,
        top: size - badgePad - badgeSize - 6,
        left: size - badgePad - badgeSize - 6,
      },
      {
        input: badgeRound,
        top: size - badgePad - badgeSize,
        left: size - badgePad - badgeSize,
      },
    ])
    .png()
    .toBuffer();

  await sharp(appIcon).toFile(path.join(outIcons, 'app-icon-source.png'));
  for (const s of [192, 512] as const) {
    await sharp(appIcon)
      .resize(s, s)
      .png()
      .toFile(path.join(outIcons, `icon-${s}.png`));
  }
  await sharp(appIcon)
    .resize(512, 512)
    .png()
    .toFile(path.join(outIcons, 'icon-512-maskable.png'));
  await sharp(appIcon)
    .resize(180, 180)
    .png()
    .toFile(path.join(root, 'public', 'apple-touch-icon.png'));

  await sharp(faceCrop)
    .resize(512, 512)
    .jpeg({ quality: 90 })
    .toFile(path.join(outImages, 'nayara-rosto.jpg'));

  // limpa testes
  for (const f of ['_face-a.jpg', '_face-b.jpg', '_face-c.jpg', '_face-d.jpg']) {
    const p = path.join(outImages, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  const testPng = path.join(outIcons, '_face-test.png');
  if (fs.existsSync(testPng)) fs.unlinkSync(testPng);

  console.log('Rostinho pronto:', extract);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
