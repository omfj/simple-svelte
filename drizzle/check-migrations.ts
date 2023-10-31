import { promisify } from 'util';
import { exec } from 'child_process';

const execute = promisify(exec);

async function main() {
	const { stdout } = await execute('pnpm db:generate');

	const outputLines = stdout.trim().split('\n');
	const lastLine = outputLines[outputLines.length - 1];

	if (!lastLine.startsWith('No schema changes, nothing to migrate')) {
		throw new Error('Database migrations are out of date.');
	}
}

console.log('Checking database migrations...');

main()
	.then(() => {
		console.log('Database migrations are up to date.');
		process.exit(0);
	})
	.catch(() => {
		console.error('Database migrations are out of date. Please run `pnpm db:generate`.');
		process.exit(1);
	});
