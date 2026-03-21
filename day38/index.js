// localStorage.setItem("theme", "light");
// const theme = localStorage.getItem("theme");

// console.log(theme);

// localStorage.setItem("settings", JSON.stringify({ theme: "dark", lang: "vi" }));
// const name = '""';
// localStorage.setItem("name", name);

// localStorage.removeItem("name");
// localStorage.clear();

// sessionStorage.setItem("cart_step", "2");

// document.cookie = "username=alice";

// document.cookie = "token=abc123; max-age=5";

// document.cookie = "theme=dark; expires=31 Dec 2026 23:59:59";

// document.cookie = "session=xyz; httpOnly";

// console.log(document.cookie);

// const cookieString = document.cookie;
// "theme=dark; session=xyz"
// const cookies = cookieString.split("; ").reduce((acc, cookie) => {
//   const [key, value] = cookie.split("=");
//   acc[key] = value;
//   return acc;
// }, {});

// console.log(cookies);

// fetch("https://jsonplaceholder.typicode.com/todos/1")
//   .then((response) => response.json())
//   .then((json) => console.log(json));

// Auth:
// 1. Đăng nhập:
// - Thông tin email, password lên server
// - Server kiểm tra thông tin, nếu đúng email và password lưu trong DB,
//  thì tạo ra 1 access token (JWT) và 1 refresh token (random string) rồi trả về cho client
// - Client lưu access token và refresh token vào localStorage

// 2. Ở trang chủ:
// - Client gửi request lấy thông tin user lên server kèm theo access token
// - Server kiểm tra access token, nếu hợp lệ trả về thông tin user

// 3. Khi access token hết hạn:
// - Client gửi request để refresh token lên server
// - Server kiểm tra refresh token, nếu hợp lệ tạo ra access_token mới và refresh_token mới trả về cho client
// - Client gửi lại request bị lỗi ở bước 2 với access token mới, nếu hợp lệ trả về thông tin user

// 4. Đăng xuất:
// - Client xóa access token và refresh token khỏi localStorage
