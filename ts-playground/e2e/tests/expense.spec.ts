import { test, expect, type Page } from '@playwright/test';

type EntryType = 'income' | 'expense';

async function addEntry(
    page: Page,
    type: EntryType,
    fields: { name?: string; date?: string; category?: string; amount: string }
): Promise<void> {
    if (fields.name) await page.locator(`#${type}-name`).fill(fields.name);
    if (fields.date) await page.locator(`#${type}-date`).fill(fields.date);
    if (fields.category) await page.locator(`#${type}-category`).selectOption(fields.category);

    const amountInput = page.locator(`#${type}-amount`);
    await amountInput.fill(fields.amount);
    await amountInput.press('Enter');
}

test.describe('Expense tracker', () => {
    test('starts with a zero balance and an empty history', async ({ page }) => {
        await page.goto('/expense.html');

        await expect(page.locator('#balance')).toHaveText('Your balance 0');
        await expect(page.locator('#transactions tbody tr')).toHaveCount(0);
    });

    test('adding income increases the balance', async ({ page }) => {
        await page.goto('/expense.html');

        await addEntry(page, 'income', { amount: '150' });

        await expect(page.locator('#balance')).toHaveText('Your balance 150');
    });

    test('adding an expense decreases the balance', async ({ page }) => {
        await page.goto('/expense.html');

        await addEntry(page, 'expense', { amount: '40' });

        await expect(page.locator('#balance')).toHaveText('Your balance -40');
    });

    test('an invalid amount is rejected and marks the field', async ({ page }) => {
        await page.goto('/expense.html');

        await addEntry(page, 'expense', { amount: 'not-a-number' });

        await expect(page.locator('#expense-amount')).toHaveClass(/mark/);
        await expect(page.locator('#transactions tbody tr')).toHaveCount(0);
        await expect(page.locator('#balance')).toHaveText('Your balance 0');
    });

    test('the history table shows the entered transaction details', async ({ page }) => {
        await page.goto('/expense.html');

        await addEntry(page, 'income', {
            name: 'Freelance Gig',
            date: '2024-03-10',
            category: 'Salary',
            amount: '500',
        });

        const row = page.locator('#transactions tbody tr').first();
        await expect(row.locator('td').nth(0)).toHaveText('Freelance Gig');
        await expect(row.locator('td').nth(1)).toHaveText('Salary');
        await expect(row.locator('td').nth(2)).toHaveText('2024-03-10');
        await expect(row.locator('td').nth(3)).toHaveText('500.00');
    });

    test('the monthly statement groups same-month transactions and totals them', async ({ page }) => {
        await page.goto('/expense.html');

        await addEntry(page, 'income', { date: '2024-01-05', amount: '1000' });
        await addEntry(page, 'expense', { date: '2024-01-20', amount: '200' });

        // Only one month is involved, so exactly one summary row is expected.
        const monthlyRows = page.locator('#monthly-statement tbody tr');
        await expect(monthlyRows).toHaveCount(1);
        await expect(monthlyRows.first().locator('td').nth(1)).toHaveText('800');
    });

    test('balance and history persist after a page reload', async ({ page }) => {
        await page.goto('/expense.html');

        await addEntry(page, 'income', { amount: '250' });
        await expect(page.locator('#balance')).toHaveText('Your balance 250');

        await page.reload();

        await expect(page.locator('#balance')).toHaveText('Your balance 250');
        await expect(page.locator('#transactions tbody tr')).toHaveCount(1);
    });

    test('adding a transaction does not throw a runtime error while updating the chart', async ({ page }) => {
        // This intentionally does NOT assert anything about the chart's visual
        // output — that's Chart.js's own responsibility, not ours. It only
        // proves our integration code (drawTransactionChart) runs without
        // crashing when given real transaction data.
        const pageErrors: Error[] = [];
        page.on('pageerror', (err) => pageErrors.push(err));

        await page.goto('/expense.html');
        await addEntry(page, 'income', { amount: '75' });
        await addEntry(page, 'expense', { amount: '20' });

        await expect(page.locator('#transaction-chart')).toBeVisible();
        expect(pageErrors).toHaveLength(0);
    });
});
