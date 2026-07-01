
export interface Question {
	question: string,
	answers: string[],
	correct: string
}

export function getQuestions(): Array<Question> {
	return [
		{
			"question": "some thing?",
			"answers": ["A", "B", "C"],
			"correct": "B"
		},
		{
			"question": "some another thing?",
			"answers": ["AA", "BB", "CC"],
			"correct": "CC"
		}
	]
}
