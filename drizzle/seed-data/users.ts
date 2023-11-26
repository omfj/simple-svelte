import { UserInsert } from '../../src/lib/db/schemas';
import bcrypt from 'bcryptjs';

export default [
	{
		id: '00000000-0000-0000-0000-000000000000',
		email: 'foo@bar.com',
		username: 'foobar',
		password: bcrypt.hashSync('foobar', 10),
	},
] satisfies Array<UserInsert>;
