import { VITE_DATABASE_URL } from '$env/static/private';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

const { Pool } = pg;

const pool = new Pool({
	connectionString: VITE_DATABASE_URL
});

export const db = drizzle(pool, {
	schema
});
