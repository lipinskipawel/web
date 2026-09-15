
// https://www.slingacademy.com/article/using-localstorage-with-typescript-developers-guide/
export function getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
}

export function setItem<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
}
