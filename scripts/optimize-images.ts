import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.join(process.cwd(), 'public/images/products');
const QUALITY = 80;
const MAX_WIDTH = 1920;

async function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): Promise<string[]> {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = await getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  }

  return arrayOfFiles;
}

async function optimize() {
  console.log('🚀 Starting image optimization...');

  if (!fs.existsSync(TARGET_DIR)) {
    console.error('❌ Target directory not found:', TARGET_DIR);
    return;
  }

  const files = await getAllFiles(TARGET_DIR);
  const imageFiles = files.filter(file =>
    /\.(png|jpg|jpeg)$/i.test(file) && !file.endsWith('.webp')
  );

  console.log(`Found ${imageFiles.length} images to optimize.`);

  for (const file of imageFiles) {
    try {
      const relativePath = path.relative(TARGET_DIR, file);
      const outputName = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');

      console.log(`Processing: ${relativePath}...`);

      const image = sharp(file);
      const metadata = await image.metadata();

      let pipeline = image;

      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH);
      }

      await pipeline
        .webp({ quality: QUALITY })
        .toFile(outputName);

      // We keep the original for now (or delete if requested)
      // fs.unlinkSync(file); 

      console.log(`✅ Saved: ${path.relative(TARGET_DIR, outputName)}`);
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err);
    }
  }

  console.log('✨ Optimization complete!');
}

optimize().catch(console.error);
