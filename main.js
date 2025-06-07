// Données en mémoire (tableaux d'objets)
let tasks = [];
let depenses = [];

// Sélecteurs DOM
const tasksList = document.getElementById("tasks-list");
const depensesList = document.getElementById("depenses-list");
const totalDepensesBox = document.getElementById("total-depenses-box");
const newTaskBtn = document.getElementById("new-task-btn");
const newDepenseBtn = document.getElementById("new-depense-btn");

// Sauvegarde dans localStorage
function saveData() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
	localStorage.setItem("depenses", JSON.stringify(depenses));
}

// Chargement depuis localStorage
function loadData() {
	const savedTasks = localStorage.getItem("tasks");
	const savedDepenses = localStorage.getItem("depenses");

	tasks = savedTasks ? JSON.parse(savedTasks) : [];
	depenses = savedDepenses ? JSON.parse(savedDepenses) : [];
}

// Génération HTML d’une tâche
function createTaskElement(task, index) {
	const form = document.createElement("form");
	form.className = "task-form";
	form.dataset.index = index;

	form.innerHTML = `
		<div class="form-group" id="group-box">
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
		<div class="form-group-btn">
			<button class="task-btn update-task-btn">Edit task</button>
			<button class="task-btn delete-task-btn">Remove task</button>
		</div>
	`;

	return form;
}

// Génération HTML d’une dépense
function createDepenseElement(depense, index) {
	const form = document.createElement("form");
	form.className = "depense-form";
	form.dataset.index = index;

	form.innerHTML = `
		<div class="form-group" id="group-box">
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
		<div class="form-group-btn">
			<button class="depense-btn update-depense-btn">Edit depense</button>
			<button class="depense-btn delete-depense-btn">Remove depense</button>
		</div>
	`;

	return form;
}

// Afficher toutes les tâches et dépenses à partir des données
function render() {
	// Clear containers
	tasksList.innerHTML = "";
	depensesList.innerHTML = "";

	// Tâches
	tasks.forEach((task, index) => {
		const taskElem = createTaskElement(task, index);
		tasksList.appendChild(taskElem);
	});

	// Dépenses
	depenses.forEach((depense, index) => {
		const depenseElem = createDepenseElement(depense, index);
		depensesList.appendChild(depenseElem);
	});

	updateTotalDepenses();
}

// Calcul total dépenses
function updateTotalDepenses() {
	let total = depenses.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
	totalDepensesBox.textContent = total + " F";
	totalDepensesBox.style.display = total > 0 ? "block" : "none";
}

// Ajouter une nouvelle tâche
function addTask() {
	tasks.push({
		title: "",
		description: "",
		completed: false,
	});
	saveData();
	render();
}

// Ajouter une nouvelle dépense
function addDepense() {
	depenses.push({
		title: "",
		amount: 0,
		completed: false,
	});
	saveData();
	render();
}

// Gestion des clics sur toute la page (délégué)
document.addEventListener("click", function (e) {
	// Nouvelle tâche
	if (e.target === newTaskBtn) {
		e.preventDefault();
		addTask();
	}

	// Nouvelle dépense
	if (e.target === newDepenseBtn) {
		e.preventDefault();
		addDepense();
	}

	// Éditer tâche
	if (e.target.classList.contains("update-task-btn")) {
		e.preventDefault();
		const form = e.target.closest(".task-form");
		const index = parseInt(form.dataset.index);

		// Toggle disabled sur inputs
		form.querySelectorAll(".task-input").forEach((input) => {
			input.disabled = !input.disabled;
		});

		// Si on vient de désactiver (fin d'édition), on sauvegarde les valeurs dans le tableau
		if (form.querySelector(".task-title").disabled) {
			tasks[index].title = form.querySelector(".task-title").value;
			tasks[index].description =
				form.querySelector(".task-describe").value;
			tasks[index].completed = form.querySelector(".task-check").checked;
			saveData();
			render();
		}
	}

	// Éditer dépense
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

	// Supprimer tâche
	if (e.target.classList.contains("delete-task-btn")) {
		e.preventDefault();
		const form = e.target.closest(".task-form");
		const index = parseInt(form.dataset.index);
		tasks.splice(index, 1);
		saveData();
		render();
	}

	// Supprimer dépense
	if (e.target.classList.contains("delete-depense-btn")) {
		e.preventDefault();
		const form = e.target.closest(".depense-form");
		const index = parseInt(form.dataset.index);
		depenses.splice(index, 1);
		saveData();
		render();
	}
});

// Mise à jour dynamique des montants de dépenses pendant la saisie
depensesList.addEventListener("input", function (e) {
	if (e.target.classList.contains("depense-describe")) {
		const form = e.target.closest(".depense-form");
		const index = parseInt(form.dataset.index);

		depenses[index].amount = parseFloat(e.target.value) || 0;
		saveData();
		updateTotalDepenses();
	}
});

// Chargement initial
document.addEventListener("DOMContentLoaded", function () {
	loadData();
	render();
});
