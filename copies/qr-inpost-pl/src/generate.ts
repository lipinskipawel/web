import { type userAction } from './helper.ts';

export function generate(action: userAction): string {
    switch (action) {
        case 'receive':
            return `
        <div class="first">Generate receive</div>
        <button id="receive" switchable>receive</button>
        <button id="return" switchable>return</button>
        `;
        case 'return':
            return `
        <div class="first">Generate return</div>
        <button id="receive" switchable>receive</button>
        <button id="return" switchable>return</button>
        `;
    }
}
