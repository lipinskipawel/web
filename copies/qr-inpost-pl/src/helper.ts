
export type userAction = 'receive' | 'return';

export function isUserAction(value: string): value is userAction {
    return value === 'receive' || value === 'return'
}
