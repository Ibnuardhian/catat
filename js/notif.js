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

// Fungsi untuk menjadwalkan notifikasi
function scheduleNotification(taskId, dueDateDay) {
  const tasks = JSON.parse(localStorage.getItem("taskUserTodo")) || [];
  const task = tasks.find(
    (task) => task.id === taskId && task.dueDateDay === dueDateDay
  );

  if (task) {
    const dueDateTime = new Date(`${task.dueDateDay}T${task.dueDateTime}`);
    const currentTime = new Date();
    const timeDiff = dueDateTime.getTime() - currentTime.getTime();

    const notificationsScheduled =
      JSON.parse(localStorage.getItem("notificationsScheduled")) || {};

    let nearestNotification = dueDateTime.getTime();
    let notifications = [];

    if (!notificationsScheduled[taskId]) {
      notificationsScheduled[taskId] = nearestNotification;
    } else {
      nearestNotification = notificationsScheduled[taskId];
    }

    if (timeDiff > 0) {
      const interval12jam = 12 * 60 * 60 * 1000;
      const interval1hari = 24 * 60 * 60 * 1000;
      const interval3hari = 3 * 24 * 60 * 60 * 1000;

      if (timeDiff > interval12jam) {
        notifications.push(timeDiff - interval12jam);
      }
      if (timeDiff > interval1hari) {
        notifications.push(timeDiff - interval1hari);
      }
      if (timeDiff > interval3hari) {
        notifications.push(timeDiff - interval3hari);
      }

      notifications.forEach((notificationTime, index) => {
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
                index === 0 ? "12 jam" : index === 1 ? "3 hari" : "7 hari"
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
            }
          }
        }, notificationTime);
      });

      notificationsScheduled[taskId] = nearestNotification;
      localStorage.setItem(
        "notificationsScheduled",
        JSON.stringify(notificationsScheduled)
      );
    }
  }
}

// Fungsi untuk menjadwalkan semua notifikasi
function scheduleAllNotifications() {
  const tasks = JSON.parse(localStorage.getItem("taskUserTodo")) || [];
  tasks.forEach((task) => scheduleNotification(task.id, task.dueDateDay));
}

// Meminta izin notifikasi saat halaman dimuat
askForNotificationPermission();
