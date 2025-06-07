let taskLayout = document.getElementById("task-layout");
let depenseLayout = document.getElementById("depense-layout");

let tasksList = document.getElementById("tasks-list");
let depensesList = document.getElementById("depenses-list");

let newTaskBtn = document.getElementById("new-task-btn");
let newDepenseBtn = document.getElementById("new-depense-btn");

let totalDepensesBox = document.getElementById("total-depenses-box");
let clickNumber = 0;

// CLONAGE

function cloneTaskLayout() {
	let taskLayoutContent = taskLayout.content;
	let taskLayoutClone = taskLayoutContent.cloneNode(true);
	tasksList.append(taskLayoutClone);
	saveTasks();
}

function cloneDepenseLayout() {
	let depenseLayoutContent = depenseLayout.content;
	let depenseLayoutClone = depenseLayoutContent.cloneNode(true);
	depensesList.append(depenseLayoutClone);
	saveDepenses();
	updateTotalDepenses();
}

// CONTRÔLE (désactivé au départ, mais inutile ici avec édition toggle)
// Tu peux supprimer les fonctions controleTaskLayout / controleDepenseLayout si plus utilisées

// NOUVELLE TÂCHE / DÉPENSE

function newCloneTaskLayout() {
	cloneTaskLayout();
}

function newCloneDepenseLayout() {
	cloneDepenseLayout();
	clickNumber++;
	if (clickNumber > 0) {
		totalDepensesBox.style.display = "block";
	}
}

// MASQUER LE TOTAL AU DÉPART

(function checkDepenseExisting() {
	if (clickNumber === 0) {
		totalDepensesBox.style.display = "none";
	}
})();

// SAUVEGARDE

function saveTasks() {
	localStorage.setItem("saveTasks", tasksList.innerHTML);
}

function saveDepenses() {
	localStorage.setItem("saveDepenses", depensesList.innerHTML);
}

// RESTAURATION

function showTasksSaved() {
	tasksList.innerHTML += localStorage.getItem("saveTasks") || "";
}

function showDepensesSaved() {
	depensesList.innerHTML += localStorage.getItem("saveDepenses") || "";
	updateTotalDepenses();
}

// CALCUL TOTAL

function updateTotalDepenses() {
	let total = 0;
	document.querySelectorAll(".depense-describe").forEach((input) => {
		let value = parseFloat(input.value);
		if (!isNaN(value)) {
			total += value;
		}
	});
	totalDepensesBox.textContent = total + " F";
}

// GÉRER LES ÉVÉNEMENTS

document.addEventListener("DOMContentLoaded", function () {
	showTasksSaved();
	showDepensesSaved();
});

newTaskBtn.addEventListener("click", newCloneTaskLayout);
newDepenseBtn.addEventListener("click", newCloneDepenseLayout);

// DÉTECTION DES CHANGEMENTS DANS LES DÉPENSES POUR MÀJ AUTO DU TOTAL

depensesList.addEventListener("input", function (e) {
	if (e.target.classList.contains("depense-describe")) {
		updateTotalDepenses();
		saveDepenses();
	}
});

// SUPPRESSION & ÉDITION

document.addEventListener("click", function (e) {
	// Supprimer tâche
	if (e.target.classList.contains("delete-task-btn")) {
		e.preventDefault();
		let taskForm = e.target.closest(".task-form");
		taskForm.remove();
		saveTasks();
	}

	// Supprimer dépense
	if (e.target.classList.contains("delete-depense-btn")) {
		e.preventDefault();
		let depenseForm = e.target.closest(".depense-form");
		depenseForm.remove();
		saveDepenses();
		updateTotalDepenses();
	}

	// Éditer tâche
	if (e.target.classList.contains("update-task-btn")) {
		e.preventDefault();
		let taskForm = e.target.closest(".task-form");
		let inputs = taskForm.querySelectorAll(".task-input");
		inputs.forEach((input) => {
			input.disabled = !input.disabled;
		});
		saveTasks();
	}

	// Éditer dépense
	if (e.target.classList.contains("update-depense-btn")) {
		e.preventDefault();
		let depenseForm = e.target.closest(".depense-form");
		let inputs = depenseForm.querySelectorAll(".depense-input");
		inputs.forEach((input) => {
			input.disabled = !input.disabled;
		});
		saveDepenses();
		updateTotalDepenses();
	}
});
