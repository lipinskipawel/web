
export function removeAllChilderns(el: Node): void {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
}

export function getTextFromTextNode(node: Node | null): string | undefined {
	if (node == null) {
		return undefined;
	}
	return Array.from(node.childNodes)
		.find((it): it is Text => it.nodeType === Node.TEXT_NODE)
		?.textContent;
}
