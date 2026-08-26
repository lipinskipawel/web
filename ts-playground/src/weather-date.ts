

function addDays(date: Date, days: number): Date {
	let result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

export interface DatePair {
	startDate: string
	endDate: string
}

export function startEndDate(start: Date, days: number): DatePair {
    // yyyy-mm-dd
	let endDate = addDays(start, days).toISOString().split('T')[0].trim();
    let startDate = start.toISOString().split('T')[0].trim();
	return {
		startDate: startDate,
		endDate: endDate
	};
}

// next to refactor
function fetchFor(days: number) {
	return "sdf";
}
