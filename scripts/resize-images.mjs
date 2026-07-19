// Downscale images from a source dir into a destination dir.
// Usage: node scripts/resize-images.mjs <src-dir> <dest-dir>
// Images longer than MAX_DIM on their longest edge are resized down to it;
// smaller images are copied through at quality 85. EXIF rotation is baked in.
import { readdir, mkdir, writeFile, rename } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const MAX_DIM = 2400;
const QUALITY = 85;
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const [srcDir, destDir] = process.argv.slice(2);
if (!srcDir || !destDir) {
  console.error('Usage: node scripts/resize-images.mjs <src-dir> <dest-dir>');
  process.exit(1);
}

await mkdir(destDir, { recursive: true });

const files = (await readdir(srcDir)).filter((f) =>
  EXTENSIONS.has(extname(f).toLowerCase())
);
if (files.length === 0) {
  console.log(`No images found in ${srcDir}`);
  process.exit(0);
}

for (const file of files) {
  const dest = join(destDir, file);
  const image = sharp(join(srcDir, file)).rotate();
  const { width, height } = await image.metadata();
  const buffer = await image
    .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, force: false })
    .toBuffer();
  // Write to a temp name and rename into place: replacing a file only needs
  // write permission on the directory, so this works even when the target is
  // root-owned (Taildrop files arrive owned by root).
  await writeFile(`${dest}.tmp`, buffer);
  await rename(`${dest}.tmp`, dest);
  console.log(
    `${file}: ${width}x${height} -> ${(buffer.length / 1024 / 1024).toFixed(1)}MB`
  );
}
