import { db } from '../src/lib/db/drizzle';
import { posts, users } from '../src/lib/db/schemas';
import testUsers from './seed-data/users';
import testPosts from './seed-data/posts';

console.log('🚀 Starting seeding...');

seed()
	.then(() => {
		console.log('✅ Seeding complete!');
		process.exit(0);
	})
	.catch((err) => {
		console.error('🚨 Seeding failed! Error:', err);
		process.exit(1);
	});

async function seed() {
	await db.insert(users).values(testUsers);
	await db.insert(posts).values(testPosts);
}
