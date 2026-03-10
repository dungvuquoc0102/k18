// Memory Management

// function createUser() {
//   const name = "John";
//   const age = 20;
//   return { name, age };
// }
// createUser();

// let user = {
//   name: "John",
//   age: 20,
// };
// user = null;
// user.name;

// - Closure giữ reference
// Closure là hiện tượng một hàm con có thể truy cập biến của hàm cha mặc dù hàm cha đã kết thúc
// const number = 10;
// function createCounter() {
//   let count = 0;
//   return function () {
//     count++;
//     console.log(count);
//   };
// }
// const counter = createCounter();
// counter(); // 1
// counter(); // 2

// counter = null;

// - Event listener giữ reference
// const button = document.getElementById("myButton");
// function handleClick() {
//   console.log("Button clicked");
// }
// button.addEventListener("click", handleClick);
// Sau này nếu muốn dọn, phải removeEventListener(handleClick) trước

// Promise.all, Promise.race, Promise.allSettled
// - Promise.all: chờ tất cả promise hoàn thành, nếu có 1 cái reject thì reject luôn

const p1 = new Promise((resolve, reject) =>
  setTimeout(() => resolve("A"), 1000),
);
const p2 = new Promise((resolve, reject) =>
  setTimeout(() => reject("B"), 2000),
);

console.time("Promise.all");

const results = [];

p1.then((result) => {
  results.push(result);
  if (results.length === 2) {
    console.log("Promise.all results:", results);
    console.timeEnd("Promise.all");
  }
});

p2.then((result) => {
  results.push(result);
  if (results.length === 2) {
    console.log("Promise.all results:", results);
    console.timeEnd("Promise.all");
  }
}).catch((error) => {
  results.push({
    type: "error",
    message: error?.message || "Promise rejected",
  });
  if (results.length === 2) {
    console.log("Promise.all results:", results);
    console.timeEnd("Promise.all");
  }
});

// Promise.all([p1, p2]).then((results) => {
//   console.log("Promise.all results:", results);
//   console.timeEnd("Promise.all");
// });

// - Promise.race: chờ promise nào hoàn thành trước (resolve hoặc reject) thì trả về kết quả đó
// Promise.race([p1, p2])
//   .then((result) => {
//     console.log("Promise.race result:", result);
//   })
//   .catch((error) => {
//     console.log("Promise.race error:", error);
//   });

// - Promise.allSettled: chờ tất cả promise hoàn thành (dù resolve hay reject) rồi trả về mảng kết quả
// Promise.allSettled([p1, p2]).then((results) => {
//   console.log("Promise.allSettled results:", results);
// });
