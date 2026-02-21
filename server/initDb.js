import pool from './config/db.js';
import bcrypt from 'bcrypt';

const initDatabase = async () => {
    try {
        console.log('🔧 Checking database tables...');

        // Create admins table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create site_content table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS site_content (
                id INT AUTO_INCREMENT PRIMARY KEY,
                section VARCHAR(50) NOT NULL,
                title VARCHAR(255),
                description TEXT,
                media_url VARCHAR(500),
                media_type VARCHAR(20) DEFAULT 'image',
                link_url VARCHAR(500),
                category VARCHAR(100),
                display_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_section (section),
                INDEX idx_active (is_active)
            )
        `);

        // Create inquiries table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS inquiries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                email VARCHAR(255) NOT NULL,
                event_type VARCHAR(100),
                message TEXT NOT NULL,
                is_contacted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_contacted (is_contacted)
            )
        `);

        // Create seo_settings table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS seo_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                page VARCHAR(50) NOT NULL UNIQUE,
                meta_title VARCHAR(255),
                meta_description TEXT,
                meta_keywords VARCHAR(500),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Seed admin user if none exists
        const [admins] = await pool.execute('SELECT COUNT(*) as count FROM admins');
        if (admins[0].count === 0) {
            console.log('👤 Creating default admin user...');
            const passwordHash = await bcrypt.hash('admin123', 10);
            await pool.execute(
                'INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)',
                ['admin@mgfilms.com', passwordHash, 'MG Films Admin']
            );
        }

        // Seed SEO settings if none exist
        const [seo] = await pool.execute('SELECT COUNT(*) as count FROM seo_settings');
        if (seo[0].count === 0) {
            console.log('🔍 Adding default SEO settings...');
            const seoData = [
                ['home', 'MG Films | Capturing Emotions, Creating Memories', 'MG Films - Regional music albums, short films & wedding cinematography.', 'MG Films, Purulia Bangla, Khortha, Santhali, wedding cinematography'],
                ['about', 'About MG Films | Our Story & Vision', 'Learn about MG Films - a creative production house specializing in regional content.', 'MG Films about, production house, regional films'],
                ['work', 'Our Work | MG Films Portfolio', 'Explore our portfolio of regional music albums, short films, and wedding cinematography.', 'MG Films portfolio, albums, films, wedding'],
                ['actress', 'Monika Singh | Actress Portfolio', 'Monika Singh - Regional actress in Purulia Bangla, Khortha and Santhali productions.', 'Monika Singh, actress, regional artist'],
                ['services', 'Services | MG Films Productions', 'Professional film production, music albums, wedding cinematography and more.', 'film production, music album, wedding cinematography, video editing'],
                ['contact', 'Contact MG Films | Book Your Event', 'Get in touch with MG Films for wedding cinematography, film production, and more.', 'contact MG Films, book wedding, film production booking'],
            ];
            for (const [page, title, desc, keywords] of seoData) {
                await pool.execute(
                    'INSERT IGNORE INTO seo_settings (page, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?)',
                    [page, title, desc, keywords]
                );
            }
        }

        console.log('✅ Database ready!');
    } catch (err) {
        console.error('❌ Database init failed:', err.message);
        // Don't crash the server — let it start anyway so health check works
    }
};

export default initDatabase;
