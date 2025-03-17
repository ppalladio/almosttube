import { db } from '@/db';
import { categories } from '@/db/schema';

const categoryNames = [
    'Cars',
    'Comedy',
    'Education',
    'Gaming',
    'Entertainment',
    'Film',
    'How-to',
    'News',
    'People',
    'Pets',
    'Science & Technology',
    'Sports',
    'Travel',
];
async function main() {
    try {
        const vals = categoryNames.map((name) => ({
            name,
            description: `Videos Related to ${name.toLowerCase()}`,
        }));

        await db.insert(categories).values(vals);

        console.log('categories seeded successfully');
    } catch (error) {
        console.error('error seeding categories', error);
        process.exit(1);
    }
}

main();
