
const todo = document.getElementById("todo");

interface Todo {
	id: number,
	task: string,
	completed: boolean
}
let todos: Todo[] = [];

// function deleteTasks(event: PointerEvent): void {
function deleteTasks(): void {
	const listDiv = document.getElementById("list-div");
	if (listDiv) {
		let childrens = listDiv.childNodes;
		for (let node of childrens) {
			let checkbox = node.firstChild as HTMLInputElement;
			let rawId = checkbox.id.replace("-inner-list", "");
			if (checkbox.checked) {
				let found = todos
					.filter(it => it.completed === false)
					.find(it => it.id === Number(rawId));
				if (found) {
					todos.splice(found?.id, 1);
				}
			}
		}
		renderList();
	}
}

function completeTasks(): void {
	const listDiv = document.getElementById("list-div");
	if (listDiv) {
		let childrens = listDiv.childNodes;
		for (let child of childrens) {
			let checkbox = child.firstChild as HTMLInputElement;
			let rawId = checkbox.id.replace("-inner-list", "");
			let current = todos.find(it => it.id === Number(rawId));
			if (current) {
				current.completed = checkbox.checked;
			}
		}
		renderList();
	}
}

function taskReader(event: KeyboardEvent): void {
	if (event.key == "Enter" && event.target instanceof HTMLInputElement) {
		todos.push({
			id: todos.length,
			task: event.target.value,
			completed: false
		} as Todo);
		event.target.value = "";
		renderList();
	}
}

function renderList(): void {
	const listDiv = document.getElementById("list-div");
	while (listDiv?.firstChild) {
		listDiv.removeChild(listDiv.firstChild);
	}
	if (listDiv) {
		for (let todo of todos) {
			console.log(`What is idx: ${JSON.stringify(todo, null, 4)}`);
			const checkbox = Object.assign(document.createElement("input"), {
				id: `${todo.id}-inner-list`,
				type: 'checkbox',
				checked: todo.completed
			}) as HTMLInputElement;
			const label = Object.assign(document.createElement("label"), {
				htmlFor: `${todo.id}-inner-list`,
				textContent: `${todo.task}`
			}) as HTMLLabelElement;


			const wrapperDiv = document.createElement("div");
			wrapperDiv.appendChild(checkbox);
			if (todo.completed) {
				const s = document.createElement("s");
				s.appendChild(label);
				wrapperDiv.appendChild(s);
			} else {
				wrapperDiv.appendChild(label);
			}
			listDiv.appendChild(wrapperDiv);
		}
	}
}

if (todo) {
	todo.innerHTML = `
		<h1>Hello inside the TODO app</h1>
		<div>Add you new tasks</div>
		<input type="text" id="task-input"/>
		<button id="delete">Delete checked tasks</button>
		<button id="complete">Complete checked tasks</button>
		<span></span>
		<div id="list-div"></div>
	`;

	renderList();
	document.getElementById("delete")?.addEventListener("click", deleteTasks);
	document.getElementById("complete")?.addEventListener("click", completeTasks);
	document.getElementById("task-input")?.addEventListener("keypress", (event) => {
		taskReader(event);
	});
}
