
export function removeAllChilderns(el: Node): void {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
}
