import './main.css';
import { isUserAction } from './helper.ts';
import { type userAction } from './helper.ts';
import { returns } from './returns.ts';
import { generate } from './generate.ts';
import { removeAllChilderns } from './utils.ts';

let state : userAction = 'receive'

const main = document.getElementById('main');

function userActionClick(button: HTMLButtonElement): void {
    const selectedAction = button.id;

    if (!isUserAction(selectedAction)) {
        console.error('not a user action');
        return;
    }

    if (state === selectedAction) {
        return;
    } else {
        const firstDiv = document.querySelector<HTMLDivElement>('#first');
        const secondDiv = document.querySelector<HTMLDivElement>('#second');
        if (!(firstDiv && secondDiv)) {
            console.error('can not find container');
            return;
        }
        removeAllChilderns(firstDiv);
        removeAllChilderns(secondDiv);

        generate(selectedAction, firstDiv);
        returns(selectedAction, secondDiv);

        document.querySelectorAll<HTMLButtonElement>('button[switchable]')?.forEach(element => {
            element.addEventListener('click', (event) => {
                // event == PointerEvent
                const button = event.target as HTMLButtonElement;
                userActionClick(button);
            });
        });
        state = selectedAction;
        button.value = "";
    }
}

if (main) {
    main.innerHTML = `
      <div id='content'>
        <div id='first'></div>
        <div id='second'></div>
      </div>
    `;

    const first = document.getElementById('first');
    const second = document.getElementById('second');

    if (!(first && second)) {
        throw new Error('can not find #first #second');
    }

    generate(state, first);
    returns(state, second);

    document.querySelectorAll<HTMLButtonElement>('div button[switchable]')?.forEach(element => {
        element.addEventListener('click', (event) => {
            // event == PointerEvent
            const button = event.target as HTMLButtonElement;
            userActionClick(button);
        });
    });
}
