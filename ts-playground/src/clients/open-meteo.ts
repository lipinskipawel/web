
function geolocationUrl(cityName: string): string {
	return `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
}

export interface Geolocation {
	latitude: string,
	longitude: string
}

export async function fetchGeolocationFor(cityName: string): Promise<Geolocation> {
	return window.fetch(geolocationUrl(cityName))
	    .then((res) => res.json())
	    .then((res) => res.results[0])
		.then((res) => {
			return { latitude: res.latitude, longitude: res.longitude }
		});
}

function weatherUrl(latitude: string, longitude: string, startDate: string, endDate: string): string {
	return `https://api.open-meteo.com/v1/forecast?
        latitude=${latitude}
        &longitude=${longitude}
        &start_date=${startDate}
        &end_date=${endDate}
        &hourly=temperature_2m`.replaceAll(' ', '');
}

export interface OpenMeteoWeatherHourly {
	temperature_2m: number[],
	time: string[]
}

export interface OpenMeteoWeather {
	hourly: OpenMeteoWeatherHourly
}

export async function fetchWeatherFor(geolocation: Geolocation, days: number): Promise<OpenMeteoWeather> {
	const { startDate, endDate } = startEndDate(new Date(), days);
	const response = await window.fetch(weatherUrl(geolocation.latitude, geolocation.longitude, startDate, endDate));
	const json = await response.json();

	if (!isOpenMeteoWeather(json)) {
		throw new Error("Invalid weather response shape"); // Promise.reject and throw inside async function is the same
	}

	return json;
}

function addDays(date: Date, days: number): Date {
	let result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

interface DatePair {
	startDate: string
	endDate: string
}

function startEndDate(start: Date, days: number): DatePair {
    // yyyy-mm-dd
    let endDate = addDays(start, days).toISOString().split('T')[0].trim();
    let startDate = start.toISOString().split('T')[0].trim();
    return {
        startDate: startDate,
        endDate: endDate
    };
}


// 'data is OpenMeteoWeather'
// it is type predicate, it is normal boolean function in runtime
// but TS uses the return type to narrow the type in whatever branch calls it
function isOpenMeteoWeather(data: unknown): data is OpenMeteoWeather {
	if (typeof data !== 'object' || data === null) {
		return false;
	}

	const v = data as Record<string, unknown>;

	if (typeof v.hourly === 'object') {
		if (isOpenMeteoWeatherHourly(v.hourly)) {
			return true;
		}
	}
	return false;
}

function isOpenMeteoWeatherHourly(data: unknown): boolean {
	if (typeof data !== 'object' || data === null) {
		return false;
	}

	const v = data as Record<string, unknown>;

	if (Array.isArray(v.temperature_2m) && Array.isArray(v.time)) {
		return true;
	}

	return false;
}

