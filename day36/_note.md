# Day 35: Làm việc với APIs, BOM (Browser Object Model)

## Làm việc với APIs

### 1. XHR (XMLHttpRequest)

Định nghĩa:

- API của trình duyệt để gửi HTTP request tới server để lấy dữ liệu mà không cần reload trang.

Ví dụ:

```js
const xhr = new XMLHttpRequest();

// Cấu hình request
xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1");

// Lắng nghe kết quả
xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 300) {
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  } else {
    console.error("Lỗi:", xhr.status, xhr.statusText);
  }
};

xhr.onerror = function () {
  console.error("Network error");
};

// Gửi request
xhr.send();
```

**POST với XHR:**

```js
const xhr = new XMLHttpRequest();
xhr.open("POST", "https://jsonplaceholder.typicode.com/posts");
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onload = function () {
  console.log(JSON.parse(xhr.responseText));
};

xhr.send(JSON.stringify({ title: "Hello", body: "World", userId: 1 }));
```

> **Tại sao không dùng XHR nữa:** Event-based thay vì Promise, verbose, khó chain. `fetch` giải quyết tất cả vấn đề này.

---

### 2. Fetch API

`fetch` là API hiện đại, Promise-based, clean hơn XHR. Là chuẩn hiện tại để giao tiếp với server từ browser.

**GET request:**

```js
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => response.json()) // Parse JSON
  .then((data) => console.log(data))
  .catch((err) => console.error("Network error:", err));
```

**Hoặc dùng async/await:**

```js
async function getPost(id) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  );
  const data = await response.json();
  console.log(data);
}
```

**POST request:**

```js
async function createPost(payload) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log("Đã tạo:", data);
}

createPost({ title: "Bài viết mới", body: "Nội dung...", userId: 1 });
```

**⚠️ fetch không throw khi 4xx/5xx:**

```js
async function safeFetch(url) {
  const response = await fetch(url);

  // fetch chỉ throw khi network fail (mất mạng, DNS sai)
  // Còn 404, 500 vẫn "thành công" theo fetch — phải tự kiểm tra
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

// Dùng:
safeFetch("https://jsonplaceholder.typicode.com/posts/999")
  .then((data) => console.log(data))
  .catch((err) => console.error(err.message)); // "HTTP error: 404"
```

**Các thuộc tính của Response:**

```js
const response = await fetch("/api/data");

response.status; // 200, 404, 500...
response.ok; // true nếu status 200–299
response.statusText; // "OK", "Not Found"...
response.headers.get("Content-Type"); // Đọc response header

// Đọc body — mỗi method chỉ gọi được 1 lần
await response.json(); // Parse JSON
await response.text(); // Plain text
await response.blob(); // File / ảnh
```

**Gửi kèm token xác thực:**

```js
const token = localStorage.getItem("access_token");

const response = await fetch("/api/user/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

---

### 3. Axios

Axios là thư viện wrapper phổ biến trên XHR (browser) hoặc http module (Node.js). Giải quyết một số điểm bất tiện của `fetch`.

**Cài đặt:**

```bash
npm install axios
```

**Dùng Axios:**

```js
import axios from "axios";

// GET
const response = await axios.get(
  "https://jsonplaceholder.typicode.com/posts/1",
);
console.log(response.data); // Đã parse JSON, không cần gọi .json()

// POST
await axios.post("/api/login", { email: "john@mail.com", password: "123" });

// PUT / DELETE
await axios.put("/api/posts/1", { title: "Updated" });
await axios.delete("/api/posts/1");
```

**Axios instance — cấu hình một lần, dùng nhiều nơi:**

```js
const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: gắn token vào mọi request tự động
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn — redirect về login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Dùng instance như bình thường
const { data } = await api.get("/users/me");
```

> **Dùng cái nào?** `fetch` đủ cho hầu hết trường hợp và không cần cài thêm. Axios hữu ích trong project lớn cần interceptor, xử lý lỗi tập trung, hoặc upload file có progress.

**So sánh fetch vs axios:**

| Tính năng                    | fetch                       | axios                        |
| ---------------------------- | --------------------------- | ---------------------------- |
| Throw khi 4xx/5xx            | ❌ Không — phải tự kiểm tra | ✅ Tự động throw             |
| Tự parse JSON                | ❌ Phải gọi `.json()`       | ✅ `response.data` là object |
| Request/Response interceptor | ❌ Không có sẵn             | ✅ Có — cực hữu ích          |
| Cancel request               | AbortController             | AbortController              |
| Upload progress              | ❌                          | ✅ `onUploadProgress`        |

## BOM (Browser Object Model)

### 1. window — Global object

#### Định nghĩa:

`window` là object global trong trình duyệt. Mọi biến global khai báo bằng `var` đều tự động thành property của `window`.

#### Ví dụ:

```js
var siteName = "F8";
console.log(window.siteName); // "F8"

// let/const thì không
let version = "2.0";
console.log(window.version); // undefined
```

> `window.` có thể bỏ qua — `alert()` chính là `window.alert()`, `setTimeout()` chính là `window.setTimeout()`.

### 2. window.location — URL và điều hướng

`location` cho phép đọc URL hiện tại và điều hướng trang.

```
URL: https://example.com:8080/products?category=phone&page=2#top
```

| Property            | Giá trị                                                         |
| ------------------- | --------------------------------------------------------------- |
| `location.href`     | `"https://example.com:8080/products?category=phone&page=2#top"` |
| `location.protocol` | `"https:"`                                                      |
| `location.host`     | `"example.com:8080"`                                            |
| `location.hostname` | `"example.com"`                                                 |
| `location.port`     | `"8080"`                                                        |
| `location.pathname` | `"/products"`                                                   |
| `location.search`   | `"?category=phone&page=2"`                                      |
| `location.hash`     | `"#top"`                                                        |
| `location.origin`   | `"https://example.com:8080"`                                    |

```js
// Đọc query string
const params = new URLSearchParams(location.search);
console.log(params.get("category")); // "phone"
console.log(params.get("page")); // "2"

// Điều hướng
location.href = "https://google.com"; // Điều hướng, lưu history
location.assign("https://google.com"); // Giống href
location.replace("https://google.com"); // Điều hướng, KHÔNG lưu history (không back được)
location.reload(); // Tải lại trang
```

### 3. window.history — Điều hướng không reload

`history` cho phép thay đổi URL và điều hướng mà không reload trang — đây là nền tảng của **client-side routing** (React Router, Vue Router).

```js
// Thêm trạng thái mới vào history stack
// pushState(state, title, url)
history.pushState({ page: "products" }, "", "/products");
// URL đổi thành /products nhưng trang không reload

history.pushState({ page: "detail", id: 5 }, "", "/products/5");

// replaceState: thay thế entry hiện tại thay vì thêm mới
history.replaceState({ page: "products" }, "", "/products");

// Điều hướng
history.back(); // Quay lại — giống nút Back
history.forward(); // Tiến lên — giống nút Forward
// Quay lại 2 trang
history.go(1); // Tiến 1 trang

// Lắng nghe khi người dùng bấm Back/Forward
window.addEventListener("popstate", function (e) {
  console.log("State:", e.state); // { page: 'products' }
  // Render lại UI tương ứng với URL mới
});
```

### 4. window.navigator — Thông tin trình duyệt & thiết bị

```js
console.log(navigator.userAgent); // Chuỗi mô tả trình duyệt/hệ điều hành
console.log(navigator.language); // "vi-VN" — ngôn ngữ người dùng
// true/false — có kết nối mạng không

// Geolocation
navigator.geolocation.getCurrentPosition(
  (pos) => {
    console.log(pos.coords.latitude); // Vĩ độ
    console.log(pos.coords.longitude); // Kinh độ
  },
  (err) => console.error("Lỗi:", err.message),
);

// Clipboard (yêu cầu HTTPS)
navigator.clipboard.writeText("Copied!"); // Ghi vào clipboard
navigator.clipboard.readText().then((text) => console.log(text)); // Đọc clipboard
```

### 5. window.screen

```js
// Màn hình vật lý
console.log(screen.width); // 1920 — độ phân giải màn hình
console.log(screen.height); // 1080
console.log(screen.availWidth); // 1920 — trừ thanh taskbar

// Viewport (vùng hiển thị trình duyệt — thay đổi khi resize)
console.log(window.innerWidth); // 1200 — chiều rộng viewport
console.log(window.innerHeight); // 800  — chiều cao viewport

// Lắng nghe resize
window.addEventListener("resize", () => {
  console.log(`Viewport: ${window.innerWidth}x${window.innerHeight}`);
});
```

### 6. Timers — setTimeout & setInterval

```js
// setTimeout: chạy 1 lần sau delay
const timerId = setTimeout(() => {
  console.log("Chạy sau 2 giây");
}, 2000);

clearTimeout(timerId); // Hủy nếu chưa chạy

// setInterval: chạy lặp lại
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log("Tick:", count);
  if (count >= 5) clearInterval(intervalId); // Dừng sau 5 lần
}, 1000);
```

> **Lưu ý:** Timer không chạy đúng giờ tuyệt đối — nó phụ thuộc vào Event Loop. Nếu main thread đang bận, timer sẽ bị delay.

```js
// Demo: setTimeout 0ms nhưng chạy sau synchronous code
console.log("1");
setTimeout(() => console.log("2 — async"), 0);
console.log("3");
// Output: 1, 3, 2 — vì setTimeout luôn vào Task Queue
```

### 7. Dialog: alert, confirm, prompt

```js
// alert: hiển thị thông báo, không có giá trị trả về
window.alert("Xin chào!");

// confirm: trả về true (OK) hoặc false (Cancel)
const agreed = window.confirm("Bạn có chắc muốn xóa không?");
if (agreed) console.log("Đã xóa");

// prompt: trả về string người dùng nhập, hoặc null nếu Cancel
const name = window.prompt("Bạn tên gì?", "Mặc định");
console.log("Tên:", name);
```

> Tránh dùng trong production — block UI, trông cũ, không custom được style.

### 8. window.open / close

```js
// Mở tab/popup mới — phải từ user gesture (click) mới không bị chặn
button.addEventListener("click", () => {
  const newTab = window.open("/abc", "_blank");
  // "_blank": tab mới, "_self": tab hiện tại

  // Đóng tab bằng JS (chỉ đóng được tab do JS mở)
  setTimeout(() => newTab.close(), 5000);
});
```
