let tasks = [];

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterDone = document.getElementById("filterDone");
const emptyMessage = document.getElementById("emptyMessage");

// Thêm công việc mới
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Vui lòng nhập công việc cần làm!");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  tasks.push(task);
  taskInput.value = "";
  taskInput.focus();
  render();
});

// Nhấn Enter để thêm công việc
taskInput.addEventListener("keypress", (e) => {
  console.log(e);

  if (e.key === "Enter") {
    addBtn.click();
  }
});

// Tìm kiếm công việc
searchInput.addEventListener("input", () => {
  render();
});

// Lọc công việc đã hoàn thành
filterDone.addEventListener("change", () => {
  render();
});

// Xóa công việc
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  render();
}

// Toggle trạng thái công việc
function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
  }
  render();
}

// Render danh sách công việc
function render() {
  taskList.innerHTML = "";

  const searchTerm = searchInput.value.toLowerCase();
  const showOnlyDone = filterDone.checked;

  let filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm);
    const matchesFilter = !showOnlyDone || task.completed;
    return matchesSearch && matchesFilter;
  });

  if (filteredTasks.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    const taskName = document.createElement("div");
    taskName.className = `task-name ${task.completed ? "completed" : ""}`;
    taskName.innerHTML = task.text;

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    const doneBtn = document.createElement("button");
    doneBtn.className = `done-btn ${task.completed ? "completed" : ""}`;
    doneBtn.innerHTML = task.completed ? "✓ Hoàn thành" : "Hoàn thành";
    doneBtn.addEventListener("click", () => toggleTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "Xóa";
    deleteBtn.addEventListener("click", () => {
      confirm("Bạn có chắc muốn xóa công việc này?") && deleteTask(task.id);
    });

    buttonGroup.appendChild(doneBtn);
    buttonGroup.appendChild(deleteBtn);

    li.appendChild(taskName);
    li.appendChild(buttonGroup);

    taskList.appendChild(li);
  });
}

// Render lần đầu
render();
