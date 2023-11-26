import { PostInsert } from '../../src/lib/db/schemas';
import users from './users';

export default [
	{
		id: '00000000-0000-0000-0000-000000000001',
		title: 'Hello World',
		body: 'This is my first post!',
		userId: users[0].id,
	},
] satisfies Array<PostInsert>;
