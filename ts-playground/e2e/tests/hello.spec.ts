import { test, expect } from '@playwright/test';

test.describe('Click counter app', () => {
    test('increases the counter by 1 by default', async ({ page }) => {
        await page.goto('/hello.html');

        await expect(page.locator('#counter')).toHaveText('I will count button clicks 0');

        await page.locator('#inc').click();
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 1');

        await page.locator('#inc').click();
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 2');
    });

    test('decreases the counter but never below 0', async ({ page }) => {
        await page.goto('/hello.html');

        await page.locator('#inc').click(); // clicks = 1
        await page.locator('#dec').click(); // clicks = 0
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 0');

        // clicking decrease again should clamp at 0, not go negative
        await page.locator('#dec').click();
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 0');
    });

    test('reset sets the counter back to 0', async ({ page }) => {
        await page.goto('/hello.html');

        await page.locator('#inc').click();
        await page.locator('#inc').click();
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 2');

        await page.locator('#reset').click();
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 0');
    });

    test('custom step size affects both increase and decrease', async ({ page }) => {
        await page.goto('/hello.html');

        await page.locator('#step-size').fill('5');

        await page.locator('#inc').click(); // clicks = 5
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 5');

        await page.locator('#inc').click(); // clicks = 10
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 10');

        await page.locator('#dec').click(); // clicks = 5
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 5');
    });

    test('invalid or zero step size falls back to a step of 1', async ({ page }) => {
        await page.goto('/hello.html');

        // "abc" -> Number("abc") is NaN -> increase() falls back to stepSize = 1
        await page.locator('#step-size').fill('abc');
        await page.locator('#inc').click();
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 1');

        // "0" -> increase() explicitly resets stepSize to 1 when maybeStepSize == 0
        await page.locator('#step-size').fill('0');
        await page.locator('#inc').click();
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 2');
    });

    test('stores and retrieves click count from localStorage', async ({ page }) => {
        await page.goto('/hello.html');

        await page.locator('#step-size').fill('3');
        await page.locator('#inc').click(); // clicks = 3
        await page.locator('#save-ls').click();

        const stored = await page.evaluate(() => localStorage.getItem('click'));
        expect(stored).toBe('3');

        // reload the page so in-memory `clicks` resets to 0, then load from storage
        await page.reload();
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 0');

        await page.locator('#get-ls').click();
        await expect(page.locator('#counter')).toHaveText('I will count button clicks 3');
    });
});
