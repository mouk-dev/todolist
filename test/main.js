/**
 * Gestionnaire de tâches et de dépenses avec localStorage
 */

let tasks = [];
let depenses = [];

const tasksList = document.getElementById("tasks-list");
const depensesList = document.getElementById("depenses-list");
const totalDepensesBox = document.getElementById("total-depenses-box");
const newTaskBtn = document.getElementById("new-task-btn");
const newDepenseBtn = document.getElementById("new-depense-btn");

function saveData() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
	localStorage.setItem("depenses", JSON.stringify(depenses));
}

function loadData() {
	tasks = JSON.parse(localStorage.getItem("tasks")) || [];
	depenses = JSON.parse(localStorage.getItem("depenses")) || [];
}

function createTaskElement(task, index) {
	const form = document.createElement("form");
	form.className = "task-form";
	form.dataset.index = index;

	const createdAtText = task.createdAt
		? new Date(task.createdAt).toLocaleString()
		: "";

	form.innerHTML = `
    <div class="form-group group-box">
      <input type="checkbox" class="task-check" ${
			task.completed ? "checked" : ""
		} />
      <input type="text" class="task-input task-title" placeholder="Enter your task title." value="${
			task.title
		}" disabled />
      <textarea class="task-input task-describe" placeholder="Describe your task" disabled>${
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

function createDepenseElement(depense, index) {
	const form = document.createElement("form");
	form.className = "depense-form";
	form.dataset.index = index;

	const createdAtText = depense.createdAt
		? new Date(depense.createdAt).toLocaleString()
		: "";

	form.innerHTML = `
    <div class="form-group group-box">
      <input type="checkbox" class="depense-check" ${
			depense.completed ? "checked" : ""
		} />
      <input type="text" class="depense-input depense-title" placeholder="Enter your depense title." value="${
			depense.title
		}" disabled />
      <input type="number" class="depense-input depense-describe" placeholder="Amount" value="${
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

function render() {
	tasksList.innerHTML = "";
	depensesList.innerHTML = "";

	tasks.forEach((task, index) =>
		tasksList.appendChild(createTaskElement(task, index))
	);
	depenses.forEach((depense, index) =>
		depensesList.appendChild(createDepenseElement(depense, index))
	);

	updateTotalDepenses();
}

function updateTotalDepenses() {
	const total = depenses.reduce(
		(sum, d) => sum + parseFloat(d.amount || 0),
		0
	);
	totalDepensesBox.textContent = `${total} F`;
	totalDepensesBox.style.display = total > 0 ? "block" : "none";
}

function addTask() {
	tasks.push({
		title: "",
		description: "",
		completed: false,
		createdAt: Date.now(),
	});
	saveData();
	render();
}

function addDepense() {
	depenses.push({
		title: "",
		amount: 0,
		completed: false,
		createdAt: Date.now(),
	});
	saveData();
	render();
}

document.addEventListener("click", function (e) {
	if (e.target === newTaskBtn) {
		e.preventDefault();
		addTask();
	}

	if (e.target === newDepenseBtn) {
		e.preventDefault();
		addDepense();
	}

	if (e.target.classList.contains("update-task-btn")) {
		e.preventDefault();
		const form = e.target.closest(".task-form");
		const index = parseInt(form.dataset.index);
		const inputs = form.querySelectorAll(".task-input");
		const isEditing = inputs[0].disabled;

		inputs.forEach((input) => (input.disabled = !isEditing));

		if (isEditing) {
			tasks[index].title = form.querySelector(".task-title").value;
			tasks[index].description =
				form.querySelector(".task-describe").value;
			tasks[index].completed = form.querySelector(".task-check").checked;
			saveData();
			render();
		}
	}

	if (e.target.classList.contains("update-depense-btn")) {
		e.preventDefault();
		const form = e.target.closest(".depense-form");
		const index = parseInt(form.dataset.index);
		const inputs = form.querySelectorAll(".depense-input");
		const isEditing = inputs[0].disabled;

		inputs.forEach((input) => (input.disabled = !isEditing));

		if (isEditing) {
			depenses[index].title = form.querySelector(".depense-title").value;
			depenses[index].amount =
				parseFloat(form.querySelector(".depense-describe").value) || 0;
			depenses[index].completed =
				form.querySelector(".depense-check").checked;
			saveData();
			render();
		}
	}

	if (e.target.classList.contains("delete-task-btn")) {
		e.preventDefault();
		const form = e.target.closest(".task-form");
		const index = parseInt(form.dataset.index);
		if (confirm("Are you sure you want to delete this task ?")) {
			tasks.splice(index, 1);
			saveData();
			render();
		}
	}

	if (e.target.classList.contains("delete-depense-btn")) {
		e.preventDefault();
		const form = e.target.closest(".depense-form");
		const index = parseInt(form.dataset.index);
		if (confirm("Do you really want to delete this expense ?")) {
			depenses.splice(index, 1);
			saveData();
			render();
		}
	}

	if (e.target.classList.contains("task-check")) {
		const index = parseInt(e.target.closest(".task-form").dataset.index);
		tasks[index].completed = e.target.checked;
		saveData();
	}

	if (e.target.classList.contains("depense-check")) {
		const index = parseInt(e.target.closest(".depense-form").dataset.index);
		depenses[index].completed = e.target.checked;
		saveData();
	}
});

depensesList.addEventListener("input", function (e) {
	if (e.target.classList.contains("depense-describe")) {
		const index = parseInt(e.target.closest(".depense-form").dataset.index);
		depenses[index].amount = parseFloat(e.target.value) || 0;
		saveData();
		updateTotalDepenses();
	}
});

document.addEventListener("DOMContentLoaded", function () {
	loadData();
	render();
});
