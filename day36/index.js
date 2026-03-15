// const xhr = new XMLHttpRequest();

// // Cấu hình request
// xhr.open("GET", "https://jsonplaceholder.typicode.com/posts");

// // Lắng nghe kết quả
// xhr.onload = function () {
//   if (xhr.status >= 200 && xhr.status < 300) {
//     const data = JSON.parse(xhr.responseText);
//     console.log(data);
//   } else {
//     console.error("Lỗi:", xhr.status, xhr.statusText);
//   }
// };

// xhr.onerror = function () {
//   console.error("Network error");
// };

// // Gửi request
// xhr.send();

// fetch("https://jsonplaceholder.typicode.com/posts")
//   .then((response) => response.json()) // Parse JSON
//   .then((data) => console.log(data))
//   .catch((err) => console.error("Network error:", err));

// (async () => {
//   const response = await fetch("https://jsonplaceholder.typicode.com/posts");
//   const data = await response.json();
//   console.log(data);
//   const listItems = data.map((post) => {
//     return `<li>${post.title}</li>`;
//   });
//   const postListEl = document.querySelector("#post-list");
//   postListEl.innerHTML = listItems.join("");
//   console.log(listItems);
// })();

// async function createPost(payload) {
//   const response = await fetch("https://jsonplaceholder.typicode.com/posts/2", {
//     method: "GET",
//     // headers: {
//     //   "Content-Type": "application/json",
//     // },
//     // body: JSON.stringify(payload),
//   });

//   const data = await response.json();
//   console.log("Đã lấy chi tiết bài viết:", data);
// }

// createPost({ title: "Bài viết mới update" });

import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";

// GET
const response = await axios.delete(
  "https://jsonplaceholder.typicode.com/posts/2",
  // {
  //   title: "Bài viết mới update",
  //   body: "Nội dung bài viết mới update",
  //   userId: 1,
  // },
);
console.log(response);

// navigator.clipboard.writeText("Copied!"); // Ghi vào clipboard
navigator.clipboard.readText().then((text) => console.log(text)); // Đọc clipboard
