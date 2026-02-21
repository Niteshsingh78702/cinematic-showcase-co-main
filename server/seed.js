import bcrypt from 'bcrypt';
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
    console.log('🌱 Seeding MG Films database...');

    try {
        // Create admin user
        const adminEmail = 'admin@mgfilms.com';
        const adminPassword = 'admin123'; // Change after first login!
        const hash = await bcrypt.hash(adminPassword, 10);

        await pool.execute(
            'INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = ?',
            [adminEmail, hash, 'MG Films Admin', hash]
        );
        console.log('✅ Admin user created (admin@mgfilms.com / admin123)');

        // Seed SEO settings
        const seoPages = [
            ['home', 'MG Films | Capturing Emotions, Creating Memories', 'MG Films - Regional music albums, short films & wedding cinematography.', 'MG Films, Purulia Bangla, Khortha, Santhali'],
            ['about', 'About MG Films | Our Story & Vision', 'Learn about MG Films production house.', 'MG Films about, production house'],
            ['work', 'Our Work | MG Films Portfolio', 'Explore our portfolio of albums, films, and weddings.', 'portfolio, albums, films'],
            ['actress', 'Monika Singh | Actress Portfolio', 'Monika Singh - Regional actress.', 'Monika Singh, actress'],
            ['services', 'Services | MG Films', 'Professional production services.', 'film production, wedding cinematography'],
            ['contact', 'Contact MG Films', 'Get in touch with MG Films.', 'contact, booking'],
        ];

        for (const [page, title, desc, keywords] of seoPages) {
            await pool.execute(
                'INSERT INTO seo_settings (page, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE meta_title = ?, meta_description = ?, meta_keywords = ?',
                [page, title, desc, keywords, title, desc, keywords]
            );
        }
        console.log('✅ SEO settings seeded');

        console.log('🎬 Database seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
};

seed();
