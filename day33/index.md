# Bất đồng bộ trong JavaScript & Browser Storage

## I. MỤC TIÊU BUỔI HỌC

- Giải thích được tại sao JS cần bất đồng bộ và Event Loop hoạt động như thế nào
- Viết code với Callback, Promise, và async/await thành thạo
- Phân biệt và sử dụng đúng LocalStorage, SessionStorage, Cookie, IndexedDB
- Kết hợp fetch API với async/await để gọi API thực tế

## II. NỘI DUNG

### PHẦN 1 — Tại sao cần bất đồng bộ?

**Lý thuyết:**

JavaScript là ngôn ngữ **single-threaded** — tức là chỉ có 1 luồng xử lý, mỗi lúc chỉ làm được 1 việc. Nếu một tác vụ mất nhiều thời gian (gọi API, đọc file, đợi timer), nó sẽ **block** toàn bộ chương trình — giao diện đứng hình, không tương tác được.

Bất đồng bộ cho phép JS **ủy thác** các tác vụ chậm ra ngoài, tiếp tục chạy các lệnh tiếp theo, khi tác vụ hoàn tất thì quay lại xử lý kết quả.

**Ví dụ minh họa đồng bộ vs bất đồng bộ:**

```javascript
// ❌ Đồng bộ — giả sử fetchData mất 3 giây → BLOCK
const data = fetchDataSync(); // đứng ở đây 3 giây
console.log("Dòng này phải đợi 3 giây mới chạy");
console.log(data);

// ✅ Bất đồng bộ — không block
fetchDataAsync(function (data) {
  console.log(data); // chạy sau khi có data
});
console.log("Dòng này chạy ngay, không cần đợi"); // chạy trước
```

### PHẦN 2 — Event Loop

**Lý thuyết:**

Đây là cơ chế nền tảng giải thích bất đồng bộ hoạt động như thế nào.

```
┌─────────────────────────┐
│        Call Stack        │  ← JS đang chạy lệnh nào
└────────────┬────────────┘
             │ trống?
             ▼
┌─────────────────────────┐
│      Microtask Queue     │  ← Promise.then, async/await (ưu tiên cao hơn)
└────────────┬────────────┘
             │ hết microtask?
             ▼
┌─────────────────────────┐
│    Macrotask Queue       │  ← setTimeout, setInterval, I/O callback
└─────────────────────────┘
```

**Quy tắc hoạt động:**

1. JS chạy hết code đồng bộ trong Call Stack
2. Call Stack trống → lấy tất cả **Microtask** ra chạy (Promise callback)
3. Microtask hết → lấy **1 Macrotask** ra chạy
4. Lặp lại từ bước 2

**Ví dụ — đoán thứ tự output:**

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Kết quả: 1 → 4 → 3 → 2
// Giải thích:
// - "1", "4": code đồng bộ, chạy trước
// - "3": microtask (Promise), chạy trước macrotask
// - "2": macrotask (setTimeout), chạy cuối
```

**Bài tập nhanh :** Cho học viên đoán output của đoạn code phức tạp hơn có nhiều Promise lồng nhau.

### PHẦN 3 — Callback

**Lý thuyết:**

Callback là hàm được truyền vào như tham số và gọi lại sau khi tác vụ hoàn thành. Đây là cách bất đồng bộ nguyên thủy nhất.

```javascript
function layDuLieu(url, callback) {
  setTimeout(() => {
    const data = { name: "Nguyen Van A", age: 25 };
    callback(null, data); // convention: (error, result)
  }, 1000);
}

layDuLieu("https://api.example.com/user", function (err, data) {
  if (err) {
    console.error("Lỗi:", err);
    return;
  }
  console.log("Dữ liệu:", data);
});
```

**Callback Hell — vấn đề lớn nhất:**

```javascript
// ❌ Callback hell: khó đọc, khó debug, khó maintain
dangNhap(user, function (err, token) {
  if (err) return handleError(err);
  layThongTinUser(token, function (err, userInfo) {
    if (err) return handleError(err);
    layDanhSachDonHang(userInfo.id, function (err, orders) {
      if (err) return handleError(err);
      tinhTongTien(orders, function (err, total) {
        if (err) return handleError(err);
        console.log("Tổng tiền:", total); // "Pyramid of Doom"
      });
    });
  });
});
```

**Khi nào vẫn dùng callback:** Event listener (`addEventListener`), Node.js streams, các API cũ.

### PHẦN 4 — Promise

**Lý thuyết:**

Promise là object đại diện cho một giá trị **chưa có ngay** nhưng sẽ có trong tương lai (hoặc thất bại). Promise có 3 trạng thái:

- `pending` — đang xử lý
- `fulfilled` — thành công, có giá trị
- `rejected` — thất bại, có lý do lỗi

```javascript
// Tạo Promise
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Thành công!"); // chuyển sang fulfilled
  } else {
    reject("Có lỗi xảy ra"); // chuyển sang rejected
  }
});

// Tiêu thụ Promise
promise
  .then((result) => console.log(result)) // "Thành công!"
  .catch((error) => console.error(error))
  .finally(() => console.log("Luôn chạy dù thành công hay thất bại"));
```

**Promise chaining — giải quyết callback hell:**

```javascript
// ✅ Flat, dễ đọc
dangNhap(user)
  .then((token) => layThongTinUser(token))
  .then((userInfo) => layDanhSachDonHang(userInfo.id))
  .then((orders) => tinhTongTien(orders))
  .then((total) => console.log("Tổng tiền:", total))
  .catch((err) => handleError(err)); // 1 chỗ bắt lỗi cho tất cả
```

**Các method quan trọng:**

```javascript
// Promise.all — chạy song song, đợi tất cả xong
const [users, products, orders] = await Promise.all([
  fetchUsers(),
  fetchProducts(),
  fetchOrders(),
]);
// Nhanh hơn chạy tuần tự 3 lần

// Promise.allSettled — không quan tâm cái nào lỗi
const results = await Promise.allSettled([api1(), api2(), api3()]);
results.forEach((r) => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.log("Lỗi:", r.reason);
});

// Promise.race — lấy cái xong trước
const result = await Promise.race([fetchFast(), fetchSlow()]);

// Promise.any — lấy cái thành công đầu tiên
const result = await Promise.any([api1(), api2(), api3()]);
```

### PHẦN 5 — Async/Await

**Lý thuyết:**

`async/await` là "syntactic sugar" viết trên nền Promise, cho phép viết code bất đồng bộ trông giống đồng bộ, dễ đọc hơn nhiều.

```javascript
// Quy tắc:
// - async đặt trước function → function đó luôn trả về Promise
// - await chỉ dùng được BÊN TRONG async function
// - await "dừng" function lại, đợi Promise resolve rồi mới tiếp tục

async function layThongTinUser(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const user = await response.json();
  return user; // tự động wrap trong Promise
}
```

**So sánh Promise vs async/await:**

```javascript
// Promise
function getData() {
  return fetch("/api/data")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.error(err));
}

// async/await — cùng kết quả, dễ đọc hơn
async function getData() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}
```

**Error handling đúng cách:**

```javascript
// Cách 1: try/catch (phổ biến nhất)
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Lỗi khi fetch user:", err);
    throw err; // re-throw để caller xử lý tiếp nếu cần
  }
}

// Cách 2: .catch() sau await (ít dùng hơn)
const user = await fetchUser(1).catch((err) => null);
if (!user) return; // early return nếu lỗi
```

**Sai lầm phổ biến — quên await:**

```javascript
// ❌ Sai — thiếu await
async function wrong() {
  const res = fetch("/api/data"); // res là Promise, không phải Response
  const data = res.json(); // Lỗi! Promise không có .json()
}

// ✅ Đúng
async function correct() {
  const res = await fetch("/api/data");
  const data = await res.json();
}
```

**Sai lầm phổ biến — await trong vòng lặp (chạy tuần tự thay vì song song):**

```javascript
// ❌ Chậm — chạy tuần tự, mỗi request đợi cái trước
const ids = [1, 2, 3, 4, 5];
for (const id of ids) {
  const user = await fetchUser(id); // 5 request × 1 giây = 5 giây
}

// ✅ Nhanh — chạy song song với Promise.all
const users = await Promise.all(ids.map((id) => fetchUser(id))); // ~1 giây
```

### 🕐 NGHỈ GIẢI LAO

### PHẦN 6 — Fetch API thực tế

**Demo thực chiến với JSONPlaceholder:**

```javascript
// GET — lấy dữ liệu
async function getUsers() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
    const users = await res.json();
    return users;
  } catch (err) {
    console.error("Không lấy được danh sách user:", err);
  }
}

// POST — gửi dữ liệu
async function createPost(data) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer your_token_here",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// PUT/DELETE tương tự, chỉ đổi method

// Gọi thử
const users = await getUsers();
console.log(users);

const newPost = await createPost({ title: "Hello", body: "World", userId: 1 });
console.log(newPost);
```

### PHẦN 7 — Browser Storage

**Tổng quan — khi nào dùng cái nào:**

| | LocalStorage | SessionStorage | Cookie | IndexedDB |
| -- | - | | -- | - |
| Dung lượng | ~5–10MB | ~5MB | ~4KB | Hàng trăm MB |
| Hết hạn | Không hết hạn | Đóng tab là mất | Tuỳ cấu hình | Không hết hạn |
| Gửi lên server | Không | Không | **Có (tự động)** | Không |
| Scope | Cùng domain | Cùng tab | Cùng domain | Cùng domain |
| Kiểu dữ liệu | String | String | String | Mọi kiểu |
| Truy cập JS | Có | Có | Có (nếu không httpOnly) | Có |

#### 7.1 — LocalStorage

Lưu trữ vĩnh viễn trên trình duyệt, không mất khi đóng tab hay tắt máy.

```javascript
// Lưu — chỉ lưu được string
localStorage.setItem("username", "nguyen_van_a");
localStorage.setItem("theme", "dark");

// Lưu object — phải JSON.stringify
const user = { id: 1, name: "Nguyễn Văn A", role: "admin" };
localStorage.setItem("user", JSON.stringify(user));

// Đọc
const username = localStorage.getItem("username"); // "nguyen_van_a"
const user = JSON.parse(localStorage.getItem("user")); // object trở lại

// Xoá
localStorage.removeItem("username");

// Xoá tất cả (cẩn thận!)
localStorage.clear();

// Kiểm tra tồn tại
if (localStorage.getItem("token")) {
  // đã đăng nhập
}
```

**Dùng khi nào:** Theme (sáng/tối), ngôn ngữ, preferences người dùng, giỏ hàng khi chưa đăng nhập.

**Lưu ý quan trọng:** Không lưu thông tin nhạy cảm như password, token quan trọng vì JavaScript có thể đọc được (XSS attack).

#### 7.2 — SessionStorage

Giống LocalStorage nhưng **mất khi đóng tab**. API hoàn toàn giống nhau, chỉ đổi tên.

```javascript
sessionStorage.setItem("currentStep", "3"); // lưu bước hiện tại
sessionStorage.setItem("formData", JSON.stringify(formData)); // lưu tạm form

const step = sessionStorage.getItem("currentStep");
sessionStorage.removeItem("currentStep");
```

**Dùng khi nào:** Lưu tạm dữ liệu form nhiều bước, trạng thái wizard, dữ liệu chỉ cần trong 1 phiên làm việc.

#### 7.3 — Cookie

Cookie được **tự động gửi lên server** theo mọi request — đây là điểm khác biệt lớn nhất. Thường dùng để lưu session token phía server quản lý.

```javascript
// Đặt cookie bằng JS (chỉ cookie không có httpOnly)
document.cookie = "username=nguyen_van_a; max-age=86400; path=/";
// max-age: số giây tồn tại (86400 = 1 ngày)
// path=/: có hiệu lực trên toàn domain

// Đọc cookie — bất tiện, trả về chuỗi tất cả cookie
console.log(document.cookie); // "username=nguyen_van_a; theme=dark"

// Helper function để đọc cookie dễ hơn
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

getCookie("username"); // "nguyen_van_a"

// Xoá cookie — đặt max-age = 0
document.cookie = "username=; max-age=0; path=/";
```

**Các thuộc tính bảo mật quan trọng (do server set):**

- `HttpOnly` — JS không đọc được, chống XSS
- `Secure` — chỉ gửi qua HTTPS
- `SameSite=Strict` — không gửi trong cross-site request, chống CSRF

**Dùng khi nào:** Session ID (server set), authentication token (nên để server quản lý với HttpOnly).

#### 7.4 — IndexedDB

Database thực sự trong browser, lưu được dữ liệu có cấu trúc phức tạp với dung lượng lớn. API gốc khá phức tạp nên thường dùng thư viện `idb` hoặc `Dexie.js`.

```javascript
// Ví dụ với thư viện idb (đơn giản hơn API gốc nhiều)
import { openDB } from "idb";

// Mở / tạo database
const db = await openDB("MyAppDB", 1, {
  upgrade(db) {
    // Tạo object store (giống table)
    const store = db.createObjectStore("products", { keyPath: "id" });
    store.createIndex("name", "name"); // tạo index để tìm kiếm nhanh
  },
});

// Thêm dữ liệu
await db.add("products", { id: 1, name: "Laptop", price: 15000000 });

// Đọc
const product = await db.get("products", 1);

// Cập nhật
await db.put("products", { id: 1, name: "Laptop Pro", price: 20000000 });

// Xoá
await db.delete("products", 1);

// Lấy tất cả
const allProducts = await db.getAll("products");
```

**Dùng khi nào:** App offline (PWA), lưu cache dữ liệu lớn, ứng dụng cần database phía client.

## III. BÀI TẬP THỰC HÀNH

### Bài 1: Đoán Output Event Loop

**Yêu cầu:** Dự đoán output của đoạn code dưới và giải thích thứ tự thực hiện:

```javascript
console.log("Start");

setTimeout(() => {
  console.log("setTimeout 1");
  Promise.resolve().then(() => console.log("Promise inside setTimeout"));
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    setTimeout(() => console.log("setTimeout inside Promise"), 0);
  })
  .then(() => console.log("Promise 2"));

setTimeout(() => console.log("setTimeout 2"), 0);

console.log("End");
```

**Output dự kiến:**

```
Start
End
Promise 1
Promise 2
setTimeout 1
Promise inside setTimeout
setTimeout 2
setTimeout inside Promise
```

**Giải thích:**

- Code đồng bộ chạy trước → "Start", "End"
- Tất cả microtask → "Promise 1", "Promise 2"
- Macrotask lần 1 → "setTimeout 1", rồi microtask → "Promise inside setTimeout"
- Macrotask lần 2 → "setTimeout 2"
- Macrotask lần 3 → callback bên trong Promise → "setTimeout inside Promise"

### Bài 2: Xây dựng hàm với Callback

**Yêu cầu:** Viết hàm `fetchUserData(id, callback)` giả lập fetch dữ liệu từ API với delay 1 giây. Nếu `id < 1` thì báo lỗi, ngược lại trả về object `{ id, name, email }`.

**Ví dụ sử dụng:**

```javascript
fetchUserData(5, (err, data) => {
  if (err) {
    console.error("Lỗi:", err);
  } else {
    console.log("User:", data); // { id: 5, name: "User 5", email: "user5@example.com" }
  }
});

fetchUserData(-1, (err, data) => {
  if (err) {
    console.error("Lỗi:", err); // "Lỗi: ID phải lớn hơn 0"
  }
});
```

### Bài 3: Promise Chaining - Login Flow

**Yêu cầu:** Viết các hàm trả về Promise:

1. `login(username, password)` — giả lập đăng nhập, delay 1s, trả về `{ token: "abc123", userId: 1 }`
2. `getUserProfile(token)` — lấy profile dựa trên token, delay 1s, trả về `{ userId: 1, name: "Nguyen Van A", role: "admin" }`
3. `getPermissions(userId)` — lấy quyền hạn, delay 1s, trả về `["read", "write", "delete"]`

Sau đó chain 3 hàm này lại để in ra thông tin đầy đủ:

```javascript
// Kết quả in ra:
// User: Nguyen Van A
// Quyền hạn: read, write, delete
```

### Bài 4: Async/Await - Sửa lỗi

**Yêu cầu:** Sửa code dưới để hoạt động đúng:

```javascript
// Code lỗi
async function getMultipleUsers() {
  const user1 = fetchUser(1); // ← Thiếu await
  const user2 = fetchUser(2); // ← Thiếu await
  const user3 = fetchUser(3); // ← Thiếu await
  console.log(user1, user2, user3);
}

getMultipleUsers();
```

**Ghi chú:** Ngoài thêm `await`, hãy optimize để 3 request chạy song song thay vì tuần tự.

### Bài 5: Fetch + async/await - Danh sách bài viết

**Yêu cầu:**

1. Fetch tất cả posts từ JSONPlaceholder (`https://jsonplaceholder.typicode.com/posts`)
2. Lọc ra posts của `userId === 1`
3. Hiển thị 5 posts đầu tiên dưới dạng:

```
[1] Duis dolore excepteur .....
[2] Qui est esse .....
```

**Yêu cầu thêm:** Thêm error handling — nếu API fail thì hiển thị "Lỗi khi tải bài viết"

### Bài 6: Promise.all - Tải song song

**Yêu cầu:** Viết async function `loadDashboard()` gọi **song song** 3 API:

- `https://jsonplaceholder.typicode.com/users?_limit=5`
- `https://jsonplaceholder.typicode.com/posts?_limit=5`
- `https://jsonplaceholder.typicode.com/comments?_limit=5`

In ra số lượng từng loại tài nguyên:

```
Users: 5
Posts: 5
Comments: 5
```

**Ghi chú:** Dùng `Promise.all()` để chạy song song, đo thời gian thực hiện so với chạy tuần tự.

### Bài 7: LocalStorage - Giỏ hàng

**Yêu cầu:** Xây dựng hệ thống giỏ hàng đơn giản:

```javascript
// Thêm sản phẩm vào giỏ
addToCart({ id: 1, name: "Laptop", price: 15000000, quantity: 1 });
addToCart({ id: 2, name: "Mouse", price: 500000, quantity: 2 });

// Lấy giỏ hàng
const cart = getCart();
console.log(cart); // [{ id: 1, ... }, { id: 2, ... }]

// Xóa sản phẩm
removeFromCart(1);

// Xóa toàn bộ giỏ
clearCart();

// Tính tổng tiền
const total = getTotalPrice();
console.log(total); // 1000000
```

**Lưu trữ:** Sử dụng LocalStorage để lưu giỏ hàng.

### Bài 8: SessionStorage - Wizard Form (Multi-step)

**Yêu cầu:** Xây dựng form nhiều bước:

```javascript
// Bước 1: Nhập thông tin cơ bản
saveStep1({ name: "Nguyen Van A", email: "user@example.com" });

// Bước 2: Chọn sản phẩm
saveStep2({ productId: 5, quantity: 2 });

// Bước 3: Xác nhận & submit
const formData = getFullFormData();
console.log(formData);
// { name: "...", email: "...", productId: 5, quantity: 2 }

submitForm(formData); // Gửi server
clearFormSession(); // Xóa dữ liệu tạm
```

**Yêu cầu thêm:** Nếu trang reload khi ở bước 2, form data vẫn giữ được.

### Bài 9: Cookie - Theme Preference

**Yêu cầu:** Xây dựng hệ thống chuyển đổi theme:

```javascript
// Thay đổi theme
setTheme("dark"); // Lưu cookie "theme=dark; max-age=31536000" (1 năm)

// Lấy theme hiện tại
const theme = getTheme(); // "dark"

// Áp dụng theme
applyTheme(theme); // Thay class trên <html>

// Khi trang reload, theme vẫn giữ nguyên
```

**Ghi chú:** Tạo CSS để theme sáng/tối, khi user chọn theme thì localStorage + apply CSS.

### Bài 10: Kết hợp tất cả - Mini Project

**Yêu cầu:** Xây dựng ứng dụng "Danh sách công việc (Todo)" với:

1. **Fetch dữ liệu:** Lấy danh sách công việc từ JSONPlaceholder (`/todos`)
2. **Lọc & hiển thị:** Chỉ hiển thị 10 todo đầu tiên
3. **Thêm/Xóa:** Cho phép người dùng thêm todo mới hay đánh dấu hoàn thành
4. **Lưu trữ:**
   - LocalStorage: Lưu danh sách todo tùy chỉnh (những cái user tự thêm)
   - SessionStorage: Lưu filter hiện tại (completed/uncompleted)
   - Cookie: Lưu username người dùng (1 ngày)
5. **Error handling:** Nếu fetch fail thì hiển thị "Không thể tải dữ liệu"

**Cấu trúc dự kiến:**

```javascript
async function initTodoApp() {
  // 1. Load user từ cookie
  const user = getUser();
  if (!user) {
    const newUser = prompt("Tên của bạn?");
    setUser(newUser);
  }

  // 2. Fetch todos
  const todos = await fetchTodos();

  // 3. Load filter từ session
  const filter = getFilter() || "all";

  // 4. Hiển thị
  renderTodos(filterTodos(todos, filter));

  // 5. Xử lý events
  setupEventListeners();
}

// Khi user thêm todo mới
function addTodo(title) {
  const newTodo = { title, completed: false };
  saveTodoToLocal(newTodo);
  renderTodos(); // render lại
}
```
