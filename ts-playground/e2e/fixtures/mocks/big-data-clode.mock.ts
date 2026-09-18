import { type Page } from '@playwright/test';

export const REVERSE_GEOCODE_PATTERN = '**/api.bigdatacloud.net/data/reverse-geocode-client**';

export function fakeReverseGeoCodeResponse() {
    return {
        city: 'Warsaw'
    };
}

export interface ReverseGeocodeApiMockRecorder {
    geocodingRequestUrls: string[];
}

export async function mockSuccessfulReverseGeolocation(page: Page): Promise<WeatherApiMockRecorder> {
    const recorder: ReverseGeocodeApiMockRecorder = {
        reverseGeocodeUrls: []
    };

    await page.route(REVERSE_GEOCODE_PATTERN, async (route) => {
        recorder.reverseGeocodeUrls.push(route.request().url());
        await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify(fakeReverseGeoCodeResponse()),
        });
    });

    return recorder;
}
