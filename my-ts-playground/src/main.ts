import { add } from './math.ts';

let username: string = "John";
let age : number = 21;
let clicks: number = 0;
let stepSize: number = 1;

const app = document.querySelector("#app");

let lsClicks = localStorage.getItem("clicks");

function increase(): void {
	const maybeInput = document.getElementById("step-size") as HTMLInputElement;
	const maybeStepSize = Number(maybeInput?.value);
	if (!Number.isNaN(maybeStepSize)) {
		if (maybeStepSize == 0) {
			stepSize = 1;
		} else {
			stepSize = maybeStepSize;
	    }
	} else {
		stepSize = 1;
	}
	clicks += stepSize;
	const counter = document.querySelector("#counter");
	if (counter) {
		counter.textContent = `I will count button clicks ${clicks}`;
	}
}

function decrease(): void {
	clicks -= stepSize;
	if (clicks < 0) {
		clicks = 0;
	}
	const counter = document.querySelector("#counter");
	if (counter) {
		counter.textContent = `I will count button clicks ${clicks}`;
	}
}

function reset(): void {
	clicks = 0;
	const counter = document.querySelector("#counter");
	if (counter) {
		counter.textContent = `I will count button clicks ${clicks}`;
	}
}

function storeClicks(): void {
	localStorage.setItem("click", String(clicks));
}

function getClicks(): void {
	let fromLs = Number(localStorage.getItem("click"));
	if (!Number.isNaN(fromLs)) {
		clicks = fromLs;
		const counter = document.querySelector("#counter");
		if (counter) {
			counter.textContent = `I will count button clicks ${clicks}`;
		}
	}
}

if (app) {
	if (!username) {
		username = "Mark";
	}
	app.innerHTML = `
		<h1>Hello ${username}</h1>

		<div>I'm ${age} years old</div>
		<div>Proof that 1 + 2 = ${add(1, 2)} works!</div>
		<span></span>
		<div id="counter">I will count button clicks ${clicks}</div>
		<button id="inc">Inc button</button>
		<button id="dec">Dec button</button>
		<button id="reset">Reset button</button>
		<div>Step size</div>
		<input id="step-size"/>
		<button id="save-ls">Store clicks in localStorage</button>
		<button id="get-ls">Get from localStorage</button>
	`;

	const button = document.getElementById("inc");
	button?.addEventListener("click", increase);
	document.getElementById("dec")?.addEventListener("click", decrease);
	document.getElementById("reset")?.addEventListener("click", reset);
	document.getElementById("save-ls")?.addEventListener("click", storeClicks);
	document.getElementById("get-ls")?.addEventListener("click", getClicks);
}

