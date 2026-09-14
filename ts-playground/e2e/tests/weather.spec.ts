import { test, expect, type Page } from '@playwright/test';
import {
    WEATHER_PATTERN,
    mockSuccessfulWeatherApi,
    mockMalformedWeatherResponse,
} from '../fixtures/mocks/weather-api.mock';

async function searchFor(page: Page, city: string): Promise<void> {
    const input = page.locator('#city-name-input');
    await input.fill(city);
    await input.press('Enter');
}

test.describe('Weather app', () => {
    test('searching a city calls geolocation then weather, and renders the chart', async ({ page }) => {
        const mock = await mockSuccessfulWeatherApi(page);
        await page.goto('/weather.html');

        // waitForResponse must be armed BEFORE the action that triggers it,
        // otherwise the response can land before we start listening for it.
        const weatherResponse = page.waitForResponse(WEATHER_PATTERN);
        await searchFor(page, 'Warsaw');
        await weatherResponse;

        // The canvas element itself proves nothing here — it's in the static
        // HTML from page load, before any search happens. Waiting on the
        // network response above is what actually proves the async chain ran.
        await expect(page.locator('#temperature-canvas')).toBeVisible();
        // confirms the geolocation result actually got threaded into the weather request,
        // not just that "some request happened"
        expect(mock.geocodingRequestUrls[0]).toContain('name=Warsaw');
        expect(mock.weatherRequestUrls[0]).toContain('latitude=52.52');
        expect(mock.weatherRequestUrls[0]).toContain('longitude=13.405');
    });

    test('adds a searched city to history, and does not duplicate repeat searches', async ({ page }) => {
        await mockSuccessfulWeatherApi(page);
        await page.goto('/weather.html');

        await searchFor(page, 'Berlin');
        await searchFor(page, 'Berlin');

        await expect(page.locator('#history-list > div')).toHaveCount(1);
        await expect(page.locator('#history-list')).toHaveText('Berlin');
    });

    test('clicking a history entry re-triggers a search for that city', async ({ page }) => {
        const mock = await mockSuccessfulWeatherApi(page);
        await page.goto('/weather.html');

        await searchFor(page, 'Paris');
        expect(mock.geocodingRequestUrls.filter((url) => url.includes('name=Paris'))).toHaveLength(1);

        await page.locator('#history-list', { hasText: 'Paris' }).click();

        // clicking history triggers searchCity() without await too, so poll
        // for the eventual second request rather than asserting immediately
        await expect
        .poll(() => mock.geocodingRequestUrls.filter((url) => url.includes('name=Paris')).length)
        .toBe(2);
    });

    test('search history persists after a page reload', async ({ page }) => {
        await mockSuccessfulWeatherApi(page);
        await page.goto('/weather.html');

        await searchFor(page, 'Tokyo');
        await expect(page.locator('#history-list')).toHaveText('Tokyo');

        await page.reload();

        await expect(page.locator('#history-list')).toHaveText('Tokyo');
    });

    test('a malformed weather response does not crash the page, and history still updates', async ({ page }) => {
        // This checks that searchCity() is called WITHOUT await in the
        // Enter-key handler: the history push happens synchronously right
        // after, regardless of whether the async weather fetch succeeds,
        // fails, or is still pending.
        const pageErrors: Error[] = [];
        await mockMalformedWeatherResponse(page);

        await page.goto('/weather.html');
        page.on('pageerror', (err) => pageErrors.push(err));

        await searchFor(page, 'Atlantis');

        await expect(page.locator('#history-list')).toHaveText('Atlantis');
        expect(pageErrors).toHaveLength(0);
    });
});
