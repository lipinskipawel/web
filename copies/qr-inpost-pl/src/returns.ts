import { type userAction } from './helper.ts';

export function returns(action: userAction): string {
    switch (action) {
        case 'receive':
            return `
        <div>
          some receive
        </div>
        `;
        case 'return':
            return `
        <div>
          some returns
        </div>
        `;
    }
}
