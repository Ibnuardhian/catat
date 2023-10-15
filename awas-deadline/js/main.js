// elements
const radioViewOptions = document.querySelectorAll("input[name='view-option']");
const listView = document.getElementById("list-view");
const boardView = document.getElementById("board-view");
const addTaskCTA = document.getElementById("add-task-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const statusSelect = document.getElementById("status-select");
const statusDropdown = document.getElementById("status-dropdown");
const taskItems = document.querySelectorAll(".task-item");
const viewTaskOverlay = document.getElementById("view-task-overlay");
const deleteTaskCTA = document.getElementById("delete-task-cta");
const notification = document.getElementById("notification");
// the current active overlay
let activeOverlay = null;

//** event listeners **//

// radio buttons for view option
radioViewOptions.forEach((radioButton) => {
  radioButton.addEventListener("change", (event) => {
    const eventTarget = event.target;
    const viewOption = eventTarget.value;

    switch (viewOption) {
      case "list":
        boardView.classList.add("hide");
        listView.classList.remove("hide");
        break;
      case "board":
        listView.classList.add("hide");
        boardView.classList.remove("hide");
        break;
    }
  });
});

// add task
addTaskCTA.addEventListener("click", () => {
  setTaskOverlay.classList.remove("hide");
  activeOverlay = setTaskOverlay;
  // disable scrolling for content behind the overlay
  document.body.classList.add("overflow-hidden");
});

// close buttons inside overlays
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeOverlay.classList.add("hide");
    activeOverlay = null;
    // reenable scrolling
    document.body.classList.remove("overflow-hidden");
  });
});

// open status dropdown
statusSelect.addEventListener("click", () => {
  statusDropdown.classList.toggle("hide");
});

// click a task
taskItems.forEach((task) => {
  task.addEventListener("click", () => {
    viewTaskOverlay.classList.remove("hide");
    activeOverlay = viewTaskOverlay;
    // disable scrolling for content behind the overlay
    document.body.classList.add("overflow-hidden");
  });
});

// delete a task
deleteTaskCTA.addEventListener("click", () => {
  activeOverlay.classList.add("hide");
  activeOverlay = null;
  // reenable scrolling
  document.body.classList.remove("overflow-hidden");
  // show notification & hide it after a while
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
});


const signOutButton = document.querySelector('.sign-out-cta');
signOutButton.addEventListener('click', () => {
  window.location.href = './login.html';
});

document.addEventListener('DOMContentLoaded', function () {
  // Ambil elemen-elemen yang diperlukan
  const statusLabel = document.querySelector('.label');
  const statusDropdown = document.querySelector('.status-dropdown');
  const radioInputs = document.querySelectorAll('.radio-input');
  const selectedStatus = document.getElementById('selected-status');

  // Tambahkan event click pada elemen "Status" untuk menampilkan atau menyembunyikan dropdown
  statusLabel.addEventListener('click', function () {
    statusDropdown.classList.toggle('hide');
  });

  // Tambahkan event change pada radio inputs untuk memperbarui label sesuai dengan pilihan
  radioInputs.forEach(input => {
    input.addEventListener('change', function () {
      if (input.checked) {
        statusLabel.textContent = input.value;
        selectedStatus.textContent = input.value;
        statusDropdown.classList.add('hide'); // Sembunyikan dropdown setelah memilih
      }
    });
  });
});

// Fungsi untuk mendapatkan parameter dari query string
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

        // Fungsi untuk mendapatkan parameter dari query string
        function getParameterByName(name, url) {
          if (!url) url = window.location.href;
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url);
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, " "));
      }

        // Fungsi untuk mendapatkan parameter dari query string
        function getParameterByName(name, url) {
          if (!url) url = window.location.href;
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url);
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, " "));
      }

// Mengambil data tugas dari query string
const taskName = getParameterByName("name");
const taskDescription = getParameterByName("description");
const dueDateDay = getParameterByName("due-date-day");
const dueDateMonth = getParameterByName("due-date-month");
const dueDateYear = getParameterByName("due-date-year");
const selectedStatus = getParameterByName("status-option");

if (taskName) {
    const taskButton = document.createElement("button");
    taskButton.className = "task-button";

    // Menambahkan atribut data-* dengan nilai yang sesuai
    taskButton.setAttribute("data-name", taskName);
    taskButton.setAttribute("data-description", taskDescription);
    taskButton.setAttribute("data-due-date", `${dueDateMonth} ${dueDateDay}, ${dueDateYear}`);
    taskButton.setAttribute("data-status", selectedStatus);

    const listItem = document.createElement("li");
    listItem.className = "task-item";

    const taskNameElement = document.createElement("p");
    taskNameElement.className = "task-name";
    taskNameElement.textContent = taskName;

    const taskDescriptionElement = document.createElement("p");
    taskDescriptionElement.className = "task-description";
    taskDescriptionElement.textContent = taskDescription;

    const taskDueDateElement = document.createElement("p");
    taskDueDateElement.className = "task-due-date";
    taskDueDateElement.textContent = `Due on ${dueDateMonth} ${dueDateDay}, ${dueDateYear}`;

    const arrowIcon = document.createElement("iconify-icon");
    arrowIcon.setAttribute("icon", "material-symbols:arrow-back-ios-rounded");
    arrowIcon.setAttribute("style", "color: black");
    arrowIcon.setAttribute("width", "18");
    arrowIcon.setAttribute("height", "18");
    arrowIcon.className = "arrow-icon";

    taskButton.appendChild(taskNameElement);
    //taskButton.appendChild(taskDescriptionElement);
    taskButton.appendChild(taskDueDateElement);
    taskButton.appendChild(arrowIcon);

    listItem.appendChild(taskButton);

    // Menambahkan status tugas
    if (selectedStatus) {
        const taskStatus = document.createElement("p");
        taskStatus.className = "task-status";
        taskStatus.textContent = selectedStatus;
        //taskButton.appendChild(taskStatus);
    }

    // Menambahkan tugas ke daftar tugas yang sesuai dengan statusnya
    if (selectedStatus === "To do") {
        const toDoTaskList = document.getElementById("toDoTaskList");
        toDoTaskList.appendChild(listItem);
    } else if (selectedStatus === "Doing") {
        const doingTaskList = document.getElementById("doingTaskList");
        doingTaskList.appendChild(listItem);
    } else if (selectedStatus === "Done") {
        const doneTaskList = document.getElementById("doneTaskList");
        doneTaskList.appendChild(listItem);
    }
}
const taskNameElement = document.getElementById("taskNameElement");
taskNameElement.textContent = taskName;
const taskDescriptionElement = document.getElementById("tasDescriptionElement");
taskDescriptionElement.textContent = taskDescription;
// const taskNameElement = document.getElementById("taskNameElement");
// taskNameElement.textContent = taskName;

// Event listener saat tombol "task-button" di klik
document.querySelectorAll(".task-button").forEach(function(button) {
  button.addEventListener("click", function() {
    const setTaskOverlay = document.getElementById("set-task-overlay");
    setTaskOverlay.classList.remove("hide");
  });
});

taskItems.forEach((task) => {
  task.addEventListener("click", () => {
    viewTaskOverlay.classList.remove("hide");
    activeOverlay = viewTaskOverlay;
    // disable scrolling for content behind the overlay
    document.body.classList.add("overflow-hidden");
  });
});