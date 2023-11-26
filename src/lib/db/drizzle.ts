import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schemas';

const globalForPg = globalThis as unknown as {
	pg: postgres.Sql | undefined;
};

let pg;

if (process.env.NODE_ENV !== 'production') {
	if (!globalForPg.pg) {
		globalForPg.pg = createPool();
	}
	pg = globalForPg.pg;
} else {
	pg = createPool();
}

function createPool() {
	return postgres(DATABASE_URL);
}

export const db = drizzle(pg, {
	schema,
});
