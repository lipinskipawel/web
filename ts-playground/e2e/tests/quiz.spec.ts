import { test, expect, type Page } from '@playwright/test';
import { getQuestions } from '../../src/quiz-questions';

// Built from the real source of truth, not a hand-copied duplicate.
// If quiz-questions.ts changes, this map updates automatically — no
// separate value to keep in sync, no silent drift between app and test.
const CORRECT_ANSWERS: Record<string, string> = Object.fromEntries(
    getQuestions().map((q) => [q.question, q.correct])
);
const TOTAL_QUESTIONS = Object.keys(CORRECT_ANSWERS).length;

async function startQuiz(page: Page, name: string): Promise<void> {
    await page.locator('#name-input').fill(name);
    await page.locator('#start').click();
}

/**
 * Answers the currently displayed question, then clicks "Next Question".
 * Throws if the on-screen question text isn't recognized, so a mismatch
 * with quiz-questions.ts fails loudly instead of silently picking wrong.
 */
async function answerCurrentQuestion(page: Page, answerCorrectly: boolean): Promise<void> {
    const questionText = (await page.locator('#quiz-box > div').first().textContent())?.trim() ?? '';
    const correctAnswer = CORRECT_ANSWERS[questionText];
    if (!correctAnswer) {
        throw new Error(`Unrecognized question text: "${questionText}"`);
    }

    if (answerCorrectly) {
        await page.locator(`#quiz-box input[value="${correctAnswer}"]`).check();
    } else {
        const radios = page.locator('#quiz-box input[type="radio"]');
        const count = await radios.count();
        for (let i = 0; i < count; i++) {
            const value = await radios.nth(i).getAttribute('value');
            if (value !== correctAnswer) {
                await radios.nth(i).check();
                break;
            }
        }
    }

    await page.getByRole('button', { name: 'Next Question' }).click();
}

test.describe('Quiz app', () => {
    test('cannot start the quiz without entering a name', async ({ page }) => {
        await page.goto('/quiz.html');

        await page.locator('#start').click();

        await expect(page.locator('#name-input')).toHaveClass(/mark/);
        // quiz-box should still be empty — quiz never started
        await expect(page.locator('#quiz-box')).toBeEmpty();
    });

    test('starting the quiz shows the first question and hides the name input', async ({ page }) => {
        await page.goto('/quiz.html');

        await startQuiz(page, 'Alice');

        await expect(page.locator('#name-input')).toHaveClass(/hidden/);
        await expect(page.locator('#start')).toBeDisabled();
        await expect(page.locator('#quiz-box input[type="radio"]')).toHaveCount(3);
    });

    test('answering every question correctly gives a perfect score', async ({ page }) => {
        await page.goto('/quiz.html');
        await startQuiz(page, 'Alice');

        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            await answerCurrentQuestion(page, true);
        }

        await expect(page.getByText(`Your score is ${TOTAL_QUESTIONS}/${TOTAL_QUESTIONS}`)).toBeVisible();
        // start button and name input should reset, ready for another attempt
        await expect(page.locator('#start')).toBeEnabled();
        await expect(page.locator('#name-input')).toHaveValue('');
    });

    test('answering every question incorrectly gives a score of 0', async ({ page }) => {
        await page.goto('/quiz.html');
        await startQuiz(page, 'Bob');

        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            await answerCurrentQuestion(page, false);
        }

        await expect(page.getByText(`Your score is 0/${TOTAL_QUESTIONS}`)).toBeVisible();
    });

    test('high score table lists past attempts sorted by score, highest first', async ({ page }) => {
        await page.goto('/quiz.html');

        // first run: perfect score
        await startQuiz(page, 'Alice');
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            await answerCurrentQuestion(page, true);
        }
        await expect(page.getByText(`Your score is ${TOTAL_QUESTIONS}/${TOTAL_QUESTIONS}`)).toBeVisible();

        // second run: zero score
        await startQuiz(page, 'Bob');
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            await answerCurrentQuestion(page, false);
        }
        await expect(page.getByText(`Your score is 0/${TOTAL_QUESTIONS}`)).toBeVisible();

        const entries = page.locator('#quiz-box li');
        await expect(entries).toHaveCount(2);
        await expect(entries.nth(0)).toHaveText(`Alice with: ${TOTAL_QUESTIONS}`);
        await expect(entries.nth(1)).toHaveText('Bob with: 0');
    });
});
