/**
 * Post-build script for Hostinger deployment.
 * Copies the production build files from dist/ to the project root
 * so that Hostinger's Apache can serve them directly.
 *
 * Run: node deploy.js   (called automatically via `npm run build:deploy`)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const rootDir = __dirname;

// 1. Copy dist/index.html → root index.html
const distIndex = path.join(distDir, 'index.html');
const rootIndex = path.join(rootDir, 'index.html');
if (fs.existsSync(distIndex)) {
    fs.copyFileSync(distIndex, rootIndex);
    console.log('✅ Copied dist/index.html → index.html');
} else {
    console.error('❌ dist/index.html not found! Run npm run build first.');
    process.exit(1);
}

// 2. Clean + copy dist/assets/ → root assets/
const distAssets = path.join(distDir, 'assets');
const rootAssets = path.join(rootDir, 'assets');
if (fs.existsSync(distAssets)) {
    // Remove old assets to avoid stale hashed files
    if (fs.existsSync(rootAssets)) {
        const oldFiles = fs.readdirSync(rootAssets);
        for (const file of oldFiles) {
            fs.unlinkSync(path.join(rootAssets, file));
        }
        console.log(`🧹 Cleaned ${oldFiles.length} old files from assets/`);
    } else {
        fs.mkdirSync(rootAssets, { recursive: true });
    }
    const files = fs.readdirSync(distAssets);
    for (const file of files) {
        fs.copyFileSync(path.join(distAssets, file), path.join(rootAssets, file));
    }
    console.log(`✅ Copied ${files.length} files from dist/assets/ → assets/`);
}

// 3. Copy other static files
const staticFiles = ['favicon.ico', 'robots.txt', 'placeholder.svg'];
for (const file of staticFiles) {
    const src = path.join(distDir, file);
    const dest = path.join(rootDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✅ Copied dist/${file} → ${file}`);
    }
}

console.log('\n🚀 Deploy files ready! Commit and push to Hostinger.');
