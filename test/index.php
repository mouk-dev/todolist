<?php
	// Génère la date UTC actuelle au format ISO 8601
	$serverUtcTimestamp = gmdate('Y-m-d\TH:i:s\Z');
?>

<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>TO DO LIST</title>
		<link rel="stylesheet" href="style.css" />
		<script>
			// Variable JS globale accessible dans ton script main.js
			const serverTimestamp = "<?php echo $serverUtcTimestamp; ?>";
		</script>
		<script src="main.js" defer></script>
	</head>
	<body>
		<div class="container">
			<h1 class="title-app">To do list</h1>
			<div class="app-header">
				<button class="task-btn new-task-btn" id="new-task-btn">
					Create new task
				</button>

				<button
					class="depense-btn new-depense-btn"
					id="new-depense-btn"
				>
					Create new depense
				</button>
				<h2 class="todo-group-title">TODO manager</h2>
			</div>
			<div class="task-container" id="tasks-list">
				<template id="task-layout">
					<form class="task-form">
						<div class="form-group group-box">
							<input
								type="checkbox"
								name="task"
								class="task-check"
							/>
							<input
								type="text"
								name="task-title"
								class="task-input task-title"
								placeholder="Enter your task title."
							/>
							<textarea
								name="task-description"
								class="task-input task-describe"
								placeholder="Describe your task"
							></textarea>
						</div>
						<div class="form-group-btn">
							<button class="task-btn update-task-btn">
								Edit
							</button>
							<button class="task-btn delete-task-btn">
								Remove
							</button>
						</div>
					</form>
				</template>
			</div>

			<div class="depense-container" id="depenses-list">
				<template id="depense-layout">
					<form class="depense-form">
						<div class="form-group group-box">
							<input
								type="checkbox"
								name="depense"
								class="depense-check"
							/>
							<input
								type="text"
								name="depense-title"
								class="depense-input depense-title"
								placeholder="Enter your depense title."
							/>
							<input
								type="number"
								name="depense-description"
								class="depense-input depense-describe"
								placeholder="Describe your depense"
							/>
						</div>
						<div class="form-group-btn">
							<button class="depense-btn update-depense-btn">
								Edit
							</button>
							<button class="depense-btn delete-depense-btn">
								Remove
							</button>
						</div>
					</form>
				</template>
			</div>
			<div class="total-depenses" id="total-depenses-box">0 F</div>
		</div>
	</body>
</html>
