
const todo = document.getElementById("todo");
let todoCounter: number = Number(localStorage.getItem("todoCounter"));
let hideShowToggle: boolean = false;

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
			if (!checkbox.checked) {
				continue;
			}
			let rawId = checkbox.id.replace("-inner-list", "");
			if (checkbox.checked) {
				let found = todos
					.find(it => it.id === Number(rawId));
				if (found) {
					todos.splice(found?.id, 1);
				}
			}
		}
		renderList(hideShowToggle);
	}
}

function completeTasks(): void {
	const listDiv = document.getElementById("list-div");
	if (listDiv) {
		let childrens = listDiv.childNodes;
		for (let child of childrens) {
			let checkbox = child.firstChild as HTMLInputElement;
			if (!checkbox.checked) {
				continue;
			}
			let rawId = checkbox.id.replace("-inner-list", "");
			let current = todos.find(it => it.id === Number(rawId));
			if (current) {
				current.completed = checkbox.checked;
			}
		}
		renderList(hideShowToggle);
	}
}

function hideShow(): void {
	hideShowToggle = !hideShowToggle;
	renderList(hideShowToggle);
}

function taskReader(event: KeyboardEvent): void {
	if (event.key == "Enter" && event.target instanceof HTMLInputElement) {
		todos.push({
			id: todoCounter++,
			task: event.target.value,
			completed: false
		} as Todo);
		event.target.value = "";
		renderList(hideShowToggle);
	}
}

function saveLoadLocalStorage(): void {
	if (todos.length !== 0) {
		localStorage.setItem("todos", JSON.stringify(todos));
		localStorage.setItem("todoCounter", String(todoCounter));
	} else {
		let maybeTodos = localStorage.getItem("todos");
		if (maybeTodos) {
			todos = JSON.parse(maybeTodos);
		}
	}
	renderList(hideShowToggle);
}

function renderList(hideCompleted: boolean): void {
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
				checked: false
			}) as HTMLInputElement;
			const label = Object.assign(document.createElement("label"), {
				htmlFor: `${todo.id}-inner-list`,
				textContent: `${todo.task}`
			}) as HTMLLabelElement;


			if (drawTodo(todo, hideCompleted)) {
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
}

function drawTodo(todo: Todo, toggle: boolean): boolean {
	return toggle == false || !todo.completed;
}

if (todo) {
	todo.innerHTML = `
		<h1>Hello inside the TODO app</h1>
		<div>Add you new tasks</div>
		<input type="text" id="task-input"/>
		<button id="save-load-ls">Save or load from local storage</button>
		<button id="delete">Delete checked tasks</button>
		<button id="complete">Complete checked tasks</button>
		<button id="hide-show">Hide/Show completed tasks</button>
		<span></span>
		<div id="list-div"></div>
	`;

	renderList(hideShowToggle);
	document.getElementById("save-load-ls")?.addEventListener("click", saveLoadLocalStorage);
	document.getElementById("delete")?.addEventListener("click", deleteTasks);
	document.getElementById("complete")?.addEventListener("click", completeTasks);
	document.getElementById("hide-show")?.addEventListener("click", hideShow);
	document.getElementById("task-input")?.addEventListener("keypress", (event) => {
		taskReader(event);
	});
}
