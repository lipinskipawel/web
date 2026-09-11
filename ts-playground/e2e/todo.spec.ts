import { test, expect } from '@playwright/test';

test('todo page loads and has a title', async ({ page }) => {
  await page.goto('/todo.html');
  await expect(page).toHaveTitle(/todo/i);
});

test('can add a todo item', async ({ page }) => {
  await page.goto('/todo.html');
  await page.getByRole('textbox').fill('Buy milk');
  await page.getByRole('button', { name: /add/i }).click();
  await expect(page.getByText('Buy milk')).toBeVisible();
});
