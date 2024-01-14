// Fungsi untuk meminta persetujuan notifikasi
function askForNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Persetujuan notifikasi diberikan!");
        scheduleAllNotifications(); // Menjadwalkan notifikasi setelah izin diberikan
      } else {
        console.warn("Persetujuan notifikasi tidak diberikan.");
      }
    });
  } else {
    console.error("Browser tidak mendukung notifikasi.");
  }
}

// Fungsi untuk mendapatkan nama bulan dari tanggal
function getFormattedDateWithMonthName(dateString) {
  const date = new Date(dateString);
  const month = getMonthName(date);
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Fungsi pendek untuk nama tugas yang panjang
function shortenTaskName(taskName) {
  if (taskName.length > 15) {
    let shortenedName = taskName.substr(0, 15);

    if (shortenedName.lastIndexOf(" ") > -1) {
      shortenedName = shortenedName.substr(0, shortenedName.lastIndexOf(" "));
    }

    return shortenedName + "...";
  }
  return taskName;
}

// Fungsi untuk menambahkan waktu notifikasi unik
function addUniqueNotificationTime(array, time) {
  if (!array.includes(time)) {
    array.push(time);
  }
}

// Fungsi untuk menjadwalkan notifikasi
function scheduleNotification(taskId, dueDateDay) {
  const tasks = JSON.parse(localStorage.getItem("taskUserTodo")) || [];
  const doneTasks = JSON.parse(localStorage.getItem("taskUserDone")) || [];

  // Pengecekan apakah tugas sudah selesai
  if (doneTasks.some((doneTask) => doneTask.id === taskId)) {
    // Tandai bahwa notifikasi sudah ditampilkan
    const notificationKey = `${taskId}_${dueDateDay}_0`;
    const notificationAlreadyShown =
      JSON.parse(localStorage.getItem("notificationsShown")) || {};
    notificationAlreadyShown[notificationKey] = true;
    localStorage.setItem(
      "notificationsShown",
      JSON.stringify(notificationAlreadyShown)
    );

    return; // Tidak perlu melanjutkan jika tugas sudah selesai
  }

  const task = tasks.find(
    (task) => task.id === taskId && task.dueDateDay === dueDateDay
  );

  if (task) {
    const dueDateTime = new Date(`${task.dueDateDay}T${task.dueDateTime}`);
    const currentTime = new Date();
    const timeDiff = dueDateTime.getTime() - currentTime.getTime();

    const notificationsScheduled =
      JSON.parse(localStorage.getItem("notificationsScheduled")) || {};

    if (!notificationsScheduled[taskId]) {
      notificationsScheduled[taskId] = [];
    }

    if (timeDiff > 0) {
      const interval12jam = 12 * 60 * 60 * 1000;
      const interval1hari = 24 * 60 * 60 * 1000;
      const interval3hari = 3 * 24 * 60 * 60 * 1000;

      if (timeDiff > interval12jam) {
        addUniqueNotificationTime(notificationsScheduled[taskId], timeDiff - interval12jam);
      }
      if (timeDiff > interval1hari) {
        addUniqueNotificationTime(notificationsScheduled[taskId], timeDiff - interval1hari);
      }
      if (timeDiff > interval3hari) {
        addUniqueNotificationTime(notificationsScheduled[taskId], timeDiff - interval3hari);
      }

      notificationsScheduled[taskId] = notificationsScheduled[taskId].sort(
        (a, b) => a - b
      );

      notificationsScheduled[taskId] = [
        ...new Set(notificationsScheduled[taskId]),
      ];

      notificationsScheduled[taskId] = notificationsScheduled[taskId].filter(
        (notificationTime) => notificationTime > 0
      );

      notificationsScheduled[taskId].forEach((notificationTime, index) => {
        setTimeout(() => {
          const currentTasks =
            JSON.parse(localStorage.getItem("taskUserTodo")) || [];
          const updatedTask = currentTasks.find(
            (task) => task.id === taskId && task.dueDateDay === dueDateDay
          );

          if (updatedTask) {
            const shortenedName = shortenTaskName(task.name);
            const formattedDueDate = getFormattedDateWithMonthName(
              task.dueDateDay
            );
            const notificationOptions = {
              body: `Tugas "${shortenedName}" tersisa ${
                index === 0 ? "12 jam" : index === 1 ? "1 hari" : "3 hari"
              } sebelum ${formattedDueDate}`,
              icon: "../img/gears.png",
              vibrate: [300, 200, 300],
            };

            // Cek apakah notifikasi sudah pernah ditampilkan sebelumnya
            const notificationKey = `${taskId}_${dueDateDay}_${index}`;
            const notificationAlreadyShown =
              JSON.parse(localStorage.getItem("notificationsShown")) || {};
            if (!notificationAlreadyShown[notificationKey]) {
              if ("Notification" in window) {
                if (Notification.permission === "granted") {
                  new Notification("Notifikasi CATAT!", notificationOptions);
                } else {
                  console.warn("Izin notifikasi tidak diberikan.");
                }
              } else {
                console.error("Browser tidak mendukung notifikasi.");
              }

              // Tandai bahwa notifikasi sudah ditampilkan
              notificationAlreadyShown[notificationKey] = true;
              localStorage.setItem(
                "notificationsShown",
                JSON.stringify(notificationAlreadyShown)
              );

              // Hapus ID notifikasi dari notificationsScheduled
              const indexToRemove = notificationsScheduled[taskId].indexOf(
                notificationKey
              );
              if (indexToRemove !== -1) {
                notificationsScheduled[taskId].splice(indexToRemove, 1);
                localStorage.setItem(
                  "notificationsScheduled",
                  JSON.stringify(notificationsScheduled)
                );
              }
            }
          }
        }, notificationTime);
      });

      localStorage.setItem(
        "notificationsScheduled",
        JSON.stringify(notificationsScheduled)
      );
    }
  }
}

// Fungsi untuk memeriksa dan menampilkan notifikasi yang terlewat
function checkMissedNotifications() {
  const missedNotifications =
    JSON.parse(localStorage.getItem("missedNotifications")) || {};

  Object.keys(missedNotifications).forEach((taskId) => {
    missedNotifications[taskId].forEach((notification) => {
      if (notification.time < Date.now()) {
        // Display missed notification
        const task = tasks.find((t) => t.id === taskId);
        const formattedDueDate = getFormattedDateWithMonthName(
          task.dueDateDay
        );
        const shortenedName = shortenTaskName(task.name);

        const notificationOptions = {
          body: `Anda melewatkan tugas "${shortenedName}" yang jatuh tempo pada ${formattedDueDate}`,
          icon: "../img/gears.png",
          vibrate: [300, 200, 300],
        };

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Notifikasi CATAT!", notificationOptions);
        } else {
          console.warn("Izin notifikasi tidak diberikan.");
        }
      }
    });

    // Remove checked missed notifications
    delete missedNotifications[taskId];
  });

  // Save updated missed notifications
  localStorage.setItem(
    "missedNotifications",
    JSON.stringify(missedNotifications)
  );
}

// Fungsi untuk menandai notifikasi yang terlewat
function markMissedNotification(taskId, dueDateDay, index) {
  const missedNotifications =
    JSON.parse(localStorage.getItem("missedNotifications")) || {};

  if (!missedNotifications[taskId]) {
    missedNotifications[taskId] = [];
  }

  const notificationKey = `${taskId}_${dueDateDay}_${index}`;
  const notificationAlreadyShown =
    JSON.parse(localStorage.getItem("notificationsShown")) || {};

  if (!notificationAlreadyShown[notificationKey]) {
    missedNotifications[taskId].push({
      key: notificationKey,
      time: Date.now(),
    });
  }

  localStorage.setItem(
    "missedNotifications",
    JSON.stringify(missedNotifications)
  );
}

// Fungsi untuk memeriksa notifikasi yang terlewat saat halaman dimuat
function checkMissedNotificationsOnLoad() {
  checkMissedNotifications();
  // Tambahan: Hapus missedNotifications setelah dicek
  localStorage.removeItem("missedNotifications");
}

// Fungsi untuk menjadwalkan semua notifikasi
function scheduleAllNotifications() {
  const tasks = JSON.parse(localStorage.getItem("taskUserTodo")) || [];
  tasks.forEach((task) => scheduleNotification(task.id, task.dueDateDay));
}

// Meminta izin notifikasi saat halaman dimuat
askForNotificationPermission();
// Memeriksa notifikasi yang terlewat saat halaman dimuat
checkMissedNotificationsOnLoad();
