document.addEventListener("DOMContentLoaded", function () {
    const taskListDiv = document.getElementById("taskList");
    const newTaskForm = document.getElementById("newTaskForm");
    const visuals = document.getElementById("projectVisual");
    let pageLoaded = false;

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
        fetch(tasksApiEndpoint, {
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
        // Fetch tasks and display
        fetch(tasksApiEndpoint)
            .then(response => response.json())
            .then(data => {
                // Clear the taskListDiv before adding new tasks
                taskListDiv.innerHTML = "";

                data.forEach(task => {
                    createTask(task);
                    if (!pageLoaded) {
                        // adds task images for each task in the visual overview
                        addDbTaskImage();
                    }
                })
                pageLoaded = true;
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function createTask(task) {
        // Create a new checkbox div
        const checkboxDiv = createCheckbox(task);

        // Create a span for the task description
        const taskDescription = createTaskDescription(task);

        // Create a button for removing the task
        const removeButton = createRemoveButton(task);

        // Append description and remove button to the checkbox div
        checkboxDiv.appendChild(taskDescription);
        checkboxDiv.appendChild(removeButton);

        // Append the checkbox div to the taskList div
        taskListDiv.appendChild(checkboxDiv);
    }

    function createCheckbox(task) {
        const checkboxDiv = document.createElement("div");
        checkboxDiv.classList.add("task-checkbox");

        // Create a checkbox input element
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("custom-checkbox");
        checkbox.style.opacity = 0;

        // Set the checkbox state based on the completion data from the API
        checkbox.checked = task.completed;

        // Custom icon for checkbox
        // Create a span for the checked state
        const checkedSpan = document.createElement("span");
        checkedSpan.classList.add("material-symbols-outlined");
        checkedSpan.classList.add("material-checkbox");

        // toggle checkbox icon if the task is completed
        toggleCheckboxGraphic(checkedSpan, checkbox);

        // event listener for ticking the checkbox
        checkedSpan.addEventListener("click", function () {
            checkbox.checked = !checkbox.checked;
            updateCompletionStatus(task.id, checkbox.checked);
            toggleCheckboxGraphic(checkedSpan, checkbox)
        });

        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(checkedSpan);
        return checkboxDiv;
    }

    function toggleCheckboxGraphic(checkboxSpan, checkboxStatus) {
        if (checkboxStatus.checked) {
            checkboxSpan.textContent = "check_box";
        } else {
            checkboxSpan.textContent = "check_box_outline_blank";
        }
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

    function createTaskDescription(task) {
        const descriptionSpan = document.createElement("span");
        descriptionSpan.textContent = task.description;
        descriptionSpan.contentEditable = "true";
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
        return descriptionSpan;
    }

    function createRemoveButton(task) {
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
        return removeButton;
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

        // create descriptive text for the request
        createRequestAndResponseText(requestType);

        // create and color arrows between view, backend, db
        const arrowsContainer = document.createElement("div");
        arrowsContainer.setAttribute("id", "arrows");
        visuals.appendChild(arrowsContainer);

        let shortRequestArrow;
        let longRequestArrow;
        let longResponseArrow = createArrow("green", true, "response");
        let shortResponseArrow = createArrow("green", false, "response");
        switch (requestType) {
            case (RequestMethod.POST):
                shortRequestArrow = createArrow("green", false, "request");
                longRequestArrow = createArrow("green", true, "request");
                // longResponseArrow = createArrow("green", true, "response");
                // shortResponseArrow = createArrow("green", false, "response");
                break;
            case (RequestMethod.PATCH):
                shortRequestArrow = createArrow("yellow", false, "request");
                longRequestArrow = createArrow("yellow", true, "request");
                // longResponseArrow = createArrow("yellow", true, "response");
                // shortResponseArrow = createArrow("yellow", false, "response");
                break;
            case (RequestMethod.DELETE):
                shortRequestArrow = createArrow("red", false, "request");
                longRequestArrow = createArrow("red", true, "request");
                // longResponseArrow = createArrow("red", true, "response");
                // shortResponseArrow = createArrow("red", false, "response");
                break;
            default:
                console.log("Unknown request type");
        }

        // ---- animations ----

        const arrowsContainerRef = document.getElementById("arrows");

        // animates arrow from view to backend
        arrowsContainerRef.appendChild(shortRequestArrow);
        document.getElementById("api req text").style.opacity = "100";


        // animates arrow from backend to db
        setTimeout(() => {
            arrowsContainerRef.appendChild(longRequestArrow)
            document.getElementById("db req text").style.opacity = "100";
        }, 290);

        // animate db remove or add
        setTimeout(() => {
            if (requestType === RequestMethod.POST) {
                addDbTaskImage();
            } else if (requestType === RequestMethod.DELETE) {
                removeDbTaskImage();
            }
        }, 450);

        // animates response from db to backend
        setTimeout(() => {
            arrowsContainerRef.appendChild(longResponseArrow)
            document.getElementById("db res text").style.opacity = "100";
        }, 600);

        // animates response from backend to view
        setTimeout(() => {
            arrowsContainerRef.appendChild(shortResponseArrow)
            document.getElementById("api res text").style.opacity = "100";
        }, 900);
    }

    function createRequestAndResponseText(requestType) {
        let ApiRequestText = document.getElementById("api req text");
        let ApiResponseText = document.getElementById("api res text");
        let DbRequestText = document.getElementById("db req text");
        let DbResponseText = document.getElementById("db res text");
        ApiResponseText.textContent = "OK {tasks}";
        DbResponseText.textContent = "{tasks}";
        switch (requestType) {
            case (RequestMethod.POST):
                ApiRequestText.textContent = "POST /tasks";
                DbRequestText.textContent = "insert()";
                break;
            case (RequestMethod.PATCH):
                ApiRequestText.textContent = "PATCH /tasks/{id}";
                DbRequestText.textContent = "save()";
                break;
            case (RequestMethod.DELETE):
                ApiRequestText.textContent = "DELETE /tasks/{id}";
                DbRequestText.textContent = "remove()";
                break;
            default:
                console.log("Unknown request type");
        }
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
        const prevArrows = document.getElementById("arrows");
        if (prevArrows != null) {
            prevArrows.remove();
        }
        let ApiReqText = document.getElementById("api req text");
        let ApiResText = document.getElementById("api res text");
        let DbRequestText = document.getElementById("db req text");
        let DbResponseText = document.getElementById("db res text");
        ApiReqText.style.opacity = "0";
        ApiResText.style.opacity = "0";
        DbRequestText.style.opacity = "0";
        DbResponseText.style.opacity = "0";
    }

    function addDbTaskImage() {
        const taskContainer = document.getElementById("task db container");

        // Create a new image element
        const newTaskImage = document.createElement("img");
        newTaskImage.src = "task_db.png";
        newTaskImage.alt = "db task";

        // Don't display more than four tasks
        const tasks = taskContainer.getElementsByTagName("img");
        if (tasks.length > 3) {
            newTaskImage.style.display = "none";
        }

        // Append the new image to the container
        taskContainer.appendChild(newTaskImage);
    }

    function removeDbTaskImage() {
        const taskContainer = document.getElementById("task db container");
        const tasks = taskContainer.getElementsByTagName("img");
        if (tasks.length > 0) {
            taskContainer.removeChild(tasks[tasks.length - 1]);
        }
    }
});
