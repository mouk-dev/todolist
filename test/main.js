/**
 * Data into memory (d'objets table)
 */
let tasks = [];
let depenses = [];

/**
 * Selector DOM
 */
const tasksList = document.getElementById("tasks-list");
const depensesList = document.getElementById("depenses-list");
const totalDepensesBox = document.getElementById("total-depenses-box");
const newTaskBtn = document.getElementById("new-task-btn");
const newDepenseBtn = document.getElementById("new-depense-btn");

/**
 * Save in localStorage
 */
function saveData() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
	localStorage.setItem("depenses", JSON.stringify(depenses));
}

/**
 * Load from localStorage
 */
function loadData() {
	const savedTasks = localStorage.getItem("tasks");
	const savedDepenses = localStorage.getItem("depenses");

	tasks = savedTasks ? JSON.parse(savedTasks) : [];
	depenses = savedDepenses ? JSON.parse(savedDepenses) : [];
}

/**
 * HTML generation of a task
 * @param {*} task
 * @param {*} index
 * @returns
 */
function createTaskElement(task, index) {
	const form = document.createElement("form");
	form.className = "task-form";
	form.dataset.index = index;

	const createdAtText = task.createdAt
		? new Date(task.createdAt).toLocaleString()
		: "";

	form.innerHTML = `
		<div class="form-group group-box">
			<input type="checkbox" name="task" class="task-check" ${
				task.completed ? "checked" : ""
			} />
			<input type="text" name="task-title" class="task-input task-title" placeholder="Enter your task title." value="${
				task.title
			}" disabled />
			<textarea name="task-description" class="task-input task-describe" placeholder="Describe your task" disabled>${
				task.description
			}</textarea>
		</div>
		<div class="created-at">Created at: ${createdAtText}</div>
		<div class="form-group-btn">
			<button class="task-btn update-task-btn">Edit</button>
			<button class="task-btn delete-task-btn">Remove</button>
		</div>
	`;

	return form;
}

/**
 * HTML generation of an expense
 * @param {*} depense
 * @param {*} index
 * @returns
 */
function createDepenseElement(depense, index) {
	const form = document.createElement("form");
	form.className = "depense-form";
	form.dataset.index = index;

	const createdAtText = depense.createdAt
		? new Date(depense.createdAt).toLocaleString()
		: "";

	form.innerHTML = `
		<div class="form-group group-box">
			<input type="checkbox" name="depense" class="depense-check" ${
				depense.completed ? "checked" : ""
			} />
			<input type="text" name="depense-title" class="depense-input depense-title" placeholder="Enter your depense title." value="${
				depense.title
			}" disabled />
			<input type="number" name="depense-description" class="depense-input depense-describe" placeholder="Describe your depense" value="${
				depense.amount
			}" disabled />
		</div>
		<div class="created-at">Created at: ${createdAtText}</div>
		<div class="form-group-btn">
			<button class="depense-btn update-depense-btn">Edit</button>
			<button class="depense-btn delete-depense-btn">Remove</button>
		</div>
	`;

	return form;
}

/**
 * Show all tasks and expenses from data
 */
function render() {
	/**
	 * Clear containers
	 */
	tasksList.innerHTML = "";
	depensesList.innerHTML = "";

	/**
	 * tasks
	 */
	tasks.forEach((task, index) => {
		const taskElem = createTaskElement(task, index);
		tasksList.appendChild(taskElem);
	});

	/**
	 * expenses
	 */
	depenses.forEach((depense, index) => {
		const depenseElem = createDepenseElement(depense, index);
		depensesList.appendChild(depenseElem);
	});

	updateTotalDepenses();
}

/**
 * Calcul total expenses
 */
function updateTotalDepenses() {
	let total = depenses.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
	totalDepensesBox.textContent = total + " F";
	totalDepensesBox.style.display = total > 0 ? "block" : "none";
}

// Add a new task
function addTask() {
	tasks.push({
		title: "",
		description: "",
		completed: false,
		createdAt: serverTimestamp, // timestamp serveur UTC
	});
	saveData();
	render();
}

/**
 * Add a new expense
 */
function addDepense() {
	depenses.push({
		title: "",
		amount: 0,
		completed: false,
		createdAt: serverTimestamp, // timestamp serveur UTC
	});
	saveData();
	render();
}

/**
 * Full-page click handling (delegated)
 */
document.addEventListener("click", function (e) {
	/**
	 * New task
	 */
	if (e.target === newTaskBtn) {
		e.preventDefault();
		addTask();
	}

	/**
	 * New expense
	 */
	if (e.target === newDepenseBtn) {
		e.preventDefault();
		addDepense();
	}

	/**
	 * Edit task
	 */
	if (e.target.classList.contains("update-task-btn")) {
		e.preventDefault();
		const form = e.target.closest(".task-form");
		const index = parseInt(form.dataset.index);

		/**
		 * Toggle disabled on inputs
		 */
		form.querySelectorAll(".task-input").forEach((input) => {
			input.disabled = !input.disabled;
		});

		/**
		 * If we have just deactivated (end of editing), we save the values ​​in the table
		 */
		if (form.querySelector(".task-title").disabled) {
			tasks[index].title = form.querySelector(".task-title").value;
			tasks[index].description =
				form.querySelector(".task-describe").value;
			tasks[index].completed = form.querySelector(".task-check").checked;
			saveData();
			render();
		}
	}

	/**
	 * Edit expense
	 */
	if (e.target.classList.contains("update-depense-btn")) {
		e.preventDefault();
		const form = e.target.closest(".depense-form");
		const index = parseInt(form.dataset.index);

		form.querySelectorAll(".depense-input").forEach((input) => {
			input.disabled = !input.disabled;
		});

		if (form.querySelector(".depense-title").disabled) {
			depenses[index].title = form.querySelector(".depense-title").value;
			depenses[index].amount =
				parseFloat(form.querySelector(".depense-describe").value) || 0;
			depenses[index].completed =
				form.querySelector(".depense-check").checked;
			saveData();
			render();
		}
	}

	/**
	 * delete task
	 */
	if (e.target.classList.contains("delete-task-btn")) {
		e.preventDefault();
		const form = e.target.closest(".task-form");
		const index = parseInt(form.dataset.index);

		// Confirmation before deletion
		if (confirm("Are you sure you want to delete this task ?")) {
			tasks.splice(index, 1);
			saveData();
			render();
		}
	}

	/**
	 * delete expense
	 */
	if (e.target.classList.contains("delete-depense-btn")) {
		e.preventDefault();
		const form = e.target.closest(".depense-form");
		const index = parseInt(form.dataset.index);

		// Confirmation before deletion
		if (confirm("Do you really want to delete this expense ?")) {
			depenses.splice(index, 1);
			saveData();
			render();
		}
	}
});

/**
 * Dynamique update data
 */
depensesList.addEventListener("input", function (e) {
	if (e.target.classList.contains("depense-describe")) {
		const form = e.target.closest(".depense-form");
		const index = parseInt(form.dataset.index);

		depenses[index].amount = parseFloat(e.target.value) || 0;
		saveData();
		updateTotalDepenses();
	}
});

document.addEventListener("DOMContentLoaded", function () {
	loadData();
	render();
});
