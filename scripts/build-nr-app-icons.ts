import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const logoSrc = path.join(root, 'public', 'icons', 'logo-nr.png');
const outIcons = path.join(root, 'public', 'icons');

async function squareIcon(size: number, padRatio = 0.08) {
  const pad = Math.round(size * padRatio);
  const inner = size - pad * 2;
  const logo = await sharp(logoSrc)
    .resize(inner, inner, { fit: 'contain', background: { r: 18, g: 18, b: 18, alpha: 1 } })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 18, g: 18, b: 18, alpha: 1 },
    },
  })
    .composite([{ input: logo, top: pad, left: pad }])
    .png()
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(logoSrc)) throw new Error(`Missing ${logoSrc}`);

  const icon512 = await squareIcon(512, 0.06);
  const icon192 = await sharp(icon512).resize(192, 192).png().toBuffer();
  const icon180 = await sharp(icon512).resize(180, 180).png().toBuffer();
  const fav64 = await sharp(icon512).resize(64, 64).png().toBuffer();
  const fav32 = await sharp(icon512).resize(32, 32).png().toBuffer();

  // Maskable: mais margem segura nas bordas
  const maskable = await squareIcon(512, 0.18);

  await sharp(icon192).toFile(path.join(outIcons, 'icon-192.png'));
  await sharp(icon512).toFile(path.join(outIcons, 'icon-512.png'));
  await sharp(maskable).toFile(path.join(outIcons, 'icon-512-maskable.png'));
  await sharp(icon180).toFile(path.join(root, 'public', 'apple-touch-icon.png'));
  await sharp(fav64).toFile(path.join(root, 'public', 'favicon.png'));
  await sharp(fav32).toFile(path.join(outIcons, 'favicon-32.png'));

  // SVG mark simples (fallback) — fundo escuro + referência visual
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="Nayara Rosa">
  <rect width="128" height="128" rx="28" fill="#121212"/>
  <text x="64" y="78" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="52" font-weight="900" fill="#E91E8C">NR</text>
  <g fill="#D4A574">
    <rect x="70" y="22" width="7" height="26" rx="1.5"/>
    <rect x="61" y="30" width="25" height="7" rx="1.5"/>
  </g>
</svg>`;
  fs.writeFileSync(path.join(outIcons, 'icon.svg'), svg);
  fs.writeFileSync(path.join(root, 'public', 'favicon.svg'), svg);

  console.log('NR app icons ready (favicon, apple, 192, 512, maskable).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
