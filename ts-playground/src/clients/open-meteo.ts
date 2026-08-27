
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

function geolocationUrl(cityName: string): string {
	return `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
}

function weatherUrl(latitude: string, longitude: string, startDate: string, endDate: string): string {
	return `https://api.open-meteo.com/v1/forecast?
        latitude=${latitude}
        &longitude=${longitude}
        &start_date=${startDate}
        &end_date=${endDate}
        &hourly=temperature_2m`.replaceAll(' ', '');
}

export async function fetchFor(cityName: string, days: number): Promise<string> {
	const geolocationResponse = await window.fetch(geolocationUrl(cityName));
	const body = await geolocationResponse.json();
	const {latitude, longitude} = body.results[0];

	const { startDate, endDate } = startEndDate(new Date(), days);
	const response = await window.fetch(weatherUrl(latitude, longitude, startDate, endDate));
	return await response.json();
}

