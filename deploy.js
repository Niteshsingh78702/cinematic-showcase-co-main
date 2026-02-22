/**
 * Post-build deploy script for Hostinger.
 * 
 * Hostinger's Apache serves from the project root, so we need production
 * files (index.html + assets/) at the root level, not just in dist/.
 * 
 * IMPORTANT: This script backs up the dev index.html before overwriting it,
 * because Vite needs the dev version (with /src/main.tsx) to build correctly.
 * 
 * Usage: npm run build:deploy
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const rootDir = __dirname;

// 0. Back up the dev index.html (Vite needs this for builds)
const rootIndex = path.join(rootDir, 'index.html');
const devIndexBackup = path.join(rootDir, 'index.dev.html');
if (fs.existsSync(rootIndex)) {
    fs.copyFileSync(rootIndex, devIndexBackup);
    console.log('📋 Backed up dev index.html → index.dev.html');
}

// 1. Copy dist/index.html → root index.html (production version)
const distIndex = path.join(distDir, 'index.html');
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

// 4. Restore the dev index.html so future Vite builds work correctly
//    (Vite needs <script src="/src/main.tsx"> as entry point, not the production bundle)
if (fs.existsSync(devIndexBackup)) {
    fs.copyFileSync(devIndexBackup, rootIndex);
    console.log('🔄 Restored dev index.html from backup (Vite entry point preserved)');
}

console.log('\n🚀 Deploy files ready!');
console.log('📦 Upload these to Hostinger:');
console.log('   - index.html from dist/ (NOT the root index.html)');
console.log('   - assets/ folder from dist/');
console.log('   - server/ folder');
