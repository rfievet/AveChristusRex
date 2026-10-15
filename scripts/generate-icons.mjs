// Dev-only: regenerate the PWA PNG app icons from the source SVG.
//
// Renders public/favicon.svg onto a solid #0e1526 background at 192x192 and
// 512x512 and writes public/pwa-192.png / public/pwa-512.png. The solid
// background matches the app's theme-color so maskable icons look right when
// the OS crops them to a circle/squircle. Run once after changing favicon.svg:
//
//   node scripts/generate-icons.mjs
//
// sharp is already a devDependency; this script is not part of the build.
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '..', 'public')
const source = resolve(publicDir, 'favicon.svg')

// #0e1526 as RGB — the app's theme-color / manifest background.
const background = { r: 14, g: 21, b: 38, alpha: 1 }

const sizes = [
  { size: 192, out: 'pwa-192.png' },
  { size: 512, out: 'pwa-512.png' },
]

for (const { size, out } of sizes) {
  // Render the SVG at the target size, then flatten over the solid background
  // so there is no transparency (better for maskable icons).
  const svg = await sharp(source, { density: 384 })
    .resize(size, size, { fit: 'contain', background })
    .png()
    .toBuffer()

  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: svg }])
    .png()
    .toFile(resolve(publicDir, out))

  console.log(`wrote public/${out} (${size}x${size})`)
}
