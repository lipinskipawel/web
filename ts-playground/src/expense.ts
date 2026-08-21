import './expense.css';
import { removeAllChilderns } from './dom.ts';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const expense = document.getElementById("expense");

interface Transaction {
	name: string,
	category: string,
	date: string,
	amount: number
}

let transactions: Transaction[] = loadTransactions();
let chartInstance: Chart | null = null;

function loadTransactions(): Transaction[] {
	let maybeTransactions = localStorage.getItem("transactions");
	if (maybeTransactions) {
		return JSON.parse(maybeTransactions);
	} else {
		return [];
	}
}

function saveTransaction(txn: Transaction): void {
	transactions.push(txn);
	localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction(event: KeyboardEvent, label: string): void {
	if (event.key == 'Enter' && event.target instanceof HTMLInputElement) {
		const transactionName = document.querySelector<HTMLInputElement>(`#${label}-name`);
		const transactionCategory = document.querySelector<HTMLInputElement>(`#${label}-category`);
		const transactionDate = document.querySelector<HTMLInputElement>(`#${label}-date`);
		const transactionAmount = document.querySelector<HTMLInputElement>(`#${label}-amount`);
		if (!transactionName || !transactionCategory || !transactionDate || !transactionAmount) {
			return;
		}
		let amount = Number(transactionAmount?.value?.replace(",", "."));
		if (Number.isNaN(amount)) {
			transactionAmount.classList.add('mark');
			return;
		}
		saveTransaction({
			name: transactionName?.value,
			category: transactionCategory?.value,
			date: transactionDate.value,
			amount: label == 'expense' ? -amount : amount
		})
		transactionAmount.classList.remove('mark');
		event.target.value = "";
		updateBalance();
		updateMonthlyStatement();
		historyList(transactions);
		drawTransactionChart(transactions);
	}
}

function historyList(transactions: Transaction[]): void {
	const table = document.querySelector<HTMLTableElement>("#transactions");
	if (table) {
		removeAllChilderns(table);
		const thead: HTMLTableSectionElement = table.createTHead();
		const headerRow: HTMLTableRowElement = thead.insertRow();
		["Name", "Category", "Date", "Amount"].forEach((headerText) => {
			const th: HTMLTableCellElement = document.createElement("th");
			th.textContent = headerText;
			headerRow.appendChild(th);
		});

		const tbody: HTMLTableSectionElement = table.createTBody();
		transactions.forEach((txn) => {
			const row: HTMLTableRowElement = tbody.insertRow();

			const nameCell: HTMLTableCellElement = row.insertCell();
			nameCell.textContent = txn.name;

			const categoryCell: HTMLTableCellElement = row.insertCell();
			categoryCell.textContent = txn.category;

			const dateCell: HTMLTableCellElement = row.insertCell();
			dateCell.textContent = txn.date;

			const amountCell = row.insertCell();
			amountCell.textContent = txn.amount.toFixed(2);
		});
	}
}

function updateBalance(): void {
	const balanceDiv = document.querySelector<HTMLDivElement>("#balance");
	if (!balanceDiv) {
		return;
	}
	removeAllChilderns(balanceDiv);

	let sum = transactions.map((txn) => txn.amount).reduce((acc, cur) => acc + cur, 0);

	let balance = document.createElement("label");
	balance.textContent = `Your balance ${sum}`;
	balanceDiv.appendChild(balance);
}

function updateMonthlyStatement(): void {
	const monthlyStatements = document.querySelector<HTMLDivElement>("#monthly-statement");
	if (monthlyStatements) {
		removeAllChilderns(monthlyStatements);
		const table = document.createElement("table");
		const tHead = table.createTHead();
		["Month", "Balance"].forEach((headerText) => {
			let th = document.createElement("th");
			th.textContent = headerText;
			tHead.appendChild(th);
		});

		const tBody = table.createTBody();
		const balanceByMonth = groupByMonth(transactions);
		console.log(balanceByMonth);
		balanceByMonth.forEach((txns) => {
			const row = tBody.insertRow();

			const monthCell = row.insertCell();
			monthCell.textContent = txns.month + '';

			const totalCell = row.insertCell();
			totalCell.textContent = txns.total + '';
		});

		monthlyStatements.appendChild(table);
	}
}

interface MonthlyTotal {
  year: number;
  month: number; // 1-12
  total: number;
  income: number[];
  expense: number[];
}

function groupByMonth(transactions: Transaction[]): MonthlyTotal[] {
	const map = new Map<string, MonthlyTotal>();

	for (const { date, amount } of transactions) {
		let [yearStr, monthStr] = date.split('-');
		let year = Number(yearStr);
		let month = Number(monthStr);
		let key = `${year}-${month}`;

		if (!map.has(key)) {
			map.set(key, { year, month, total: 0, income: [], expense: [] });
		}
		let current = map.get(key);
		current!.total += amount;
		if (amount > 0) {
			current!.income.push(amount);
		} else {
			current!.expense.push(amount);
		}
	}

	return Array.from(map.values()).sort(
		(a, b) => a.year - b.year || a.month - b.month
	);
}

function drawTransactionChart(txns: Transaction[]): void {
	const canvas = document.querySelector<HTMLCanvasElement>('#transaction-chart');
	if (!canvas) { return; }
	//canvas.width  = 300;
	//canvas.height = 300;

	const sumUpValues = (numbers: number[]) => {
		return numbers.reduce((acc, curr) => acc + curr, 0);
	}

	const monthlyTotals = groupByMonth(txns);
	const labels = monthlyTotals.map(m => `${m.year}-${String(m.month).padStart(2, '0')}`);
	const balance = monthlyTotals.map(m => m.total);
	const income = monthlyTotals.map(m => sumUpValues(m.income));
	const expense = monthlyTotals.map(m => sumUpValues(m.expense));

	if (chartInstance) {
		chartInstance.data.labels = labels;
		chartInstance.data.datasets[0].data = balance;
		chartInstance.data.datasets[1].data = income;
		chartInstance.data.datasets[2].data = expense;
		chartInstance.update();
		return;
	}

	const data: any = {
		labels: labels,
		datasets: [
               {
                   label: "Balance",
                   data: balance,
                   fill: false,
                   borderColor: "rgb(75, 192, 192)",
                   tension: 0.1,
               },
               {
                   label: "Salary",
                   data: income,
                   fill: false,
                   borderColor: "rgb(75, 0, 100)",
                   tension: 0.1,
               },
               {
                   label: "Expenses",
                   data: expense,
                   fill: false,
                   borderColor: "rgb(150, 80, 20)",
                   tension: 0.1,
               }
           ],
	};
	const config: any = {
		type: 'line',
		data: data,
		options: {
			responsive: false, // true will not respect the size
			plugins: {
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: 'Balance chart'
				}
			}
		},
	};
	chartInstance = new Chart(canvas, config);
}

if (expense) {
	let now = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

	expense.innerHTML = `
	  <h1>Expense tracker</h1>

	  <div id="balance"></div>
	  <div id="monthly-statement"></div>
	  <div id="income-wrapper">
	    <h3>Add income</h3>
		<label for="income-name">Name of income</label>
	    <input id="income-name" type="text" value="Abc Corp"/>

		<label for="income-date">Date of income</label>
	    <input id="income-date" type="date" value="${now}"/>

		<label for="income-category">Category of income</label>
	    <select id="income-category" type="text" name="what">
			<option>Salary</option>
			<option>Contract</option>
		</select>

		<label for="income-amount">Amount</label>
	    <input id="income-amount" type="text" autofocus/>
	  </div>
	  <div id="expense-wrapper">
	    <h3>Add expense</h3>
		<label>Name of expense</label>
	    <input id="expense-name" type="text" value="PKP Intercity"/>

		<label for="expense-date">Date of expense</label>
	    <input id="expense-date" type="date" value="${now}"/>

		<label for="expense-category">Category of expense</label>
	    <select id="expense-category" type="text" name="what" value="Train">
			<option>Travel</option>
			<option>Stay</option>
		</select>

		<label>Amount</label>
	    <input id="expense-amount" type="text"/>
	  </div>

	  <div id="history-wrapper">
	    <h3>Transaction history</h3>
		<table id="transactions"></table>
	  </div>

	  <div id="history-map">
	    <h3>Transaction chart</h3>
		<canvas id="transaction-chart" width="300" height="300"></canvas>
	  </div>
	`;

	document.getElementById("income-amount")?.addEventListener('keypress', (e) => addTransaction(e, "income"));
	document.getElementById("expense-amount")?.addEventListener('keypress', (e) => addTransaction(e, "expense"));
	updateBalance();
	updateMonthlyStatement();
	historyList(transactions);
	drawTransactionChart(transactions);
}
