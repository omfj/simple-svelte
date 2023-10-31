import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schemas';

const pg = postgres(DATABASE_URL);

export const db = drizzle(pg, {
	schema,
});
