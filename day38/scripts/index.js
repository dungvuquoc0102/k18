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

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");

  const response = await fetch(
    "https://api.escuelajs.co/api/v1/auth/refresh-token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    },
  );

  if (!response.ok) {
    // Refresh token cũng hết hạn — yêu cầu đăng nhập lại
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  const { access_token, refresh_token } = await response.json();
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
}

async function getProfile() {
  if (!isLoggedIn()) {
    window.location.href = "/k18/day38/login.html";
  }

  const accessToken = localStorage.getItem("access_token");

  const response = await fetch("https://api.escuelajs.co/api/v1/auth/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    await refreshAccessToken();
    return getProfile();
  }

  const profile = await response.json();
  return profile;
}

function isLoggedIn() {
  return !!localStorage.getItem("access_token");
}

// Dùng:

const emailEl = document.querySelector("#email");
(async () => {
  const profile = await getProfile();
  if (profile) {
    emailEl.textContent = profile.email;
  }
})();

const logoutBtn = document.querySelector("#logout-btn");
logoutBtn.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "/k18/day38/login.html";
});
