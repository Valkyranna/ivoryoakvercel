/**
 * Optimize all images in public/images/ to AVIF and WebP
 * Usage: bun run scripts/optimize-images.ts
 */
import sharp from 'sharp'
import { readdirSync, statSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname, basename, extname } from 'path'

const INPUT_DIR = join(process.cwd(), 'public/images')
const QUALITY_AVIF = 50
const QUALITY_WEBP = 75

async function optimizeImage(inputPath: string, outputDir: string) {
  const name = basename(inputPath, extname(inputPath))
  const image = sharp(inputPath)
  const metadata = await image.metadata()

  // Generate AVIF
  const avifPath = join(outputDir, `${name}.avif`)
  await image.avif({ quality: QUALITY_AVIF, effort: 9 }).toFile(avifPath)

  // Generate WebP
  const webpPath = join(outputDir, `${name}.webp`)
  await image.webp({ quality: QUALITY_WEBP, effort: 6 }).toFile(webpPath)

  const origSize = statSync(inputPath).size
  const avifSize = statSync(avifPath).size
  const webpSize = statSync(webpPath).size

  console.log(
    `${name.padEnd(25)} | orig: ${(origSize / 1024).toFixed(0)}KB | ` +
    `avif: ${(avifSize / 1024).toFixed(0)}KB (${((1 - avifSize / origSize) * 100).toFixed(0)}%) | ` +
    `webp: ${(webpSize / 1024).toFixed(0)}KB (${((1 - webpSize / origSize) * 100).toFixed(0)}%)`
  )
}

async function processDirectory(dir: string) {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      await processDirectory(fullPath)
    } else if (/\.(jpg|jpeg|png)$/i.test(entry)) {
      await optimizeImage(fullPath, dir)
    }
  }
}

console.log('🖼️  Optimizing images...\n')
await processDirectory(INPUT_DIR)
console.log('\n✅ Done!')
