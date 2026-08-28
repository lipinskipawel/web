// import { type DatePair } from './weather-date.ts';
import { fetchFor } from './clients/open-meteo.ts';
import { removeAllChilderns } from './dom.ts';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend, Title, annotationPlugin);

let chartInstance: Chart | null = null;

async function searchCity(cityName: string): Promise<void> {
	fetchFor(cityName, 5)
		.then((json) => {
			if (!isOpenMeteoWeather(json)) {
				console.error(`Response is not OpenMeteoWeather`);
				return;
			}
			// json now is safely typed as OpenMeteoWeather
			let rawHours = json.hourly;
			drawTemperatures(rawHours);
		});
}

interface OpenMeteoWeatherHourly {
	temperature_2m: number[],
	time: string[]
}

interface OpenMeteoWeather {
	hourly: OpenMeteoWeatherHourly
}

interface ChartPoint {
  x: string;
  y: number;
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

function drawTemperatures(weatherData: OpenMeteoWeatherHourly): void {
	const canvas = document.querySelector<HTMLCanvasElement>('#temperature-canvas');
	if (!canvas) {
		console.error('Not canvas found');
		return;
	}

	let temperatures: ChartPoint[] = [];
	for (let i in weatherData.temperature_2m) {
		temperatures[i] = {
			x: weatherData.time[i],
			y: weatherData.temperature_2m[i]
		}
	}
	const nightAnnotations = buildNightAnnotations(weatherData.time);

	const data: any = {
		datasets: [
               {
                   label: "Temperature",
                   data: temperatures,
                   fill: false,
                   borderColor: "rgb(75, 192, 192)",
                   tension: 0.1,
               },
           ],
	};

	if (chartInstance) {
		chartInstance.data.datasets[0].data = temperatures;
		chartInstance.options!.plugins!.annotation!.annotations = nightAnnotations;
		chartInstance.update();
		return;
	}


	const config: any = {
		type: 'line',
		data: data,
		options: {
			responsive: false, // true will not respect the size
			scales: {
				x: {
					type: 'time',
					time: {
						unit: 'day', // bucket ticks by day
						tooltipFormat: 'yyyy-MM-dd HH:mm', // full date still shown on hover
						displayFormats: {
							day: 'yyyy-MM-dd' // how the tick label look itself
						}
					},
					ticks: {
						source: 'auto',
						autoSkip: true,
						maxRotation: 0
					},
					grid: {
						display: true
					}
				},
				y: {
					beginAtZero: false
				}
			},
			plugins: {
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: 'Temperature chart'
				},
				tooltip: {
					mode: 'nearest',
					intersect: false
				},
				annotation: {
					annotations: nightAnnotations
				},
				interaction: {
					mode: 'nearest',
					intersect: false
				}
			}
		},
	};
	chartInstance = new Chart(canvas, config);
}

function buildNightAnnotations(times: string[]): Record<string, any> {
	const annotations: Record<string, any> = {};
	// Get unique calendar days present in the data
	const days = new Set(times.map(t => t.slice(0, 10))); // 'YYYY-MM-DD'

	let i = 0;
	for (const day of days) {
		const nightStart = `${day}T20:00:00`;
		const nightEnd = `${addOneDay(day)}T06:00:00`;

		annotations[`night-${i}`] = {
			type: 'box',
			xMin: nightStart,
			xMax: nightEnd,
			backgroundColor: 'rgba(54, 90, 173, 0.12)',
			borderWidth: 0,
			drawTime: 'beforeDatasetsDraw'
		};
		i++;
	}
	return annotations;
}

function addOneDay(dateStr: string): string {
	const [y, m, d] = dateStr.split('-').map(Number);
	const date = new Date(y, m - 1, d); // local time, no UTC conversion involved
	date.setDate(date.getDate() + 1);

	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

function historySearch(): void {
	const maybeHistorySearch = localStorage.getItem('history-list');
	if (!maybeHistorySearch) {
		return;
	}
	const historySearch = JSON.parse(maybeHistorySearch);
	const historyList = document.querySelector<HTMLDivElement>('#history-list');
	if (!historyList) {
		return;
	}
	removeAllChilderns(historyList);
	for (let i in historySearch) {
		let div = document.createElement('div');
		div.textContent = historySearch[i];
		div.addEventListener('click', (_) => { searchCity(div.textContent); })
		historyList.appendChild(div);
	}
}

function loadSearchHistory(): string[] {
	const maybeHistory = localStorage.getItem('history-list');
	if (!maybeHistory) {
		return [];
	}
	return JSON.parse(maybeHistory);
}

const weather = document.getElementById("weather");

if (weather) {
	weather.innerHTML = `
	  <h1>Welcome in weather application</h1>

	  <div id='city-name'>
	    <label for='city-name-input'>Enter city name</label>
	    <input id='city-name-input' type='text' autofocus/>
	  </div>

	  <div id='search-history'>
	    <h3>Search history</h3>
		<div id='history-list'></div>
	  </div>

	  <div id="temperature-map">
	    <h3>Temperature map</h3>
		<canvas id="temperature-canvas" width="500" height="500"></canvas>
	  </div>
	`;

	const input = document.getElementById("city-name-input");
	// input?.focus(); or this, instead of autofocus on HTML

	input?.addEventListener('keypress', (e) => {
		if (e.key == 'Enter') {
			const target = e.target as HTMLInputElement;
			searchCity(target.value);
			const history = loadSearchHistory();
			if (history.find((e) => e === target.value)) {
				historySearch();
			} else {
			    history.push(target.value);
			    localStorage.setItem('history-list', JSON.stringify(history));
	            historySearch();
			}
		}
	});
	historySearch();
}

