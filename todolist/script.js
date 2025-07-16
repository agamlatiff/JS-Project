document.addEventListener("DOMContentLoaded", () => {
  // Dapatkan elemen-elemen yang dibutuhkan
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const taskCounter = document.getElementById("task-counter");
  const filters = document.getElementById("filters");
  const clearCompletedBtn = document.getElementById("clear-completed");

  // State Aplikasi
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  // Fungsi untuk menyimpan daftar tugas ke localStorage
  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Fungsi untuk memperbarui daftar tugas
  const renderTasks = () => {
    taskList.innerHTML = "";

    // Filter tugas berdasarkan status
    const filteredTasks = tasks.filter((task) => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    });

    // Tampilkan pesan jika tidak ada tugas
    if (filteredTasks.length === 0) {
      emptyState.style.display = "block";
      const message =
        currentFilter === "active"
          ? "Tidak ada tugas aktif."
          : currentFilter === "completed"
          ? "Tidak ada tugas yang selesai."
          : "Belum ada tugas. Saatnya menambahkan!";
      emptyState.querySelector("p").textContent = message;
    } else {
      emptyState.style.display = "none";
    }

    // Tampilkan daftar tugas
    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.dataset.id = task.id;
      li.className = `task-item flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm ${
        task.completed ? "opacity-60" : ""
      }`;

      li.innerHTML = ` <div class="flex items-center gap-3 flex-grow min-w-0">
                            <input type="checkbox" ${
                              task.completed ? "checked" : ""
                            } class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0">
                            <span class="task-text text-gray-700 dark:text-gray-200 transition-colors duration-300 truncate">${
                              task.text
                            }</span>
                            <input type="text" class="task-edit-input hidden w-full bg-white dark:bg-gray-600 rounded p-1 text-gray-800 dark:text-gray-200" value="${
                              task.text
                            }">
                        </div>
                        <div class="flex items-center gap-2 ml-2 flex-shrink-0">
                            <button class="edit-btn text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1 rounded-full"><i class="ph ph-pencil-simple text-xl"></i></button>
                            <button class="save-btn hidden text-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors p-1 rounded-full"><i class="ph ph-check-circle text-xl"></i></button>
                            <button class="delete-btn text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-full"><i class="ph ph-trash text-xl"></i></button>
                        </div>`;
      taskList.appendChild(li);
    });

    // Perbarui jumlah tugas
    updateTaskCount();
    // Perbarui tombol "Hapus Selesai"
    updateClearCompletedButton();
    // Perbarui tombol filter
    updateFilterButtons();
  };

  // Fungsi untuk memperbarui jumlah tugas
  const updateTaskCount = () => {
    const activeTasksCount = tasks.filter((task) => !task.completed).length;
    taskCounter.textContent = `${activeTasksCount} tugas tersisa`;
  };

  // Fungsi untuk memperbarui tombol "Hapus selesai"
  const updateClearCompletedButton = () => {
    const hasCompleted = tasks.some((task) => task.completed);
    clearCompletedBtn.style.visibility = hasCompleted ? "visible" : "hidden";
  };

  // Fungsi untuk memperbarui tombol filter
  const updateFilterButtons = () => {
    document.querySelectorAll(".filter-btn").forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.filter === currentFilter) {
        button.classList.add("active");
      }
    });
  };

  // Fungsi untuk menambahkan tugas
  const addTask = (text) => {
    if (text.trim() === "") return;
    tasks.push({ id: Date.now(), text: text.trim(), completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
  };

  // Fungsi untuk memperbarui tugas
  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  };

  // Fungsi untuk menghapus tugas
  const deleteTask = (id) => {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  };

  // Fungsi untuk mengubah teks tugas
  const editTask = (id, newText) => {
    const task = tasks.find((t) => t.id === id);
    if (task && newText.trim() !== "") {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    } else {
      renderTasks();
    }
  };

  // Event Listener untuk menambahkan tugas
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask(taskInput.value);
  });

  // Event Listener untuk menangani edit tugas
  taskList.addEventListener("click", (e) => {
    const target = e.target;
    const parentLi = target.closest("li.task-item");
    if (!parentLi) return;

    const taskId = Number(parentLi.dataset.id);

    // Klik tombol hapus
    if (target.closest(".delete-btn")) {
      parentLi.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      parentLi.style.opacity = "0";
      parentLi.style.transform = "translateX(20px)";
      setTimeout(() => deleteTask(taskId), 300);
      return;
    }

    // Klik checkbox
    if (target.type === "checkbox") {
      toggleTask(taskId);
      return;
    }

    // Klik tombol edit
    if (target.closest(".edit-btn")) {
      document.querySelectorAll(".task-item").forEach((item) => {
        item.querySelector(".task-text").classList.remove("hidden");
        item.querySelector(".task-edit-input").classList.add("hidden");
        item.querySelector(".edit-btn").classList.remove("hidden");
        item.querySelector(".save-btn").classList.add("hidden");
      });

      // Aktifkan mode edit tugas
      parentLi.querySelector(".task-text").classList.add("hidden");
      const input = parentLi.querySelector(".task-edit-input");
      input.classList.remove("hidden");
      input.focus();
      input.select();
      parentLi.querySelector(".edit-btn").classList.add("hidden");
      parentLi.querySelector(".save-btn").classList.remove("hidden");
      return;
    }

    if (target.closest(".save-btn")) {
      const newText = parentLi.querySelector(".task-edit-input").value;
      editTask(taskId, newText);
      return;
    }
  });

  // Event listener untuk menyimpan saat klik diluar input atau menekan Enter
  taskList.addEventListener("focusout", (e) => {
    if (e.target.classList.contains("task-edit-input")) {
      const parentLi = e.target.closest("li.task-item");
      // Pastikan tidak menyimpan jika tombol save diklik (untuk menghindari double action)
      if (!parentLi.querySelector(".save-btn").matches(":hover")) {
        const taskId = Number(parentLi.dataset.id);
        editTask(taskId, e.target.value);
      }
    }
  });

  // Event listener untuk menyimpan saat menekan Enter
  taskList.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.classList.contains("task-edit-input")) {
      e.target.blur();
    }
  });

  // Event listener untuk mengubah filter
  filters.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      currentFilter = e.target.dataset.filter;
      renderTasks();
    }
  });

  // Event listener untuk tombol "Hapus selesai"
  clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
  });

  renderTasks();
});
