document.addEventListener("DOMContentLoaded", function () {
    const taskListDiv = document.getElementById("taskList");
    const newTaskForm = document.getElementById("newTaskForm");
    const visuals = document.getElementById("projectVisual");

    const tasksApiEndpoint = "http://localhost:8080/tasks";

    const RequestMethod = {
        POST: Symbol("POST"),
        PATCH: Symbol("PATCH"),
        DELETE: Symbol("DELETE")
    };

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

        animateRequest(RequestMethod.POST);
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
        animateRequest(RequestMethod.DELETE);

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
        animateRequest(RequestMethod.PATCH);

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
        animateRequest(RequestMethod.PATCH);

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

    // ------------ functions for visuals / animations ------------

    function animateRequest(requestType) {
        switch (requestType) {
            case (RequestMethod.POST):
                animateRequestArrows(RequestMethod.POST);
                break;
            case (RequestMethod.PATCH):
                animateRequestArrows(RequestMethod.PATCH);
                break;
            case (RequestMethod.DELETE):
                animateRequestArrows(RequestMethod.DELETE);
                break;
            default:
                console.log("Unknown request type");
        }
    }

    function animateRequestArrows(requestType) {

        // delete previous arrows
        deletePreviousAnimation();

        let shortRequestArrow;
        let longRequestArrow;
        let longResponseArrow;
        let shortResponseArrow;
        switch (requestType) {
            case (RequestMethod.POST):
                //TODO post text
                shortRequestArrow = createArrow("green", false, "request");
                longRequestArrow = createArrow("green", true, "request");
                longResponseArrow = createArrow("green", true, "response");
                shortResponseArrow = createArrow("green", false, "response");
                break;
            case (RequestMethod.PATCH):
                //TODO patch text
                shortRequestArrow = createArrow("yellow", false, "request");
                longRequestArrow = createArrow("yellow", true, "request");
                longResponseArrow = createArrow("yellow", true, "response");
                shortResponseArrow = createArrow("yellow", false, "response");
                break;
            case (RequestMethod.DELETE):
                //TODO delete text
                shortRequestArrow = createArrow("red", false, "request");
                longRequestArrow = createArrow("red", true, "request");
                longResponseArrow = createArrow("red", true, "response");
                shortResponseArrow = createArrow("red", false, "response");
                break;
            default:
                console.log("Unknown request type");
        }

        // assign id's for targeted removal
        shortRequestArrow.setAttribute("id", "a0");
        longRequestArrow.setAttribute("id", "a1");
        longResponseArrow.setAttribute("id", "a2");
        shortResponseArrow.setAttribute("id", "a3");

        // animates arrow from view to backend
        visuals.appendChild(shortRequestArrow);
        // animates arrow from backend to db
        setTimeout(() => {
            visuals.appendChild(longRequestArrow)
        }, 290);
        // animates response from db to backend
        setTimeout(() => {
            visuals.appendChild(longResponseArrow)
        }, 600);
        // animates response from backend to view
        setTimeout(() => {
            visuals.appendChild(shortResponseArrow)
        }, 900);
    }

    function createArrow(color, isLong, type) {
        const arrowContainer = document.createElement("div");
        const arrow = document.createElement("object");
        arrow.type = "image/svg+xml";
        if (isLong && color === "green" && type === "request") {
            arrow.data = "long_arrow.svg";
            arrow.classList.add("longGreenArrow");
        } else if (isLong && color === "green" && type === "response") {
            arrow.data = "long_arrow.svg";
            arrow.classList.add("longGreenArrowResponse");
        } else if (isLong && color === "red" && type === "request") {
            arrow.data = "long_arrow.svg";
            arrow.classList.add("longRedArrow");
        } else if (isLong && color === "red" && type === "response") {
            arrow.data = "long_arrow.svg";
            arrow.classList.add("longRedArrowResponse");
        } else if (isLong && color === "yellow" && type === "request") {
            arrow.data = "long_arrow.svg";
            arrow.classList.add("longYellowArrow");
        } else if (isLong && color === "yellow" && type === "response") {
            arrow.data = "long_arrow.svg";
            arrow.classList.add("longYellowArrowResponse");
        } else if (!isLong && color === "green" && type === "request") {
            arrow.data = "arrow.svg";
            arrow.classList.add("shortGreenArrow");
        } else if (!isLong && color === "green" && type === "response") {
            arrow.data = "arrow.svg";
            arrow.classList.add("shortGreenArrowResponse");
        } else if (!isLong && color === "yellow" && type === "request") {
            arrow.data = "arrow.svg";
            arrow.classList.add("shortYellowArrow");
        } else if (!isLong && color === "yellow" && type === "response") {
            arrow.data = "arrow.svg";
            arrow.classList.add("shortYellowArrowResponse");
        } else if (!isLong && color === "red" && type === "request") {
            arrow.data = "arrow.svg";
            arrow.classList.add("shortRedArrow");
        } else if (!isLong && color === "red" && type === "response") {
            arrow.data = "arrow.svg";
            arrow.classList.add("shortRedArrowResponse");
        }
        arrowContainer.appendChild(arrow);
        return arrowContainer;
    }

    function deletePreviousAnimation() {
        // removes any previous arrows
        for (let i = 0; i < 4; i++) {
            let arrow = document.getElementById("a" + i);
            if (arrow != null) {
                arrow.remove();
            }
        }
    }
});
