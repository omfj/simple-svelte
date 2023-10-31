import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../src/lib/db/drizzle';

console.log('🚀 Starting migrations...');

migrate(db, { migrationsFolder: './drizzle/migrations' })
	.then(() => {
		console.log('✅ Migrations complete!');
		process.exit(0);
	})
	.catch((err) => {
		console.error('🚨 Migrations failed! Error:', err);
		process.exit(1);
	});
