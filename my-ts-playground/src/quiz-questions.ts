
export interface Question {
	question: string,
	answers: string[],
	correct: string
}

const shuffle = (array: Question[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

export function getQuestions(): Array<Question> {
	return shuffle([
		{
			"question": "some thing?",
			"answers": ["A", "B", "C"],
			"correct": "B"
		},
		{
			"question": "some more questions?",
			"answers": ["house", "car", "bike"],
			"correct": "car"
		},
		{
			"question": "what colour is sky?",
			"answers": ["blue", "red", "dark"],
			"correct": "blue"
		},
		{
			"question": "some another thing?",
			"answers": ["AA", "BB", "CC"],
			"correct": "CC"
		}
	]);
}
