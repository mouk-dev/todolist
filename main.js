let taskLayout = document.getElementById("task-layout");
let depenseLayout = document.getElementById("depense-layout");

let tasksList = document.getElementById("tasks-list");
let depensesList = document.getElementById("depenses-list");

let newTaskBtn = document.getElementById("new-task-btn");
let newDepenseBtn = document.getElementById("new-depense-btn");

let totalDepensesBox = document.getElementById("total-depenses-box");
let clickNumber = 0;

let stockTasks = "";
let stockDepenses = "";

let cloneTaskLayout = function () {
	let taskLayoutContent = taskLayout.content;
	let taskLayoutClone = taskLayoutContent.cloneNode(true);
	tasksList.append(taskLayoutClone);

	let textTags = tasksList.innerHTML;
	stockTasks += textTags;
	console.log(stockTasks);

	localStorage.setItem("saveTasks", stockTasks);

	return tasksList;
};

let cloneDepenseLayout = function () {
	let depenseLayoutContent = depenseLayout.content;
	let depenseLayoutClone = depenseLayoutContent.cloneNode(true);
	depensesList.append(depenseLayoutClone);

	let textTags = depensesList.innerHTML;
	stockDepenses += textTags;
	console.log(stockDepenses);

	localStorage.setItem("saveDepenses", stockDepenses);

	return depensesList;
};

let controleTaskLayout = function () {
	let fields = document.querySelectorAll(".task-input");
	let newTaskBtn = document.getElementById("new-task-btn");

	fields.forEach((input, index) => {
		fields[index].setAttribute("id", `item-${index}`);
		fieldState = true;
		newTaskBtn.addEventListener("click", (e) => {
			if (fieldState === true) {
				fields[index].disabled = fieldState;
				console.log("Désactivé");
			}
		});
		return fields[index];
	});
};

let controleDepenseLayout = function () {
	let fields = document.querySelectorAll(".depense-input");
	let newDepenseBtn = document.getElementById("new-depense-btn");

	fields.forEach((input, index) => {
		fields[index].setAttribute("id", `item-${index}`);
		fieldState = true;
		newDepenseBtn.addEventListener("click", (e) => {
			if (fieldState === true) {
				fields[index].disabled = fieldState;
				console.log("Désactivé");
			}
		});
		return fields[index];
	});
};

let newCloneTaskLayout = function () {
	cloneTaskLayout();
	controleTaskLayout();
};

let newCloneDepenseLayout = function () {
	cloneDepenseLayout();
	controleDepenseLayout();
	clickNumber++;
	if (clickNumber > 0) {
		totalDepensesBox.style.display = "block";
		console.log(clickNumber);
	}
};

newTaskBtn.addEventListener("click", newCloneTaskLayout);
newDepenseBtn.addEventListener("click", newCloneDepenseLayout);

(function checkDepenseExisting() {
	if (clickNumber === 0) {
		totalDepensesBox.style.display = "none";
		console.log(clickNumber);
	}
})();

let showTasksSaved = function () {
	if (tasksList.innerHTML === null) {
		console.log("vide");
	}
	tasksList.innerHTML += localStorage.getItem("saveTasks");
	console.log(tasksList);
};

let showDepensesSaved = function () {
	depensesList.innerHTML += localStorage.getItem("saveDepenses");

	console.log(depensesList);
};

document.addEventListener("DOMContentLoaded", function () {
	showTasksSaved();
	showDepensesSaved();
});

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
updateTotalDepenses();

depensesList.addEventListener("input", function (e) {
	if (e.target.classList.contains("depense-describe")) {
		updateTotalDepenses();
	}
});
