import './quiz.css';
import { removeAllChilderns, getTextFromTextNode } from './dom.ts';
import { getQuestions, type Question } from './quiz-questions.ts';
// or do 2 lines of imports
//import { getQuestions } from './quiz-questions.ts';
//import type { Question } from './quiz-questions.ts';

const quiz = document.getElementById("quiz");
const questions = getQuestions();
let currentQuestion: number = 0;
let currentScore: number = 0;
let intervalTimerIdPerQuestion: number = 0;
let questionTime: number = 5 * 1000;

interface ScoreTable {
	name: string,
	score: number
};
let highScoreTable: ScoreTable[] = [];
let name: string;

//function startQuiz(event: PointerEvent): void {
function startQuiz(): void {
	let nameInput = document.getElementById("name-input") as HTMLInputElement;
	if (nameInput) {
		if (nameInput.value === '') {
			//alert('Provide your name to start the quiz');
			nameInput.classList.toggle("mark");
			return;
		}
		name = nameInput.value;
		nameInput.classList.toggle("hidden");
	}

	//let startQuizButton = event.target as HTMLButtonElement;
	let startQuizButton = document.getElementById("start") as HTMLButtonElement;
	if (!startQuizButton) {
		return;
	}
	startQuizButton.disabled = true;

	// reset state
	currentScore = 0;
	currentQuestion = 0;
	if (questions.length === 0) {
		console.log("No quiz for you");
		return;
	}
	let current = questions[currentQuestion];
	if (!current) {
		console.log("How come no questions?");
		return;
	}

	let quizBox = document.getElementById("quiz-box") as HTMLDivElement;
	if (quizBox == null) {
		console.log("ups");
		return;
	}
	buildQuiz(quizBox, current);
}

function buildQuiz(wrapperDiv: HTMLDivElement, current: Question): void {
	console.log("building quiz");
	console.log(`Current question ${JSON.stringify(current)}`);
	removeAllChilderns(wrapperDiv);
	let questionTitle = document.createElement("div");
	let options = document.createElement("div");

	questionTitle.textContent = current.question;
	buildPossibleAnswer(options, current.answers);

	let next = document.createElement("button");
	next.textContent = 'Next Question';
	next.addEventListener('click', (_) => nextQuestion(
		wrapperDiv,
		questions
	));
	let timeLeftToAnswer = document.createElement("div");
	startIntervalTimer(timeLeftToAnswer, wrapperDiv);

	wrapperDiv.appendChild(questionTitle);
	wrapperDiv.appendChild(options);
	wrapperDiv.appendChild(next);
	wrapperDiv.appendChild(timeLeftToAnswer);
}

function startIntervalTimer(timerDiv: Element, wrapperDiv: HTMLDivElement): void {
	// reset state
	questionTime = 5000;
	intervalTimerIdPerQuestion = 0;

	timerDiv.textContent = `Time to answer: ${questionTime}`;
	intervalTimerIdPerQuestion = setInterval(timer, 1000, timerDiv, wrapperDiv);
	console.log(`Starting the timer per question: ${intervalTimerIdPerQuestion}`);
}

function timer(div: HTMLDivElement, mainDiv: HTMLDivElement): void {
	if (questionTime === 0) {
		removeAllChilderns(div);
		nextQuestion(mainDiv, questions);
		return;
	}
	questionTime -= 1000;
	div.textContent = `Time to answer: ${questionTime}`;
}

function buildPossibleAnswer(options: HTMLElement, allAnswers: string[]): void {
	removeAllChilderns(options);
	for (let an of allAnswers) {
		let div = document.createElement("div");
		let label = document.createElement("label");
		let radio = document.createElement("input");
		radio.type = 'radio';
		radio.name = 'one-answer';

		label.appendChild(radio);
		label.appendChild(document.createTextNode(an));

		div.appendChild(label);
		options.appendChild(div);
	}
}

function nextQuestion(
	mainDiv: HTMLDivElement,
	questions: Question[]
): void {
	console.log(`On click [next question]: currentCounter = ${currentQuestion}`);
	examineAnswer();

	let nextQuestion = questions[++currentQuestion];
	if (!nextQuestion) {
		console.log("This was last question");
		clearIntervalTimer();
		scoreDisplay(mainDiv, questions);
		return;
	}
	clearIntervalTimer();
	buildQuiz(mainDiv, nextQuestion);
}

function clearIntervalTimer(): void {
	if (intervalTimerIdPerQuestion != 0) {
		console.log(`Clearing the timer per question: ${intervalTimerIdPerQuestion}`);
		clearInterval(intervalTimerIdPerQuestion);
		intervalTimerIdPerQuestion = 0;
	}
}

function examineAnswer(): void {
	let selected = document.querySelector<HTMLInputElement>('input[name="one-answer"]:checked');
	if (!selected) {
		console.log("nothing was selected");
		return;
	}
	let label = selected.parentNode;
	let textNode = getTextFromTextNode(label);

	let correctAnswer = questions[currentQuestion]!.correct;
	console.log(`You selected -->${textNode}<--`);
	console.log(`Correct answer -->${correctAnswer}<--`);
	if (correctAnswer === textNode) {
		console.log("Correct!!");
		currentScore++;
	}
}

function scoreDisplay(div: HTMLDivElement, quiz: Question[]): void {
	removeAllChilderns(div);
	let h1 = document.createElement("h1");
	h1.textContent = `Your score is ${currentScore}/${quiz.length}`;
	div.appendChild(h1);
	let startQuiz = document.getElementById("start") as HTMLButtonElement;
	startQuiz.disabled = false;
	let nameInput = document.getElementById("name-input") as HTMLInputElement;
	nameInput.classList.toggle("hidden");
	nameInput.classList.remove("mark");
	nameInput.value = '';

	highScoreTable.push({
		name: name,
		score: currentScore
	});
	scoreTableDisplay(div);
}

function scoreTableDisplay(div: HTMLDivElement): void {
	if (highScoreTable.length === 0) {
		return;
	}
	let scoreTable = document.createElement("div");
	let title = document.createElement("h1");
	title.textContent = "High score";
	highScoreTable.sort((a, b) => b.score - a.score);

	let ul = document.createElement("ul");
	for (let el of highScoreTable) {
		let li = document.createElement("li");
		li.textContent = `${el.name} with: ${el.score}`;
		ul.appendChild(li);
	}

	scoreTable.appendChild(title);
	scoreTable.appendChild(ul);
	div.appendChild(scoreTable);
}

if (quiz) {
	quiz.innerHTML = `
		<h1>Hello in quiz game</h1>
		<button id="start">Start Quiz</button>
		<input id="name-input" type="text" placeholder="Your name"/>
		<div id="quiz-box"></div>
	`;

	//document.getElementById("start")?.addEventListener('click', (e) => startQuiz(e));
	document.getElementById("start")?.addEventListener('click', startQuiz);
	document.getElementById("name-input")?.addEventListener('keypress', (e) => {
		if (e.key == 'Enter') {
			startQuiz();
		}
	});
}
