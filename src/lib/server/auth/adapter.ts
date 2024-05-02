import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import { client } from '../db/drizzle';

export const adapter = new LibSQLAdapter(client, {
    user: "user",
    session: "session",
});
