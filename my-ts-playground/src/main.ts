import { add } from './math.ts';

let username: string = "John";
let age : number = 21;


const app = document.querySelector("#app");

if (app) {
	if (!username) {
		username = "Mark";
	}
	app.innerHTML = `
		<h1>Hello ${username}</h1>

		<div>I'm ${age} years old</div>
		<div>Proof that 1 + 2 = ${add(1, 2)} works!</div>
	`;
}


