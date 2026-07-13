import { removeAllChilderns, getTextFromTextNode } from './dom.ts';
//import { startTimerForQuestion, stopTimerForQuestion } from './quiz-time.ts';
import { getQuestions, type Question } from './quiz-questions.ts';
// or do 2 lines of imports
//import { getQuestions } from './quiz-questions.ts';
//import type { Question } from './quiz-questions.ts';

const quiz = document.getElementById("quiz");
const questions = getQuestions();
let currentQuestion: number = 0;
let currentScore: number = 0;
let intervalTimerIdPerQuestion: number = 0;
let questionTime: number = 5 * 1000; // 5sec

function startQuiz(event: PointerEvent): void {
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

	let startQuizButton = event.target as HTMLButtonElement;
	startQuizButton.disabled = true;
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
}

if (quiz) {
	quiz.innerHTML = `
		<h1>Hello in quiz game</h1>
		<button id="start">Start Quiz</button>
		<div id="quiz-box"></div>
	`;

	document.getElementById("start")?.addEventListener('click', (e) => startQuiz(e));
}
