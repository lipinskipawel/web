import './main.css';
import { isUserAction } from './helper.ts';
import { type userAction } from './helper.ts';
import { returns } from './returns.ts';
import { generate } from './generate.ts';
import { removeAllChilderns } from './utils.ts';

let state : userAction = 'receive'

const main = document.getElementById('main');

// maybe I should pass HTMLDivElement to the `generate` and `returns`
// so the "components" can mutate the state directly on the parent div
// and potentally register event listener
function userActionClick(button: HTMLButtonElement): void {
    const selectedAction = button.id;

    if (!isUserAction(selectedAction)) {
        console.error('not a user action');
        return;
    }

    if (state === selectedAction) {
        return;
    } else {
        const firstDiv = document.querySelector('#first');
        const secondDiv = document.querySelector('#second');
        if (!(firstDiv && secondDiv)) {
            console.error('can not find container');
            return;
        }
        removeAllChilderns(firstDiv);
        removeAllChilderns(secondDiv);

        firstDiv.innerHTML = generate(selectedAction);
        secondDiv.innerHTML = returns(selectedAction);

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
    const first = generate(state);
    const second = returns(state);

    main.innerHTML = `
      <div id='content'>
        <div id='first'>
          ${first}
        </div>
        <div id='second'>
          ${second}
        </div>
      </div>
    `;

    document.querySelectorAll<HTMLButtonElement>('div button[switchable]')?.forEach(element => {
        element.addEventListener('click', (event) => {
            // event == PointerEvent
            const button = event.target as HTMLButtonElement;
            userActionClick(button);
        });
    });
}
