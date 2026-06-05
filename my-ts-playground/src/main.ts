import { add } from './math.ts';

let username: string = "John";
let age : number = 21;
let clicks: number = 0;

const app = document.querySelector("#app");

function increase(): void {
	clicks++;
	const counter = document.querySelector("#counter");
	if (counter) {
		counter.textContent = `I will count button clicks ${clicks}`;
	}
}

function decrease(): void {
	clicks--;
	const counter = document.querySelector("#counter");
	if (counter) {
		counter.textContent = `I will count button clicks ${clicks}`;
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
		<button id="inc">Click me</button>
		<button id="dec">Click me</button>
	`;

	const button = document.getElementById("inc");
	button?.addEventListener("click", increase);
	document.getElementById("dec")?.addEventListener("click", decrease);

}


