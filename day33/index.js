const promise = new Promise((resolve, reject) => {
  console.log("Bắt đầu hành động 1");
  setTimeout(() => {
    resolve("Xong hành động 1");
  }, 5000);
});

promise
  .then((result) => {
    console.log(result);
    console.log("Bắt đầu hành động 2");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Xong hành động 2");
      }, 5000);
    });
  })
  .then((result) => {
    console.log(result);
  });

// const promise = new Promise((resolve, reject) => {
//   console.log("Hành động 1");
//   resolve("Hành động 2");
// });
// promise.then((result) => {
//   console.log(result);
// });

// async function C() {
//   async function B() {
//     const response = await fetch(
//       "https://jsonplaceholder.typicode.com/posts/1",
//     );
//     const data = await response.json();
//     console.log(data);
//   }
//   await B();
// }
// C();

// function A(callback) {
//   const resolve = () => {
//     console.log("Hành động 1");
//   };
//   const reject = () => {
//     console.log("Hành động 2");
//   };
//   callback(resolve, reject);
// }

// A((resolve, reject) => {
//   resolve();
// });
