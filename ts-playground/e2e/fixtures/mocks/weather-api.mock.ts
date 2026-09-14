import { type Page } from '@playwright/test';

export const GEOCODING_PATTERN = '**/geocoding-api.open-meteo.com/**';
export const WEATHER_PATTERN = '**/api.open-meteo.com/**';

export function fakeGeolocationResponse() {
    return {
        results: [{ latitude: 52.52, longitude: 13.405 }],
    };
}

export function fakeWeatherResponse() {
    return {
        hourly: {
            temperature_2m: [10, 11, 12],
            time: [
                '2026-01-01T00:00',
                '2026-01-01T01:00',
                '2026-01-01T02:00',
            ],
        },
    };
}

export interface WeatherApiMockRecorder {
    geocodingRequestUrls: string[];
    weatherRequestUrls: string[];
}

/**
 * Mocks both Open-Meteo endpoints with well-formed, successful responses.
 * Records every request URL sent to each endpoint, so tests can assert on
 * what was actually sent (e.g. the city name, or coordinates forwarded from
 * the geolocation response into the weather request) rather than only
 * "some request happened".
 */
export async function mockSuccessfulWeatherApi(page: Page): Promise<WeatherApiMockRecorder> {
    const recorder: WeatherApiMockRecorder = {
        geocodingRequestUrls: [],
        weatherRequestUrls: [],
    };

    await page.route(GEOCODING_PATTERN, async (route) => {
        recorder.geocodingRequestUrls.push(route.request().url());
        await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify(fakeGeolocationResponse()),
        });
    });

    await page.route(WEATHER_PATTERN, async (route) => {
        recorder.weatherRequestUrls.push(route.request().url());
        await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify(fakeWeatherResponse()),
        });
    });

    return recorder;
}

/**
 * Mocks geolocation successfully but returns a malformed weather payload
 * (missing "hourly"), so fetchWeatherFor()'s isOpenMeteoWeather() check
 * fails and searchCity()'s catch block is exercised.
 */
export async function mockMalformedWeatherResponse(page: Page): Promise<void> {
    await page.route(GEOCODING_PATTERN, async (route) => {
        await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify(fakeGeolocationResponse()),
        });
    });

    await page.route(WEATHER_PATTERN, async (route) => {
        await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({ unexpected: 'shape' }),
        });
    });
}
