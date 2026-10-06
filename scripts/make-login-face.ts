import sharp from 'sharp';

const src = 'public/images/login-golden-hour.jpg';
const out = 'public/images/login-face.jpg';

const meta = await sharp(src).metadata();
const w = meta.width!;
const h = meta.height!;

// Bem no rostinho — pouco céu/folhagem acima
const extract = {
  left: Math.floor(w * 0.14),
  top: Math.floor(h * 0.2),
  width: Math.floor(w * 0.72),
  height: Math.floor(h * 0.5),
};

await sharp(src)
  .extract(extract)
  .resize(1080, 1440, { fit: 'cover', position: 'north' })
  .modulate({ brightness: 1.06, saturation: 1.12 })
  .sharpen({ sigma: 0.6 })
  .jpeg({ quality: 93 })
  .toFile(out);

console.log('login-face ready', extract);
