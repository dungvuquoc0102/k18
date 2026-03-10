// const name = document.querySelector("#name").value; // "John"
// const agree = document.querySelector("#agree").checked; // true
// const city = document.querySelector("#city").value; // "hcm"

// const inputEl = document.querySelector("#name");

// const form = document.querySelector("#loginForm");

// form.addEventListener("submit", function (e) {
//   e.preventDefault(); // Chặn reload trang

//   const username = document.querySelector("#username").value;
//   const password = document.querySelector("#password").value;

//   console.log("Gửi lên server:", { username, password });
//   // Gọi fetch() ở đây
// });

function showError(id, message) {
  document.querySelector(`#${id}`).textContent = message;
}

function clearErrors() {
  ["usernameError", "emailError", "passwordError"].forEach((id) => {
    document.querySelector(`#${id}`).textContent = "";
  });
}

// Validation bằng JS
// function validateForm(data) {
//   let isValid = true;

//   // Validate username
//   if (!data.username || data.username.trim() === "") {
//     showError("usernameError", "Username không được để trống");
//     isValid = false;
//   } else if (data.username.length < 3) {
//     showError("usernameError", "Username phải có ít nhất 3 ký tự");
//     isValid = false;
//   }

//   // Validate email
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!data.email || !emailRegex.test(data.email)) {
//     showError("emailError", "Email không hợp lệ");
//     isValid = false;
//   }

//   // Validate password
//   if (!data.password || data.password.length < 6) {
//     showError("passwordError", "Mật khẩu phải có ít nhất 6 ký tự");
//     isValid = false;
//   }

//   return isValid;
// }

// document
//   .querySelector("#registerForm")
//   .addEventListener("submit", function (e) {
//     e.preventDefault();
//     clearErrors();

//     const data = {
//       username: document.querySelector("#username").value,
//       email: document.querySelector("#email").value,
//       password: document.querySelector("#password").value,
//     };

//     if (validateForm(data)) {
//       console.log("Dữ liệu hợp lệ, gửi lên server:", data);
//     }
//   });

// Validation bằng Zod
// import z from "https://cdn.jsdelivr.net/npm/zod@4.3.6/+esm";

// // Định nghĩa schema
// const registerSchema = z.object({
//   username: z.string(),

//   email: z.string().email("Email không hợp lệ"),

//   password: z
//     .string()
//     .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
//     .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa"),
// });

// // Dùng trong submit handler
// document
//   .getElementById("registerForm")
//   .addEventListener("submit", function (e) {
//     e.preventDefault();
//     clearErrors();

//     const data = {
//       username: document.getElementById("username").value,
//       email: document.getElementById("email").value,
//       password: document.getElementById("password").value,
//     };

//     // safeParse: không throw, trả về { success, data } hoặc { success, error }
//     const result = registerSchema.safeParse(data);

//     if (!result.success) {
//       // Lấy danh sách lỗi theo từng field
//       const errors = result.error.flatten().fieldErrors;
//       // errors = { username: ["..."], email: ["..."], password: ["..."] }

//       if (errors.username) showError("usernameError", errors.username[0]);
//       if (errors.email) showError("emailError", errors.email[0]);
//       if (errors.password) showError("passwordError", errors.password[0]);
//     } else {
//       console.log("Dữ liệu hợp lệ:", result.data);
//     }
//   });
