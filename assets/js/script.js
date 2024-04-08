// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = Number(localStorage.getItem("nextId")) || 0;

function generateTaskId() {
    nextId++
    localStorage.setItem("nextId", nextId);
    return nextId
}

function createTaskCard(task) {
    const card = $("<div>").addClass("card task-card my-3").attr("data-id", task.id)
    const header = $("<div>").addClass("card-header h4").text(task.title)
    const body = $("<div>").addClass("card-body")
    const description = $("<p>").addClass("card-text").text(task.description)
    const dueDate = $("<p>").addClass("card-text").text(task.dueDate)
    const deleteBtn = $("<button>").addClass("btn btn-danger").text("delete")
    deleteBtn.on("click", handleDeleteTask)
    if (task.dueDate && task.status !== "done"
    ) {
        const today = dayjs()
        if (today.isSame(task.dueDate, "day")) {
            card.addClass("bg-warning text-white ")
        } else if (today.isAfter(task.dueDate)) {
            card.addClass("bg-danger text-black")
        }
    }
    body.append(description, dueDate, deleteBtn)
    card.append(header, body)
    return card
}

function renderTaskList() {
    $("#todo-cards").empty()
    $("#in-progress-cards").empty()
    $("#done-cards").empty()
    taskList.forEach(task => {
        if (task.status === "to-do") {
            $("#todo-cards").append(createTaskCard(task))
        } else if (task.status === "in-progress") {
            $("#in-progress-cards").append(createTaskCard(task))
        } else {
            $("#done-cards").append(createTaskCard(task))
        }
    });
    $(".task-card").draggable({
        opacity: 0.7,
        zIndex: 100,
    });
}

function handleAddTask(event) {
    event.preventDefault();
    const task = {
        id: generateTaskId(), title: $("#taskTitle").val(), description: $("#taskDescription").val(), dueDate: $("#taskDuedate").val(), status: "to-do"
    }
    taskList.push(task)
    localStorage.setItem("tasks", JSON.stringify(taskList))
    renderTaskList()
    $("#taskTitle").val("")
    $("#taskDescription").val("")
    $("#taskDuedate").val("")
}

function handleDeleteTask(event) {
    const taskid = $(this).closest(".task-card").attr("data-id")
    taskList = taskList.filter(task => task.id !== Number(taskid))
    localStorage.setItem("tasks", JSON.stringify(taskList))
    renderTaskList()
}

function handleDrop(event, ui) {
    const taskid = ui.draggable[0].dataset.id
    const status = event.target.id
    taskList.forEach(task => {
        if (task.id === Number(taskid)) {
            task.status = status
        }
    })
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList()
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList()
    $("#taskDuedate").datepicker();
    $("#taskForm").on("submit", handleAddTask)
    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop,
    });
});
