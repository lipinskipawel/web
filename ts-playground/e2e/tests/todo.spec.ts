import { test, expect } from '@playwright/test';

test.describe('Todo app', () => {
    test('can add a new todo item', async ({ page }) => {
        await page.goto('/todo.html');

        await page.locator('#task-input').fill('Buy milk');
        await page.locator('#task-input').press('Enter');

        await expect(page.getByText('Buy milk')).toBeVisible();
        // input should clear itself after Enter, per taskReader()
        await expect(page.locator('#task-input')).toHaveValue('');
    });

    test('can delete a checked todo item', async ({ page }) => {
        await page.goto('/todo.html');

        await page.locator('#task-input').fill('Wash dishes');
        await page.locator('#task-input').press('Enter');
        await expect(page.getByText('Wash dishes')).toBeVisible();

        const checkbox = page.locator('#list-div input[type="checkbox"]').first();
        await checkbox.check();
        await page.locator('#delete').click();

        await expect(page.getByText('Wash dishes')).toHaveCount(0);
    });

    test('saves todos to localStorage', async ({ page }) => {
        await page.goto('/todo.html');

        await page.locator('#task-input').fill('Read a book');
        await page.locator('#task-input').press('Enter');

        // saveLoadLocalStorage() only *saves* when todos.length !== 0
        await page.locator('#save-load-ls').click();

        const stored = await page.evaluate(() => localStorage.getItem('todos'));
        expect(stored).not.toBeNull();

        const parsed = JSON.parse(stored as string);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].task).toBe('Read a book');
        expect(parsed[0].completed).toBe(false);
    });

    test('loads todos from localStorage on a fresh page', async ({ page }) => {
        await page.goto('/todo.html');

        // seed localStorage as if a previous visit had already saved a todo
        await page.evaluate(() => {
            localStorage.setItem(
                'todos',
                JSON.stringify([{ id: 0, task: 'Water the plants', completed: false }])
            );
            localStorage.setItem('todoCounter', '1');
        });

        // reload so the page starts with an empty in-memory `todos` array again
        // (this mirrors what actually happens for a returning visitor)
        await page.reload();
        await expect(page.getByText('Water the plants')).toHaveCount(0);

        // in-memory todos is empty here, so this click hits the *load* branch
        await page.locator('#save-load-ls').click();

        await expect(page.getByText('Water the plants')).toBeVisible();
    });

    test('deleting a later item removes the correct todo, not a wrong one', async ({ page }) => {
        await page.goto('/todo.html');

        const input = page.locator('#task-input');

        // add three todos: ids will be 0, 1, 2 (todoCounter starts at 0)
        await input.fill('Task A');
        await input.press('Enter');
        await input.fill('Task B');
        await input.press('Enter');
        await input.fill('Task C');
        await input.press('Enter');

        await expect(page.getByText('Task A')).toBeVisible();
        await expect(page.getByText('Task B')).toBeVisible();
        await expect(page.getByText('Task C')).toBeVisible();

        // Step 1: delete "Task A" (id 0, array index 0 — id and index match here)
        const checkboxA = page.locator('#list-div input[type="checkbox"]').first();
        await checkboxA.check();
        await page.locator('#delete').click();

        await expect(page.getByText('Task A')).toHaveCount(0);
        await expect(page.getByText('Task B')).toBeVisible();
        await expect(page.getByText('Task C')).toBeVisible();

        // Step 2: now delete "Task C" (id 2, but its array index is now 1,
        // since Task A was removed). The buggy code calls
        // todos.splice(found.id, 1) instead of todos.splice(arrayIndex, 1),
        // so it will try to splice at index 2 on a 2-item array — a no-op.
        const checkboxC = page
        .locator('#list-div > div')
        .filter({ hasText: 'Task C' })
        .locator('input[type="checkbox"]');
        await checkboxC.check();
        await page.locator('#delete').click();

        // This is what SHOULD happen if delete worked correctly:
        await expect(page.getByText('Task C')).toHaveCount(0);
        await expect(page.getByText('Task B')).toBeVisible();
    });
});
