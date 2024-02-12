document.addEventListener("DOMContentLoaded", function () {
    const taskListDiv = document.getElementById("taskList");
    const newTaskForm = document.getElementById("newTaskForm");

    const tasksApiEndpoint = "http://localhost:8080/tasks";

    // Fetch tasks and display on page load
    fetchTasks();

    // Handle form submission to add a new task
    newTaskForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const taskDescriptionInput = document.getElementById("taskDescription");
        const newTaskDescription = taskDescriptionInput.value;

        // Make a POST request to add a new task
        fetch(tasksApiEndpoint + "/add-task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: newTaskDescription,
                completedStatus: false
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Clear the input field
                taskDescriptionInput.value = "";

                // Display the updated list of tasks
                fetchTasks();
            })
            .catch(error => console.error("Error adding new task:", error));
    });

    function fetchTasks() {
        // Fetch tasks and display on page load
        fetch(tasksApiEndpoint)
            .then(response => response.json())
            .then(data => {
                // Clear the taskListDiv before adding new tasks
                taskListDiv.innerHTML = "";

                // Assuming the API response is an array of task items
                data.forEach(task => {
                    createTaskCheckbox(task);
                });
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function createTaskCheckbox(task) {
        // Create a new checkbox div
        const checkboxDiv = document.createElement("div");
        checkboxDiv.classList.add("task-checkbox");

        // Create a checkbox input element
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("custom-checkbox");
        checkbox.style.opacity = 0;

        // Set the checkbox state based on the completion data from the API
        checkbox.checked = task.completed;

        // Custom image for checkbox
        // Create a span for the checked state
        const checkedSpan = document.createElement("span");
        checkedSpan.classList.add("material-symbols-outlined");
        checkedSpan.classList.add("material-checkbox");

        // toggle checkbox image if the task is completed
        toggleCheckboxGraphic(checkedSpan, checkbox);

        // Create a span for the task description
        const descriptionSpan = document.createElement("span");
        descriptionSpan.textContent = task.description;
        descriptionSpan.contentEditable = true;
        descriptionSpan.required = true;

        // Add an event listener for the blur event (when the element loses focus)
        descriptionSpan.addEventListener("blur", function () {
            // Call the updateTaskDescription function when the description is edited
            if (descriptionSpan.textContent === "") {
                removeTask(task.id);
            } else {
                updateTaskDescription(task.id, descriptionSpan.textContent);
            }
        });

        // Create a button for removing the task
        const removeButton = document.createElement("button");

        // Create the material design icon
        const removeIcon = document.createElement("span");
        removeIcon.classList.add("material-symbols-outlined");
        removeIcon.textContent = "playlist_remove";
        removeButton.appendChild(removeIcon);

        removeButton.classList.add("removeButton"); // Add the new class for styling
        removeButton.addEventListener("click", function () {
            // Call a function to remove the task both in HTML and send a DELETE request
            removeTask(task.id);
        });

        checkedSpan.addEventListener("click", function () {
            checkbox.checked = !checkbox.checked;
            updateCompletionStatus(task.id, checkbox.checked);
            toggleCheckboxGraphic(checkedSpan, checkbox)
        });

        // Append checkbox, description, and buttons to the checkbox div
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(checkedSpan);
        checkboxDiv.appendChild(descriptionSpan);
        checkboxDiv.appendChild(removeButton);

        // Append the checkbox div to the taskList div
        taskListDiv.appendChild(checkboxDiv);
    }

    function removeTask(taskId) {
        // Make a DELETE request to remove the task
        fetch(`${tasksApiEndpoint}/${taskId}`, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                // Display the updated list of tasks
                fetchTasks();
            })
            .catch(error => console.error(`Error removing task with ID ${taskId}:`, error));
    }

    function updateCompletionStatus(taskId, completed) {
        // Make a PATCH request to update the completion status
        fetch(`${tasksApiEndpoint}/completed/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: "ignored",
                completedStatus: completed
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Display the updated list of tasks
                fetchTasks();
            })
            .catch(error => console.error(`Error updating completion status for task with ID ${taskId}:`, error));
    }

    function updateTaskDescription(taskId, newDescription) {
        // Make a PATCH request to update the task description
        fetch(`${tasksApiEndpoint}/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: newDescription,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Display the updated list of tasks
                fetchTasks();
            })
            .catch(error => console.error(`Error updating description for task with ID ${taskId}:`, error));
    }

    function toggleCheckboxGraphic(checkboxSpan, checkboxStatus) {
        if (checkboxStatus.checked) {
            checkboxSpan.textContent = "check_box";
        } else {
            checkboxSpan.textContent = "check_box_outline_blank";
        }
    }
});
