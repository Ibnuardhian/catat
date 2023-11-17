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
const deleteTaskCTA = document.getElementById("delete-task-cta");
const notification = document.getElementById("notification");
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

// close buttons inside overlays
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    var overlay = button.closest(".overlay");
    overlay.classList.add("hide");
    activeOverlay = null;
    document.body.classList.remove("overflow-hidden");
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

  if (name && description && dueDateTime && dueDateDay) {
    const task = {
      name: name,
      description: description,
      dueDateTime: dueDateTime,
      dueDateDay: dueDateDay,
    };

    let taskNumber = 1;
    while (localStorage.getItem(`taskUser${taskNumber}`)) {
      taskNumber++;
    }

    localStorage.setItem(`taskUser${taskNumber}`, JSON.stringify([task]));

    displayTasks();
    // Mengosongkan formulir setelah menambahkan tugas
    document.getElementById("name").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("due-date-time").value = "";
    document.getElementById("due-date-day").value = "";
    const addButton = document.getElementById("addTaskButton");
    location.reload();
    closeOverlay(addButton);
  }
}

// Fungsi untuk menampilkan task dari local storage
function displayTasks() {
  const toDoTaskList = document.getElementById("toDoTaskList");
  toDoTaskList.innerHTML = "";

  let taskNumber = 1;
  while (localStorage.getItem(`taskUser${taskNumber}`)) {
    const tasks = JSON.parse(localStorage.getItem(`taskUser${taskNumber}`));

    tasks.forEach((task) => {
      const taskButtonHTML = `
      <button class="task-button" data-task-number="${taskNumber}">
          <p class="task-name">${task.name}</p>
          <p class="task-due-date">Due on ${task.dueDateDay} jam ${task.dueDateTime}</p>
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
      // Menambahkan event listener untuk setiap tombol tugas yang dibuat
      newTaskItem.querySelector(".task-button").addEventListener("click", function(event) {
        viewTaskOverlay.classList.remove("hide");
        activeOverlay = viewTaskOverlay;
        document.body.classList.add("overflow-hidden");
        clickedTaskNumber = event.currentTarget.dataset.taskNumber; // Set nilai clickedTaskNumber
        console.log(`Tugas diklik dengan key taskUser${clickedTaskNumber}`);
          const taskName = document.getElementById("taskNameElement");
          const taskDescription = document.getElementById("taskDescriptionElement");
          const dueDate = document.getElementById("dueDateElement");
          taskName.textContent = task.name;
          taskDescription.textContent = task.description;
          dueDate.textContent = `Due on ${task.dueDateDay} jam ${task.dueDateTime}`; // Set due date
        });

      toDoTaskList.appendChild(newTaskItem);
    });
    taskNumber++;
  }
}
function otherFunction() {
  if (clickedTaskNumber !== null) {
    console.log(`Nilai clickedTaskNumber adalah: ${clickedTaskNumber}`);
    // Lakukan sesuatu dengan clickedTaskNumber di sini
  } else {
    console.log("clickedTaskNumber belum diatur.");
  }
}
// Panggil fungsi displayTasks saat halaman dimuat
displayTasks();

//Menambahkan event listener pada tombol "Add task"
document.getElementById("addTaskButton").addEventListener("click", addTask);
function deleteTaskFromLocalStorage(clickedTaskNumber) {
  const taskKeyToDelete = `taskUser${clickedTaskNumber}`;
  const taskToRemove = JSON.parse(localStorage.getItem(taskKeyToDelete));
}

// delete a task
deleteTaskCTA.addEventListener("click", () => {
  // Memeriksa apakah clickedTaskNumber sudah diatur sebelumnya
  if (clickedTaskNumber !== null) {
    // Menghapus data dari localStorage yang sesuai dengan clickedTaskNumber
    localStorage.removeItem(`taskUser${clickedTaskNumber}`);
    
    // Menghapus tampilan task yang dihapus dari DOM
    const taskToDelete = document.querySelector(`[data-task-number="${clickedTaskNumber}"]`);
    if (taskToDelete) {
      taskToDelete.parentElement.remove();
    }
      // Mengambil overlay terkait dan menyembunyikannya
      const overlay = deleteTaskCTA.closest(".overlay");
      if (overlay) {
        overlay.classList.add("hide");
        activeOverlay = null;
      }
      // Mengembalikan tampilan body ke normal
      document.body.classList.remove("overflow-hidden");
  // Memberikan notifikasi bahwa tugas telah dihapus
  if (notification) {
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
      // Reload halaman setelah notifikasi hilang
      location.reload();
      displayTasks(); // Ini akan merefresh halaman web
    }, 1500);
  }
} else {
  console.error("Tugas tidak ditemukan.");
}
});

const TaskFunctions = {
  copyTaskValues: function(setTaskForm, editTaskForm) {
    const taskNameInputSet = setTaskForm.querySelector('#name');
    const taskDescriptionInputSet = setTaskForm.querySelector('#taskDescription');
    const dueDateTimeInputSet = setTaskForm.querySelector('#due-date-time');
    const dueDateDayInputSet = setTaskForm.querySelector('#due-date-day');

    const taskNameInputEdit = editTaskForm.querySelector('#name');
    const taskDescriptionInputEdit = editTaskForm.querySelector('#taskDescription');
    const dueDateTimeInputEdit = editTaskForm.querySelector('#due-date-time');
    const dueDateDayInputEdit = editTaskForm.querySelector('#due-date-day');

    taskNameInputEdit.value = taskNameInputSet.value;
    taskDescriptionInputEdit.value = taskDescriptionInputSet.value;
    dueDateTimeInputEdit.value = dueDateTimeInputSet.value;
    dueDateDayInputEdit.value = dueDateDayInputSet.value;
  },

  hideOtherOverlays: function(editTaskOverlay) {
    const allOverlays = document.querySelectorAll(".overlay");
    allOverlays.forEach((overlay) => {
      if (overlay !== editTaskOverlay) {
        overlay.classList.add("hide");
      }
    });
  },

  showEditTaskOverlay: function(editTaskOverlay) {
    editTaskOverlay.classList.remove("hide");
    document.body.classList.add("overflow-hidden");
  },

  loadTaskDataFromLocalStorage: function(clickedTaskNumber, editTaskForm) {
    const taskToEdit = JSON.parse(localStorage.getItem(`taskUser${clickedTaskNumber}`));
    if (taskToEdit !== null) {
      const taskData = taskToEdit[0];

      const taskNameInputEdit = editTaskForm.querySelector('#name');
      const taskDescriptionInputEdit = editTaskForm.querySelector('#taskDescription');
      const dueDateTimeInputEdit = editTaskForm.querySelector('#due-date-time');
      const dueDateDayInputEdit = editTaskForm.querySelector('#due-date-day');

      taskNameInputEdit.value = taskData.name;
      taskDescriptionInputEdit.value = taskData.description;
      dueDateTimeInputEdit.value = taskData.dueDateTime;
      dueDateDayInputEdit.value = taskData.dueDateDay;
    } else {
      console.error(`Data tugas untuk taskUser${clickedTaskNumber} tidak ditemukan di localStorage.`);
    }
  }
};

const editTaskCTA = document.getElementById("edit-task-cta")
// Fungsi utama dalam event listener
editTaskCTA.addEventListener("click", () => {
  if (clickedTaskNumber !== null) {
    const setTaskOverlay = document.getElementById("set-task-overlay");
    const editTaskOverlay = document.getElementById("edit-task-overlay");
    const setTaskForm = setTaskOverlay.querySelector('form');
    const editTaskForm = editTaskOverlay.querySelector('form');

    TaskFunctions.copyTaskValues(setTaskForm, editTaskForm);
    TaskFunctions.hideOtherOverlays(editTaskOverlay);
    TaskFunctions.showEditTaskOverlay(editTaskOverlay);
    TaskFunctions.loadTaskDataFromLocalStorage(clickedTaskNumber, editTaskForm);
  } else {
    console.error("Tugas tidak ditemukan.");
  }
});

// Fungsi untuk menangani klik pada tombol edit
document.getElementById("editTaskButton").addEventListener("click", () => {
  const editTaskForm = document.getElementById("edit-task-overlay").querySelector('form');
  // Ambil nilai dari form
  const taskNameInputEdit = editTaskForm.querySelector('#name').value;
  const taskDescriptionInputEdit = editTaskForm.querySelector('#taskDescription').value;
  const dueDateTimeInputEdit = editTaskForm.querySelector('#due-date-time').value;
  const dueDateDayInputEdit = editTaskForm.querySelector('#due-date-day').value;
  const taskNumber = clickedTaskNumber;
  const allOverlays = document.querySelectorAll(".overlay");
  // Simpan data yang diperbarui ke dalam localStorage (contoh penyimpanan)
  const updatedTaskData = {
    name: taskNameInputEdit,
    description: taskDescriptionInputEdit,
    dueDateTime: dueDateTimeInputEdit,
    dueDateDay: dueDateDayInputEdit,
  };

  // Simpan data ke localStorage
  localStorage.setItem(`taskUser${taskNumber}`, JSON.stringify([updatedTaskData]));;

  // Tambahkan logika lain yang diperlukan untuk pembaruan data, seperti menampilkan perubahan atau mengirim data ke server, dst.
  // Misalnya:
  // Tampilkan perubahan data di konsol
  console.log('Data Task yang Diperbarui:', updatedTaskData);
  console.log('Data Task telah diperbarui di localStorage.');

  // Lakukan yang lain sesuai kebutuhan, misalnya menampilkan perubahan di antarmuka pengguna
  // Logika untuk menyembunyikan overlay dan melakukan aksi tertentu
  allOverlays.forEach((overlay) => {
    overlay.classList.add("hide");
    document.body.classList.remove("overflow-hidden");
    location.reload();
  });
});
