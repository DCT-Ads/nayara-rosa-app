import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assets = path.join(
  process.env.USERPROFILE || '',
  '.cursor/projects/c-Users-Doug-Begui-nayara-rosa-app/assets',
);

const logoSrc = path.join(assets, 'nr-logo-try.jpg');
const lockupSrc = path.join(assets, 'nayara-logo-lockup.jpg');
const heroSrc = path.join(
  assets,
  'c__Users_Doug_Begui_AppData_Roaming_Cursor_User_workspaceStorage_08896aa4de3ccbf3dbef51c185ad69e3_images_photo_2026-10-06_15-07-08-f345bbf4-aa0d-448e-818a-c0fa019edc39.jpg',
);

const outIcons = path.join(root, 'public', 'icons');
const outImages = path.join(root, 'public', 'images');
fs.mkdirSync(outIcons, { recursive: true });
fs.mkdirSync(outImages, { recursive: true });

async function main() {
  // Clean logo mark (square crop of generated logo)
  const logoPng = await sharp(logoSrc)
    .resize(640, 640, { fit: 'cover' })
    .png()
    .toBuffer();
  await sharp(logoPng).toFile(path.join(outIcons, 'logo-nr.png'));
  await sharp(logoPng).resize(512, 512).toFile(path.join(outIcons, 'logo-nr-512.png'));

  await sharp(lockupSrc).png().toFile(path.join(outImages, 'logo-lockup.png'));
  await sharp(heroSrc)
    .jpeg({ quality: 90 })
    .toFile(path.join(outImages, 'nayara-rosa-hero.jpg'));

  // App icon: face-focused crop + small logo badge bottom-right
  const size = 1024;
  const faceCrop = await sharp(heroSrc)
    .resize(size, size, {
      fit: 'cover',
      // Bias upward/center to keep face (photo is mid performance)
      position: 'attention',
    })
    .modulate({ brightness: 0.92, saturation: 1.05 })
    .png()
    .toBuffer();

  const vignette = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="50%" cy="42%" r="68%">
          <stop offset="55%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.55"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>
  `);

  const badgeSize = 280;
  const badgePad = 48;
  const badge = await sharp(logoPng)
    .resize(badgeSize, badgeSize, { fit: 'cover' })
    .png()
    .toBuffer();

  // Soft circle mask for badge
  const circle = Buffer.from(`
    <svg width="${badgeSize}" height="${badgeSize}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${badgeSize / 2}" cy="${badgeSize / 2}" r="${badgeSize / 2}" fill="#fff"/>
    </svg>
  `);
  const badgeRound = await sharp(badge)
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const ring = Buffer.from(`
    <svg width="${badgeSize + 12}" height="${badgeSize + 12}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${(badgeSize + 12) / 2}" cy="${(badgeSize + 12) / 2}" r="${(badgeSize + 12) / 2 - 3}"
        fill="none" stroke="#F5A623" stroke-width="6" opacity="0.9"/>
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

  await sharp(logoPng)
    .resize(64, 64)
    .png()
    .toFile(path.join(root, 'public', 'favicon.png'));

  // SVG mark for crisp small UI
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="Nayara Rosa">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E91E8C"/>
      <stop offset="100%" stop-color="#F5A623"/>
    </linearGradient>
    <linearGradient id="flame" x1="0.2" y1="1" x2="0.8" y2="0">
      <stop offset="0%" stop-color="#F5A623"/>
      <stop offset="55%" stop-color="#FF7A1A"/>
      <stop offset="100%" stop-color="#FFD27A"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="#121212"/>
  <path d="M34 96 L34 36 L56 78 L78 36 L78 96" fill="none" stroke="url(#g)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M86 96 L86 36 L112 96" fill="none" stroke="url(#g)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M30 46 C40 24, 56 18, 62 36 C68 18, 82 22, 90 40 C74 32, 54 36, 44 50 Z" fill="url(#flame)"/>
  <rect x="92" y="22" width="9" height="30" rx="1.5" fill="#D4A574"/>
  <rect x="81" y="31" width="31" height="9" rx="1.5" fill="#D4A574"/>
</svg>`;
  fs.writeFileSync(path.join(outIcons, 'icon.svg'), svg);
  fs.writeFileSync(path.join(root, 'public', 'favicon.svg'), svg);

  console.log('Brand icons ready.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
