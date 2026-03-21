# Day 37: Browser Storage, Auth với JWT, Vite

## Browser Storage

Trình duyệt cung cấp nhiều cơ chế lưu trữ dữ liệu phía client. Mỗi loại có mục đích và giới hạn khác nhau.

### 1. localStorage

Lưu dữ liệu dạng key-value, tồn tại vĩnh viễn cho đến khi bị xóa thủ công. Dung lượng khoảng 5–10 MB.

```js
// Lưu
localStorage.setItem("username", "alice");
localStorage.setItem("settings", JSON.stringify({ theme: "dark", lang: "vi" }));

// Đọc
const username = localStorage.getItem("username"); // "alice"
const settings = JSON.parse(localStorage.getItem("settings")); // { theme: 'dark', ... }

// Xóa
localStorage.removeItem("username");
localStorage.clear(); // Xóa tất cả
```

> Chỉ lưu được string — object/array phải `JSON.stringify` trước khi lưu và `JSON.parse` khi đọc ra.

---

### 2. sessionStorage

Giống `localStorage` nhưng dữ liệu bị xóa khi đóng tab/trình duyệt. Dùng cho dữ liệu tạm thời trong một phiên làm việc.

```js
sessionStorage.setItem("cart_step", "2");
const step = sessionStorage.getItem("cart_step"); // "2"
sessionStorage.removeItem("cart_step");
```

| Đặc điểm       | localStorage     | sessionStorage        |
| -------------- | ---------------- | --------------------- |
| Thời gian sống | Vĩnh viễn        | Đóng tab thì mất      |
| Chia sẻ tab    | Có (cùng origin) | Không — mỗi tab riêng |
| Dung lượng     | ~5–10 MB         | ~5 MB                 |
| Truy cập từ JS | Có               | Có                    |

---

### 3. Cookie

Cookie là cơ chế lưu trữ cũ nhất, nhưng có điểm đặc biệt mà `localStorage` không có: **tự động gửi kèm trong mọi HTTP request** đến cùng domain.

#### Tạo cookie bằng JavaScript:

```js
// Tạo cookie đơn giản
document.cookie = "username=alice";

// Cookie với thời hạn (max-age tính bằng giây)
document.cookie = "token=abc123; max-age=3600"; // Hết hạn sau 1 giờ

// Cookie với expires (ngày cụ thể)
document.cookie = "theme=dark; expires=Fri, 31 Dec 2025 23:59:59 GMT";

// Cookie chỉ gửi qua HTTPS
document.cookie = "session=xyz; secure";

// Cookie không truy cập được từ JS (chỉ server đọc được)
document.cookie = "session=xyz; httpOnly"; // ⚠️ chỉ server mới set được httpOnly
```

#### Đọc cookie:

```js
// document.cookie trả về toàn bộ cookie dưới dạng 1 string
console.log(document.cookie); // "username=alice; theme=dark; token=abc123"

// Parse cookie thành object
function getCookies() {
  return document.cookie.split("; ").reduce((acc, pair) => {
    const [key, value] = pair.split("=");
    acc[key] = value;
    return acc;
  }, {});
}

const cookies = getCookies();
console.log(cookies.username); // "alice"
```

#### Xóa cookie:

```js
// Xóa bằng cách đặt expires về quá khứ
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
```

#### Các thuộc tính quan trọng của Cookie:

| Thuộc tính | Ý nghĩa                                                     |
| ---------- | ----------------------------------------------------------- |
| `max-age`  | Số giây sống. Nếu không có, cookie mất khi đóng trình duyệt |
| `expires`  | Ngày hết hạn cụ thể                                         |
| `domain`   | Domain nào được gửi cookie (mặc định: domain hiện tại)      |
| `path`     | Path nào được gửi cookie (mặc định: `/`)                    |
| `secure`   | Chỉ gửi qua HTTPS                                           |
| `httpOnly` | JS không đọc được — chỉ server thấy. Chống XSS              |
| `SameSite` | Kiểm soát khi nào cookie được gửi kèm request từ site khác  |

#### SameSite — quan trọng với CORS:

```
SameSite=Strict  — Không bao giờ gửi cookie khi request đến từ site khác
SameSite=Lax     — Gửi cookie khi navigate (click link), không gửi khi fetch/XHR từ site khác
SameSite=None    — Luôn gửi (kể cả cross-site) — BẮT BUỘC phải có Secure
```

---

### 4. CORS (Cross-Origin Resource Sharing)

#### Vấn đề:

Trình duyệt chặn request từ `http://localhost:3000` gọi đến `https://api.example.com` vì khác **origin** (scheme + hostname + port). Đây gọi là **Same-Origin Policy**.

CORS là cơ chế để server nói với trình duyệt: "Tôi cho phép origin này truy cập".

#### Origin là gì?

```
https://example.com:443/page
│       │           │
scheme  hostname    port   → 3 thứ này phải giống nhau mới là cùng origin
```

```
https://example.com  ≠  http://example.com   (khác scheme)
https://example.com  ≠  https://api.example.com  (khác hostname)
https://example.com  ≠  https://example.com:8080 (khác port)
```

#### Cách CORS hoạt động:

Khi làm request cross-origin, trình duyệt gửi thêm header `Origin`:

```
GET /api/users HTTP/1.1
Origin: http://localhost:3000
```

Server cần trả về header cho phép:

```
Access-Control-Allow-Origin: http://localhost:3000
// hoặc
Access-Control-Allow-Origin: *   // Cho phép tất cả (không dùng với credentials)
```

#### Preflight request:

Với các request "phức tạp" (POST/PUT/DELETE, hoặc có custom header như `Authorization`), trình duyệt gửi **OPTIONS request trước** để hỏi server có cho phép không:

```
OPTIONS /api/login HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

Server phải trả lời:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400   // Cache preflight 24h, không gửi lại
```

#### CORS với Cookie (credentials):

Mặc định fetch không gửi cookie khi cross-origin. Phải bật thủ công:

```js
// Phía client — thêm credentials: "include"
fetch("https://api.example.com/profile", {
  credentials: "include", // Gửi cookie kèm theo
});
```

Server phải có:

```
Access-Control-Allow-Origin: http://localhost:3000  // Không được dùng * khi có credentials
Access-Control-Allow-Credentials: true
```

> **Lỗi CORS là lỗi browser, không phải lỗi server.** Server đã nhận và xử lý request xong, nhưng browser chặn response vì thiếu header cho phép. Fix CORS phải sửa ở server (thêm header), không sửa được ở client.

---

## Auth cơ bản với JWT và localStorage

### 1. JWT là gì?

JWT (JSON Web Token) là chuẩn encode thông tin người dùng vào một chuỗi string compact, gồm 3 phần ngăn cách bởi dấu `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← Header (base64)
.eyJzdWIiOjEsImlhdCI6MTY3Mjc2NjAyOH0   ← Payload (base64) — chứa userId, role, exp...
.kCak9sLJr74frSRVQp0_27BY4iBCgQSmoT3v  ← Signature (HMAC) — server ký, không giả mạo được
```

Payload sau khi decode:

```json
{
  "sub": 1,
  "iat": 1672766028,
  "exp": 1674494028
}
```

> JWT không mã hóa — ai cũng decode được payload. Không lưu thông tin nhạy cảm (password, thẻ ngân hàng) trong JWT.

---

### 2. API thực hành — Platzi Fake Store API

Base URL: `https://api.escuelajs.co/api/v1`

Account có sẵn để test:

```
Email:    john@mail.com
Password: changeme
```

---

### 3. Login — lấy token

```js
async function login(email, password) {
  const response = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Sai email hoặc mật khẩu");
  }

  const { access_token, refresh_token } = await response.json();

  // Lưu token vào localStorage
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);

  return access_token;
}

// Gọi
login("john@mail.com", "changeme").then(() => {
  console.log("Đăng nhập thành công");
});
```

Response từ server:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> Access token hợp lệ 20 ngày. Refresh token hợp lệ 10 giờ.

---

### 4. Lấy thông tin profile (protected route)

```js
async function getProfile() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  const response = await fetch("https://api.escuelajs.co/api/v1/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // Token hết hạn — xóa và redirect về login
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    return;
  }

  const user = await response.json();
  console.log(user);
  return user;
}
```

Response:

```json
{
  "id": 1,
  "email": "john@mail.com",
  "name": "Jhon",
  "role": "customer",
  "avatar": "https://..."
}
```

---

### 5. Refresh token — lấy access token mới

```js
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
```

---

### 6. Logout

```js
function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}
```

---

### 7. Kiểm tra đăng nhập

```js
function isLoggedIn() {
  return !!localStorage.getItem("access_token");
}

// Dùng:
if (!isLoggedIn()) {
  window.location.href = "/login";
}
```

---

### 8. Tổng hợp luồng Auth

```
1. User nhập email + password
2. POST /auth/login → nhận access_token + refresh_token
3. Lưu cả hai vào localStorage
4. Mọi request protected: gửi kèm Authorization: Bearer <access_token>
5. Nếu server trả 401 → dùng refresh_token để lấy access_token mới
6. Nếu refresh cũng thất bại → xóa token, redirect về /login
7. Logout: xóa token khỏi localStorage
```
