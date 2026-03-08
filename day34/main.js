// Memory Management
// let user = {
//   name: "John",
//   age: 20,
// };
// user = null;
// user.name;

// - Closure giữ reference
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
  setTimeout(() => reject("A"), 1000),
);
const p2 = new Promise((resolve) => setTimeout(() => resolve("B"), 2000));

// Promise.all([p1, p2]).then((results) => {
//   console.log("Promise.all results:", results);
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
Promise.allSettled([p1, p2]).then((results) => {
  console.log("Promise.allSettled results:", results);
});
