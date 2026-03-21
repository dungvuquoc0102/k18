# Day 38: Vite

## Vite

### 1. Vite là gì?

Vite là build tool và dev server hiện đại cho frontend. Nhanh hơn Webpack nhờ tận dụng **ES Modules native** của trình duyệt — không bundle tất cả file khi dev, chỉ serve từng file khi được import.

| Cũ (Webpack)                   | Vite                                       |
| ------------------------------ | ------------------------------------------ |
| Bundle toàn bộ trước khi serve | Serve file trực tiếp qua ESM, không bundle |
| Khởi động chậm (vài chục giây) | Khởi động tức thì (< 1s)                   |
| HMR chậm khi project lớn       | HMR cực nhanh — chỉ reload module thay đổi |
| Cần cấu hình nhiều             | Zero-config, có template sẵn               |

---

### 2. Khởi tạo project

```bash
npm create vite@latest my-app -- --template vanilla
cd my-app
npm install
npm run dev
```

Hoặc chọn template khác:

```bash
# Vanilla JS
npm create vite@latest my-app -- --template vanilla

# Vanilla + TypeScript
npm create vite@latest my-app -- --template vanilla-ts

# React
npm create vite@latest my-app -- --template react

# Vue
npm create vite@latest my-app -- --template vue
```

---

### 3. Cấu trúc project Vite (vanilla)

```
my-app/
├── index.html        ← Entry point chính
├── main.js           ← JS entry point
├── style.css
├── package.json
└── vite.config.js    ← Config (nếu cần)
```

`index.html` của Vite khác Webpack: trực tiếp import JS bằng `type="module"`:

```html
<!doctype html>
<html>
  <head>
    <title>My App</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

---

### 4. Import CSS và assets trong JS

```js
// Import CSS — Vite tự inject vào trang
import "./style.css";

// Import ảnh — trả về URL đã xử lý
import logo from "./assets/logo.png";
document.querySelector("img").src = logo;

// Import JSON — parse sẵn thành object
import data from "./data.json";
console.log(data);
```

---

### 5. Environment variables

Tạo file `.env` ở root:

```
VITE_API_URL=https://api.escuelajs.co/api/v1
VITE_APP_NAME=My Store
```

Dùng trong JS với prefix `import.meta.env`:

```js
const BASE_URL = import.meta.env.VITE_API_URL;
// "https://api.escuelajs.co/api/v1"

// Biến không có prefix VITE_ sẽ không expose ra client
```

> Chỉ các biến có prefix `VITE_` mới được exposed ra browser. Các biến khác chỉ dùng cho server-side (Node.js scripts, CI/CD).

---

### 6. Các lệnh thường dùng

```bash
npm run dev      # Chạy dev server (localhost:5173)
npm run build    # Build production vào thư mục dist/
npm run preview  # Preview bản build production locally
```

---

### 7. vite.config.js — Cấu hình cơ bản

```js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000, // Đổi port dev server
    proxy: {
      // Proxy API để tránh CORS khi dev
      "/api": {
        target: "https://api.escuelajs.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
      },
    },
  },
  build: {
    outDir: "dist", // Thư mục output khi build
  },
});
```

> Proxy trong Vite giải quyết CORS khi dev: thay vì gọi thẳng `https://api.escuelajs.co`, gọi `/api/...` — Vite dev server sẽ forward request, trình duyệt không thấy cross-origin.
