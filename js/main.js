// elements
const radioViewOptions = document.querySelectorAll("input[name='view-option']");
const listView = document.getElementById("list-view");
const boardView = document.getElementById("board-view");
const addTaskCTA = document.getElementById("add-task-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const statusDropdown = document.getElementById("status-dropdown");
const taskItems = document.querySelectorAll(".task-item");
const viewTaskOverlay = document.getElementById("view-task-overlay");
const viewDoneTaskOverlay = document.getElementById("view-done-task-overlay");
const deleteTaskCTA = document.getElementById("delete-task-cta");
const deleteDoneTaskCTA =document.getElementById("done-delete-task-cta")
const addNotif = document.getElementById("add-task-notification");
const delNotif = document.getElementById("delete-task-notification");
const errNotif = document.getElementById("error-task-notification");
const doneNotif = document.getElementById("done-task-notification");
let activeOverlay = null;
// Menambahkan event listener ke tombol tugas untuk menampilkan tugas detail
const taskButtons = document.querySelectorAll(".task-button");
const taskNameView = document.getElementById("taskNameElement");
const taskDescriptionView = document.getElementById("taskDescription");
const taskDueDateView = document.getElementById("taskDueDate");
const taskStatusView = document.querySelector(".status-value");

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
  document.body.classList.add("overflow-hidden");
});

// Function to close overlay
function closeOverlay(overlay) {
  overlay.classList.add("hide");
  activeOverlay = null;
  document.body.classList.remove("overflow-hidden");
}

// Function to handle key press events
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const visibleOverlay = document.querySelector(".overlay:not(.hide)");
    if (visibleOverlay) {
      closeOverlay(visibleOverlay);
      location.reload();
    }
  }
});

// Close buttons inside overlays
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    var overlay = button.closest(".overlay");
    closeOverlay(overlay);
    location.reload();
  });
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

const signOutButton = document.querySelector(".sign-out-cta");
signOutButton.addEventListener("click", () => {
  window.location.href = "login.html";
});

// Fungsi untuk menutup overlay
function closeOverlay(button) {
  var overlay = button.closest(".overlay");
  overlay.classList.add("hide");
  activeOverlay = null;
  document.body.classList.remove("overflow-hidden");
}

// Fungsi untuk menambahkan task baru
function addTask(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const description = document.getElementById("taskDescription").value;
  const dueDateTime = document.getElementById("due-date-time").value;
  const dueDateDay = document.getElementById("due-date-day").value;

  const currentDate = new Date(); // Mendapatkan tanggal dan waktu saat ini

  const taskDueDate = new Date(`${dueDateDay}T${dueDateTime}`);
  
  if (
    name &&
    description &&
    dueDateTime &&
    dueDateDay &&
    taskDueDate >= currentDate
  ) {
  
    // Generate a unique UUID for the task
    const id = uuidv4(); // Menggunakan uuidv4() yang telah dimuat secara global

    const task = {
      id: id,
      name: name,
      description: description,
      dueDateDay: dueDateDay,
      dueDateTime: dueDateTime,
    };

    let taskList = [];

    const todoKey = "taskUserTodo";
    const storedData = localStorage.getItem(todoKey);
    if (storedData) {
      taskList = JSON.parse(storedData);
    }

    taskList.push(task);
    taskList.sort((a, b) => {
      const dateA = new Date(`${a.dueDateDay}T${a.dueDateTime}`);
      const dateB = new Date(`${b.dueDateDay}T${b.dueDateTime}`);
      return dateA - dateB;
    });

    localStorage.setItem(todoKey, JSON.stringify(taskList));

    displayTasks();
    // Mengosongkan formulir setelah menambahkan tugas
    document.getElementById("name").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("due-date-time").value = "";
    document.getElementById("due-date-day").value = "";
    const addButton = document.getElementById("addTaskButton");
    closeOverlay(addButton);
    // Menampilkan notifikasi bahwa tugas telah ditambahkan
    if (addNotif) {
      addNotif.classList.add("show");
      setTimeout(() => {
        addNotif.classList.remove("show");
        displayTasks(); // Refresh halaman web
      }, 1500);
    }
  } else {
    closeOverlay(document.getElementById("addTaskButton")); // Tutup overlay
    // Menampilkan notifikasi bahwa input tanggal tidak valid
    if (errNotif) {
      errNotif.classList.add("show");
      setTimeout(() => {
        errNotif.classList.remove("show");
      }, 1500);
    }
  }
}

let clickedTaskId = null; // Deklarasi variabel sebagai variabel global

// Fungsi untuk menetapkan ID tugas yang akan dihapus saat tombol tugas diklik
function setClickedTaskId(id) {
  clickedTaskId = id;
}
function getDayOfWeek(dateString) {
  const days = [
    "Ahad",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  return days[dayOfWeek];
}
function getMonthName(dateString) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const date = new Date(dateString);
  const month = date.getMonth();
  return months[month];
}

function displayTasks() {
  const toDoTaskList = document.getElementById("toDoTaskList");
  toDoTaskList.innerHTML = "";

  const doneTaskList = document.getElementById("doneTaskList");
  doneTaskList.innerHTML = "";

  let tasksExist = false;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("taskUserTodo")) {
      const tasks = JSON.parse(localStorage.getItem(key));

      tasks.forEach((task) => {
        tasksExist = true;
        const date = new Date(task.dueDateDay);
        const formattedDueDate = `${getDayOfWeek(
          task.dueDateDay
        )}, ${date.getDate()} ${getMonthName(
          task.dueDateDay
        )} ${date.getFullYear()}`;
        const taskButtonHTML = `
          <button class="task-button" data-task-key="${key}" status-value="todo">
            <p class="task-name">${task.name}</p>
            <p class="task-due-date">${formattedDueDate}, ${task.dueDateTime}</p>
            <iconify-icon icon="material-symbols:arrow-back-ios-rounded" 
              style="color: black" 
              width="18" 
              height="18" 
              class="arrow-icon">
            </iconify-icon>
          </button>
        `;

        const newTaskItem = document.createElement("li");
        newTaskItem.classList.add("task-item");
        newTaskItem.innerHTML = taskButtonHTML;

        newTaskItem
          .querySelector(".task-button")
          .addEventListener("click", function () {
            viewTaskOverlay.classList.remove("hide");
            activeOverlay = viewTaskOverlay;
            document.body.classList.add("overflow-hidden");
            const taskId = task.id;
            setClickedTaskId(taskId);
            console.log(`Task clicked with key: ${clickedTaskId}`);
            const taskName = document.getElementById("taskNameElement");
            const taskDescription = document.getElementById(
              "taskDescriptionElement"
            );
            const dueDate = document.getElementById("dueDateElement");
            taskName.textContent = task.name;
            taskDescription.textContent = task.description;
            dueDate.innerHTML = `${formattedDueDate}. Jam ${task.dueDateTime}`;
          });

        toDoTaskList.appendChild(newTaskItem);
      });
    } else if (key && key.startsWith("taskUserDone")) {
      const tasks = JSON.parse(localStorage.getItem(key));

      tasks.forEach((task) => {
        tasksExist = true;
        const date = new Date(task.dueDateDay);
        const formattedDueDate = `${date.getDate()} ${getMonthName(
          task.dueDateDay
        )} ${date.getFullYear()}`;
        const clickedDateTime = getFormattedDateTime();
        const taskButtonHTML = `
          <button class="task-button" data-task-key="${key}" status-value="done">
            <p class="task-name">${task.name}</p>
            <p class="task-due-date">${formattedDueDate}</p>
            <iconify-icon icon="material-symbols:arrow-back-ios-rounded" 
              style="color: black" 
              width="18" 
              height="18" 
              class="arrow-icon">
            </iconify-icon>
          </button>
        `;

        const newTaskItem = document.createElement("li");
        newTaskItem.classList.add("task-item");
        newTaskItem.innerHTML = taskButtonHTML;

        newTaskItem
          .querySelector(".task-button")
          .addEventListener("click", function () {
            viewDoneTaskOverlay.classList.remove("hide");
            activeOverlay = viewDoneTaskOverlay;
            document.body.classList.add("overflow-hidden");
            const taskId = task.id;
            setClickedTaskId(taskId);
            console.log(`Task clicked with key: ${clickedTaskId}`);
            const taskName = document.getElementById("taskNameDone");
            const taskDescription = document.getElementById(
              "taskDescriptionDone"
            );
            const dueDate = document.getElementById("dueDateDone");
            taskName.textContent = task.name;
            taskDescription.textContent = task.description;
            dueDate.innerHTML = `${clickedDateTime}`;
          });

        doneTaskList.appendChild(newTaskItem);
      });
    }
  }

  if (!tasksExist) {
    const noTasksMessageToDo = document.createElement("li");
    noTasksMessageToDo.textContent = "Belum ada tugas";
    toDoTaskList.appendChild(noTasksMessageToDo);

    const noTasksMessageDone = document.createElement("li");
    doneTaskList.appendChild(noTasksMessageDone);
  }
}

window.addEventListener("load", displayTasks);

//Menambahkan event listener pada tombol "Add task"
const addTaskButton = document.getElementById("addTaskButton");

// Menambahkan event listener pada tombol "Add task" untuk hanya menambahkan tugas
addTaskButton.addEventListener("click", addTask);

function deleteTaskById(id) {
  let taskFound = false;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("taskUser")) {
      const tasks = JSON.parse(localStorage.getItem(key));
      const updatedTasks = tasks.filter((task) => task.id !== id);

      if (updatedTasks.length !== tasks.length) {
        localStorage.setItem(key, JSON.stringify(updatedTasks));
        taskFound = true;
        break;
      }
    }
  }

  if (taskFound) {
    displayTasks();
    console.log(`Task with ID ${id} has been deleted.`);
  } else {
    console.log(`Task with ID ${id} was not found.`);
  }
}

// Function to handle delete task
function handleDeleteTask() {
  if (clickedTaskId !== null) {
    deleteTaskById(clickedTaskId);
    const overlay = this.closest(".overlay");
    if (overlay) {
      overlay.classList.add("hide");
      activeOverlay = null;
    }
    document.body.classList.remove("overflow-hidden");
    if (delNotif) {
      delNotif.classList.add("show");
      setTimeout(() => {
        delNotif.classList.remove("show");
        displayTasks();
      }, 1500);
    }
  } else {
    console.error("Tugas tidak ditemukan.");
  }
}

// Adding event listeners to delete buttons
deleteTaskCTA.addEventListener("click", handleDeleteTask);
deleteDoneTaskCTA.addEventListener("click", handleDeleteTask);


const TaskFunctions = {
  copyTaskValues: function (setTaskForm, editTaskForm) {
    const taskNameInputSet = setTaskForm.querySelector("#name");
    const taskDescriptionInputSet =
      setTaskForm.querySelector("#taskDescription");
    const dueDateTimeInputSet = setTaskForm.querySelector("#due-date-time");
    const dueDateDayInputSet = setTaskForm.querySelector("#due-date-day");

    const taskNameInputEdit = editTaskForm.querySelector("#name");
    const taskDescriptionInputEdit =
      editTaskForm.querySelector("#taskDescription");
    const dueDateTimeInputEdit = editTaskForm.querySelector("#due-date-time");
    const dueDateDayInputEdit = editTaskForm.querySelector("#due-date-day");

    taskNameInputEdit.value = taskNameInputSet.value;
    taskDescriptionInputEdit.value = taskDescriptionInputSet.value;
    dueDateTimeInputEdit.value = dueDateTimeInputSet.value;
    dueDateDayInputEdit.value = dueDateDayInputSet.value;
  },

  hideOtherOverlays: function (editTaskOverlay) {
    const allOverlays = document.querySelectorAll(".overlay");
    allOverlays.forEach((overlay) => {
      if (overlay !== editTaskOverlay) {
        overlay.classList.add("hide");
      }
    });
  },

  showEditTaskOverlay: function (editTaskOverlay) {
    editTaskOverlay.classList.remove("hide");
    document.body.classList.add("overflow-hidden");
  },

  loadTaskDataFromLocalStorage: function (clickedTaskId, editTaskForm) {
    const tasks = JSON.parse(localStorage.getItem("taskUserTodo")); // Ganti 'taskUser1' dengan kunci yang sesuai dari local storage

    if (tasks) {
      const taskToEdit = tasks.find((task) => task.id === clickedTaskId);

      if (taskToEdit) {
        const taskNameInputEdit = editTaskForm.querySelector("#name");
        const taskDescriptionInputEdit =
          editTaskForm.querySelector("#taskDescription");
        const dueDateTimeInputEdit =
          editTaskForm.querySelector("#due-date-time");
        const dueDateDayInputEdit = editTaskForm.querySelector("#due-date-day");

        taskNameInputEdit.value = taskToEdit.name;
        taskDescriptionInputEdit.value = taskToEdit.description;
        dueDateTimeInputEdit.value = taskToEdit.dueDateTime;
        dueDateDayInputEdit.value = taskToEdit.dueDateDay;
      } else {
        console.error(
          `Data tugas untuk id: ${clickedTaskId} tidak ditemukan di localStorage.`
        );
      }
    } else {
      console.error("Tidak ada data tugas di localStorage.");
    }
  },
};

const editTaskCTA = document.getElementById("edit-task-cta");
// Fungsi utama dalam event listener
editTaskCTA.addEventListener("click", () => {
  if (clickedTaskId !== null) {
    const setTaskOverlay = document.getElementById("set-task-overlay");
    const editTaskOverlay = document.getElementById("edit-task-overlay");
    const setTaskForm = setTaskOverlay.querySelector("form");
    const editTaskForm = editTaskOverlay.querySelector("form");

    TaskFunctions.copyTaskValues(setTaskForm, editTaskForm);
    TaskFunctions.hideOtherOverlays(editTaskOverlay);
    TaskFunctions.showEditTaskOverlay(editTaskOverlay);
    TaskFunctions.loadTaskDataFromLocalStorage(clickedTaskId, editTaskForm);
  } else {
    console.error("Tugas tidak ditemukan.");
  }
});

document.getElementById("confirmTaskButton").addEventListener("click", () => {
  const editTaskForm = document
    .getElementById("edit-task-overlay")
    .querySelector("form");

  // Ambil nilai dari formulir
  const taskNameInputEdit = editTaskForm.querySelector("#name").value;
  const taskDescriptionInputEdit =
    editTaskForm.querySelector("#taskDescription").value;
  const dueDateTimeInputEdit =
    editTaskForm.querySelector("#due-date-time").value;
  const dueDateDayInputEdit = editTaskForm.querySelector("#due-date-day").value;

  const currentDate = new Date(); // Waktu saat ini

  // Konversi string tanggal dan waktu dari formulir menjadi objek Date
  const dueDate = new Date(`${dueDateDayInputEdit}T${dueDateTimeInputEdit}`);

  // Validasi apakah tanggal dan waktu sudah terlewat
  if (dueDate <= currentDate) {
    console.error("Tidak dapat memperbarui tugas yang telah lewat waktu.");
    // Tampilkan notifikasi atau pesan kesalahan kepada pengguna (jika diperlukan)
    // Misalnya:
    const errNotif = document.getElementById("error-notification");
    if (errNotif) {
      errNotif.classList.add("show");
      setTimeout(() => {
        errNotif.classList.remove("show");
      }, 3000);
    }
  } else {
    // Lanjut dengan pembaruan tugas jika tanggal dan waktu masih valid
    const tasks = JSON.parse(localStorage.getItem("taskUserTodo"));

    if (tasks) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === clickedTaskId) {
          task.name = taskNameInputEdit;
          task.description = taskDescriptionInputEdit;
          task.dueDateTime = dueDateTimeInputEdit;
          task.dueDateDay = dueDateDayInputEdit;
        }
        return task;
      });
      localStorage.setItem("taskUserTodo", JSON.stringify(updatedTasks)); // Simpan kembali data yang telah diperbarui ke localStorage

      // Logika untuk menampilkan perubahan data di antarmuka pengguna (jika diperlukan)
      console.log("Data Tugas yang Diperbarui:", updatedTasks);
      console.log("Data Tugas telah Diperbarui di localStorage.");

      const allOverlays = document.querySelectorAll(".overlay");
      // Semua overlay ditutup setelah konfirmasi
      allOverlays.forEach((overlay) => {
        overlay.classList.add("hide");
        document.body.classList.remove("overflow-hidden");
        location.reload();
      });
    } else {
      console.error("Tidak ada data tugas di localStorage.");
    }
  }
});
let clickedDateTime = '';

function getFormattedDateTime() {
  const currentDate = new Date();

  const dayOfWeek = getDayOfWeek(currentDate); // Menggunakan fungsi getDayOfWeek yang sudah ada
  const dayOfMonth = currentDate.getDate();
  const month = getMonthName(currentDate); // Menggunakan fungsi getMonthName yang sudah ada
  const year = currentDate.getFullYear();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();

  // Menambahkan nol di depan angka jika kurang dari 10 (untuk format 01, 02, ... 09)
  hours = (hours < 10) ? `0${hours}` : hours;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;

  const formattedDateTime = `${dayOfWeek}, ${dayOfMonth} ${month} ${year}, ${hours}:${minutes}`;
  return formattedDateTime;
}
// Simpan hasil getFormattedDateTime() dalam sebuah variabel saat aplikasi pertama kali dimuat
const staticFormattedDateTime = getFormattedDateTime();

const doneTaskButton = document.getElementById("done-task-button");
doneTaskButton.addEventListener("click", () => {
  const tasksFromTodo = JSON.parse(localStorage.getItem("taskUserTodo")) || [];
  const selectedTaskIndex = tasksFromTodo.findIndex(task => task.id === clickedTaskId);

  if (selectedTaskIndex !== -1) {
    const selectedTask = tasksFromTodo[selectedTaskIndex];
    let tasksForDone = JSON.parse(localStorage.getItem("taskUserDone")) || [];
    tasksForDone.push(selectedTask);
    localStorage.setItem("taskUserDone", JSON.stringify(tasksForDone));

    tasksFromTodo.splice(selectedTaskIndex, 1);
    localStorage.setItem("taskUserTodo", JSON.stringify(tasksFromTodo));

    const doneNotif = document.getElementById("done-task-notification"); // ID notifikasi
    if (doneNotif) {
      doneNotif.classList.add("show");
      setTimeout(() => {
        doneNotif.classList.remove("show");
        location.reload();
        displayTasks(); // Refresh daftar tugas
      }, 1500);
    }
    console.log(`Tanggal tombol diklik: ${clickedDateTime}`);
  } else {
    console.error("Tugas tidak ditemukan.");
  }

  const toDoTaskList = document.getElementById("toDoTaskList");
  if (toDoTaskList) {
    toDoTaskList.remove();
  }

  const doneButton = document.getElementById("done-task-button");
  closeOverlay(doneButton);
});

const todoTaskButton = document.getElementById("todo-task-button");
todoTaskButton.addEventListener("click", () => {
  const tasksFromDone = JSON.parse(localStorage.getItem("taskUserDone")) || [];
  const selectedTaskIndex = tasksFromDone.findIndex(task => task.id === clickedTaskId);

  if (selectedTaskIndex !== -1) {
    const selectedTask = tasksFromDone[selectedTaskIndex];
    let tasksForTodo = JSON.parse(localStorage.getItem("taskUserTodo")) || [];
    tasksForTodo.push(selectedTask);
    localStorage.setItem("taskUserTodo", JSON.stringify(tasksForTodo));

    tasksFromDone.splice(selectedTaskIndex, 1);
    localStorage.setItem("taskUserDone", JSON.stringify(tasksFromDone));

    const todoNotif = document.getElementById("todo-task-notification"); // ID notifikasi
    if (todoNotif) {
      todoNotif.classList.add("show");
      setTimeout(() => {
        todoNotif.classList.remove("show");
        location.reload();
        displayTasks(); 
      }, 1500);
    }
    console.log(`Tanggal tombol diklik: ${clickedDateTime}`);
  } else {
    console.error("Tugas tidak ditemukan.");
  }

  const doneTaskList = document.getElementById("doneTaskList");
  if (doneTaskList) {
    doneTaskList.remove();
  }

  const todoButton = document.getElementById("todo-task-button");
  closeOverlay(todoButton);
});
