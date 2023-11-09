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
// Menambahkan event listener ke tombol tugas untuk menampilkan tugas detail
const taskButtons = document.querySelectorAll(".task-button");
const taskNameView = document.getElementById("taskNameElement");
const taskDescriptionView = document.getElementById("taskDescription");
const taskDueDateView = document.getElementById("taskDueDate");
const taskStatusView = document.querySelector(".status-value");
// Mengambil data tugas dari query string
const taskName = getParameterByName("name");
const taskDescription = getParameterByName("description");
const dlHari = getParameterByName("due-date-day");
const dlJam = getParameterByName("due-date-time");
const selectedStatus = getParameterByName("status-option");
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
    console.log("Ke click");
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
  window.location.href = '../databse/logout.php';
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
function formatDate(inputDate) {
  const dateParts = inputDate.split("-");
  if (dateParts.length === 3) {
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    return `${day}-${month}-${year}`;
  } else {
    return inputDate; // Jika format input tidak sesuai, kembalikan nilai asli
  }
}
const formattedDeadline = dlHari.split('-').reverse().join('-');

// Membuat tombol tugas dengan template literals
const taskButtonHTML = `
<button class="task-button" onclick="overlayUnhide()">
    <p class="task-name">${taskName}</p>
    <p class="task-due-date">Due on ${dlHari} jam ${dlJam}</p>
    <iconify-icon icon="material-symbols:arrow-back-ios-rounded" 
      style="color: black" 
      width="18" 
      height="18" 
      class="arrow-icon">
    </iconify-icon>
</button>
`;

const listItemHTML = `
<li class="task-item">
    ${taskButtonHTML}
</li>
`;

function overlayUnhide() {
    viewTaskOverlay.classList.remove('hide');
    console.log("Anjay mabar");
}

function taskExistsInList(list, taskName) {
  const taskItems = list.querySelectorAll('.task-name');
  for (let i = 0; i < taskItems.length; i++) {
    if (taskItems[i].textContent === taskName) {
      return true;
    }
  }
  return false;
}

if (selectedStatus === "To do") {
  const toDoTaskList = document.getElementById("toDoTaskList");
  if (!taskExistsInList(toDoTaskList, taskName)) {
    toDoTaskList.insertAdjacentHTML("beforeend", listItemHTML);
  }
} else if (selectedStatus === "Doing") {
  const doingTaskList = document.getElementById("doingTaskList");
  if (!taskExistsInList(doingTaskList, taskName)) {
    doingTaskList.insertAdjacentHTML("beforeend", listItemHTML);
  }
} else if (selectedStatus === "Done") {
  const doneTaskList = document.getElementById("doneTaskList");
  if (!taskExistsInList(doneTaskList, taskName)) {
    doneTaskList.insertAdjacentHTML("beforeend", listItemHTML);
  }
}