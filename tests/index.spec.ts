import { expect, test } from '@playwright/test';

test.describe('index page', () => {
	test('should have title and heading', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle('Home | Simple Svelte');

		await expect(page.getByRole('heading', { name: 'Welcome to SimpleSvelte' })).toBeVisible();
	});
});
