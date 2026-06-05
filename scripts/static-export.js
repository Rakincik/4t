/**
 * 4T Akademi — Statik Export Script
 * Admin ve API route'ları geçici olarak taşır, statik build yapar, sonra geri koyar.
 * Kullanım: node scripts/static-export.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC_APP = path.join(ROOT, 'src', 'app');
const TEMP = path.join(ROOT, '_temp_export_backup');

// Geçici olarak taşınacak klasörler (statik export'ta çalışmayanlar)
const DIRS_TO_MOVE = [
    'admin',
    'api',
    'profil',
];

// middleware dosyası
const MIDDLEWARE_FILE = path.join(ROOT, 'src', 'middleware.ts');
const MIDDLEWARE_BACKUP = path.join(TEMP, 'middleware.ts');

function moveOut() {
    console.log('📦 Admin/API/Profil klasörlerini geçici olarak taşıyorum...');
    if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP, { recursive: true });

    for (const dir of DIRS_TO_MOVE) {
        const src = path.join(SRC_APP, dir);
        const dest = path.join(TEMP, dir);
        if (fs.existsSync(src)) {
            fs.renameSync(src, dest);
            console.log(`  ✓ ${dir} → _temp_export_backup/${dir}`);
        }
    }

    // Middleware
    if (fs.existsSync(MIDDLEWARE_FILE)) {
        fs.renameSync(MIDDLEWARE_FILE, MIDDLEWARE_BACKUP);
        console.log('  ✓ middleware.ts → _temp_export_backup/');
    }
}

function moveBack() {
    console.log('🔄 Dosyaları geri koyuyorum...');
    for (const dir of DIRS_TO_MOVE) {
        const src = path.join(TEMP, dir);
        const dest = path.join(SRC_APP, dir);
        if (fs.existsSync(src)) {
            fs.renameSync(src, dest);
            console.log(`  ✓ _temp_export_backup/${dir} → ${dir}`);
        }
    }

    if (fs.existsSync(MIDDLEWARE_BACKUP)) {
        fs.renameSync(MIDDLEWARE_BACKUP, MIDDLEWARE_FILE);
        console.log('  ✓ middleware.ts geri koyuldu');
    }

    // Temp klasörü sil
    if (fs.existsSync(TEMP)) {
        fs.rmSync(TEMP, { recursive: true, force: true });
        console.log('  ✓ _temp_export_backup silindi');
    }
}

async function main() {
    try {
        // 1. Admin/API klasörlerini taşı
        moveOut();

        // 2. Statik build
        console.log('\n🔨 Statik build başlıyor...\n');
        execSync('npx next build', { cwd: ROOT, stdio: 'inherit' });

        console.log('\n✅ Statik export başarılı!');
        console.log('📁 Çıktı: ./out/ klasöründe');
        console.log('💡 Bu klasörü FTP ile httpdocs içine yükleyin.\n');
    } catch (err) {
        console.error('\n❌ Build hatası:', err.message);
    } finally {
        // 3. Her durumda dosyaları geri koy
        moveBack();
    }
}

main();
