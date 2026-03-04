1. Tổ chức dữ liệu

```js
const tasks = [
  {
    id: 1,
    title: `<button onclick='alert("Học JavaScript")'>Học JavaScript</button>`,
    completed: false,
  },
  {
    id: 2,
    title: "Làm bài tập",
    completed: true,
  },
];
```

2. Thao tác với dữ liệu

- Hiển thị danh sách công việc:
  - Lấy phần tử ul từ HTML: document.getElementById("task-list")
  - Duyệt qua mảng tasks và tạo thẻ li cho mỗi công việc: tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = task.title;
    if (task.completed) {
    li.style.textDecoration = "line-through";
    }
  - Thêm thẻ li vào ul: appendChild(li)

- 4 cách để thêm nội dung vào một element:
  1. innerHTML: element.innerHTML = "Nội dung mới";
  2. textContent: element.textContent = "Nội dung mới";
  3. innerText: element.innerText = "Nội dung mới";
  4. outerHTML: element.outerHTML = "<div>Nội dung mới</div>";
