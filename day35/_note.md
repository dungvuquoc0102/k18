# Day 35: Document form, làm việc với APIs, BOM (Browser Object Model)

## Document form

### 1. Truy cập giá trị form

Mỗi loại input có cách lấy giá trị khác nhau:

| Loại input                | Cách lấy giá trị                |
| ------------------------- | ------------------------------- |
| `<input type="text">`     | `input.value`                   |
| `<input type="checkbox">` | `input.checked` (boolean)       |
| `<input type="radio">`    | `input.checked` trên từng radio |
| `<select>`                | `select.value`                  |
| `<textarea>`              | `textarea.value`                |

```html
<input type="text" id="name" value="John" />
<input type="checkbox" id="agree" checked />
<select id="city">
  <option value="hn">Hà Nội</option>
  <option value="hcm" selected>TP.HCM</option>
</select>
```

```js
const name = document.getElementById("name").value; // "John"
const agree = document.getElementById("agree").checked; // true
const city = document.getElementById("city").value; // "hcm"
```

### 2. Attribute vs Property trong form

- **Attribute** (`getAttribute('value')`): giá trị ban đầu trong HTML — không thay đổi khi người dùng gõ.
- **Property** (`.value`): giá trị hiện tại trong DOM — cập nhật theo thời gian thực.

```html
<input type="text" id="email" value="hello@mail.com" />
```

```js
const input = document.getElementById("email");
// Người dùng xóa hết và gõ "new@mail.com"

input.getAttribute("value"); // "hello@mail.com" — không đổi
input.value; // "new@mail.com"   — thay đổi theo thực tế
```

> **Quy tắc nhớ:** Attribute là snapshot HTML ban đầu. Property là trạng thái sống của DOM.

### 3. Submit event và preventDefault

Khi form submit, trình duyệt mặc định gửi HTTP request và reload trang. Dùng `preventDefault()` để chặn hành vi đó và tự xử lý bằng JS.

```html
<form id="loginForm">
  <input type="text" id="username" placeholder="Username" />
  <input type="password" id="password" placeholder="Password" />
  <button type="submit">Đăng nhập</button>
</form>
```

```js
const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Chặn reload trang

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  console.log("Gửi lên server:", { username, password });
  // Gọi fetch() ở đây
});
```

> **Khác với `action` HTML:** `action` trong HTML gửi request với page reload. `preventDefault` + `fetch` gửi request ngầm, không reload — đây là cách SPA hoạt động.

### 4. Validation

Có hai cách validate form phổ biến: **JS thuần** (kiểm tra thủ công từng field) và **Zod** (schema-based validation, phù hợp cho dữ liệu phức tạp).

#### 4.1 Validate bằng JS thuần

Kiểm tra từng điều kiện bằng `if`, hiển thị lỗi thủ công qua DOM.

```html
<form id="registerForm">
  <input type="text" id="username" placeholder="Username" />
  <span id="usernameError" style="color:red"></span>

  <input type="email" id="email" placeholder="Email" />
  <span id="emailError" style="color:red"></span>

  <input type="password" id="password" placeholder="Password" />
  <span id="passwordError" style="color:red"></span>

  <button type="submit">Đăng ký</button>
</form>
```

```js
function showError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  ["usernameError", "emailError", "passwordError"].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
}

function validateForm(data) {
  let isValid = true;

  // Validate username
  if (!data.username || data.username.trim() === "") {
    showError("usernameError", "Username không được để trống");
    isValid = false;
  } else if (data.username.length < 3) {
    showError("usernameError", "Username phải có ít nhất 3 ký tự");
    isValid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showError("emailError", "Email không hợp lệ");
    isValid = false;
  }

  // Validate password
  if (!data.password || data.password.length < 6) {
    showError("passwordError", "Mật khẩu phải có ít nhất 6 ký tự");
    isValid = false;
  }

  return isValid;
}

document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const data = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    if (validateForm(data)) {
      console.log("Dữ liệu hợp lệ, gửi lên server:", data);
    }
  });
```

> **Ưu điểm:** Không cần thư viện, kiểm soát hoàn toàn logic. **Nhược điểm:** Verbose, dễ sót case khi form có nhiều field.

#### 4.2 Validate bằng Zod

Zod là thư viện schema validation — định nghĩa "hình dạng" dữ liệu một lần, Zod tự lo phần kiểm tra.

**Cài đặt:**

```bash
npm install zod
```

**Định nghĩa schema và validate:**

```js
import { z } from "zod";

// Định nghĩa schema
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(20, "Username tối đa 20 ký tự"),

  email: z.string().email("Email không hợp lệ"),

  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa"),
});

// Dùng trong submit handler
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const data = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    // safeParse: không throw, trả về { success, data } hoặc { success, error }
    const result = registerSchema.safeParse(data);

    if (!result.success) {
      // Lấy danh sách lỗi theo từng field
      const errors = result.error.flatten().fieldErrors;
      // errors = { username: ["..."], email: ["..."], password: ["..."] }

      if (errors.username) showError("usernameError", errors.username[0]);
      if (errors.email) showError("emailError", errors.email[0]);
      if (errors.password) showError("passwordError", errors.password[0]);
    } else {
      console.log("Dữ liệu hợp lệ:", result.data);
    }
  });
```

**So sánh `parse` vs `safeParse`:**

| Method            | Khi hợp lệ                | Khi không hợp lệ            |
| ----------------- | ------------------------- | --------------------------- |
| `parse(data)`     | Trả về data               | **Throw** `ZodError`        |
| `safeParse(data)` | `{ success: true, data }` | `{ success: false, error }` |

> Dùng `safeParse` trong form để tự xử lý lỗi. Dùng `parse` khi muốn bắt lỗi bằng `try/catch`.

**Các validator hay dùng trong Zod:**

```js
z.string().min(1); // Không được rỗng
z.string().max(100); // Tối đa 100 ký tự
z.string().email(); // Định dạng email
z.string().url(); // Định dạng URL
z.string().regex(/pattern/); // Khớp regex

z.number().min(0); // Số không âm
z.number().max(100); // Số tối đa 100
z.number().int(); // Phải là số nguyên

z.boolean();
z.array(z.string()).min(1); // Mảng string, ít nhất 1 phần tử
z.enum(["admin", "user"]); // Chỉ cho phép các giá trị cụ thể
z.optional(); // Field không bắt buộc
```

### 5. FormData API

`FormData` đọc toàn bộ form một lúc — không cần lấy từng `input.value`. Hỗ trợ file upload.

```html
<form id="registerForm">
  <input type="text" name="fullname" />
  <input type="email" name="email" />
  <input type="file" name="avatar" />
  <button type="submit">Đăng ký</button>
</form>
```

```js
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this); // "this" là form element

    // Đọc từng field
    console.log(formData.get("fullname"));
    console.log(formData.get("email"));

    // Hoặc duyệt tất cả
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Gửi lên server (hỗ trợ multipart/form-data cho file)
    fetch("/api/register", {
      method: "POST",
      body: formData,
    });
  });
```

### 6. Reset form

```html
<form id="myForm">
  <input type="text" name="note" value="default text" />
  <button type="reset">Reset</button>
  <button type="button" onclick="clearForm()">Clear</button>
</form>
```

```js
function clearForm() {
  const form = document.getElementById("myForm");

  // reset(): trả về giá trị mặc định (attribute "value" ban đầu)
  form.reset(); // input sẽ trở lại "default text"

  // clear: set tất cả về ""
  form.querySelectorAll("input, textarea, select").forEach((el) => {
    el.value = "";
  });
}
```

> **`reset()` vs clear:** `reset()` trả về giá trị `value` attribute ban đầu trong HTML. Clear thủ công xóa trắng hoàn toàn.

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

`fetch` là API hiện đại, Promise-based, clean hơn XHR nhiều. Là chuẩn hiện tại để giao tiếp với server từ browser.

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

**⚠️ Gotcha quan trọng — fetch không throw khi 4xx/5xx:**

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
history.go(-2); // Quay lại 2 trang
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
console.log(navigator.onLine); // true/false — có kết nối mạng không

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
  const newTab = window.open("https://google.com", "_blank");
  // "_blank": tab mới, "_self": tab hiện tại

  // Đóng tab bằng JS (chỉ đóng được tab do JS mở)
  setTimeout(() => newTab.close(), 5000);
});
```
