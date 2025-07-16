// Dapatkan elemen-elemen yang dibutuhkan
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");

// Fungsi untuk memperbarui tampilan pesan yang kosong
function updateEmptyState() {
  if (taskList.children.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

// Fungsi untuk membuat element tguas baru
function createTaskElement(taskText) {
  // Membuat elemen list item
  const li = document.createElement("li");
  li.className =
    "task-item flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm ";

  // Membuat container untuk checkbox dan teks
  const taskContent = document.createElement("div");
  taskContent.className = "flex items-center gap-3";

  // Checkbox untuk menandai selesai
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className =
    "size-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer";

  // Teks tugas
  const span = document.createElement("span");
  span.textContent = taskText;
  span.className =
    "text-gray-700 dark:text-gray-200 transition-colors duration-300";

  taskContent.appendChild(checkbox);
  taskContent.appendChild(span);

  // Membuat tombol hapus
  const deleteButton = document.createElement("button");
  deleteButton.className =
    "text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 p-1 rounded-full";
  deleteButton.innerHTML = '<i class="ph ph-trash text-xl"></i>';

  // Event Listener untuk Tombol Hapus

  deleteButton.addEventListener("click", (e) => {
    li.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    li.style.opacity = "0";
    li.style.transform = "translateX(20px)";
    setTimeout(() => {
      li.remove();
      updateEmptyState(); // Update status setelah menghapus
    }, 300);
  });

  // Event Listner untuk Checkbox
  checkbox.addEventListener("change", () => {
    span.classList.toggle("line-through");
    span.classList.toggle("text-gray-400", checkbox.checked);
    span.classList.toggle("dark:text-gray-500", checkbox.checked);
    li.classList.toggle("bg-green-50", checkbox.checked);
    li.classList.toggle("dark:bg-green-900/30", checkbox.checked);
  });

  li.appendChild(taskContent);
  li.appendChild(deleteButton);
  return li;
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Mencegah halaman refresh

  const taskText = taskInput.value.trim(); // Mengambil tugas dan hapus spasi
  if (taskText !== "") {
    const newTask = createTaskElement(taskText);
    taskList.appendChild(newTask); // Tambahkan tugas baru ke daftar
    taskInput.value = ""; // Kosongkan input field
    taskInput.focus(); // Fokus kembali ke input
    updateEmptyState(); // Update status
  }
});

updateEmptyState();