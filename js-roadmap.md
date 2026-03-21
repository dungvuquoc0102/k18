# Bản đồ kiến thức JavaScript

---

## Phần 1 — Nền tảng tư duy

```
├── Biến: var, let, const — sự khác biệt và lý do tồn tại cả 3
├── Kiểu dữ liệu
│   ├── Primitive: string, number, boolean, null, undefined, symbol, bigint
│   └── Reference: object, array, function
├── Type Casting
│   ├── Implicit: JS tự chuyển — "5" + 1 = "51", "5" - 1 = 4
│   ├── Explicit: Number(), String(), Boolean(), parseInt(), parseFloat()
│   └── Truthy & Falsy: 0, "", null, undefined, NaN là falsy
├── Toán tử: số học, so sánh (== vs ===), logic, nullish coalescing (??)
├── Điều kiện: if/else, switch, ternary
├── Vòng lặp: for, while, for...of, for...in — khi nào dùng cái nào
├── Function: khai báo vs expression vs arrow function
│   — sự khác biệt không chỉ là cú pháp
└── Array & Object cơ bản: tạo, truy cập, thêm/xóa/sửa phần tử
```

---

## Phần 2 — Tư duy đặc trưng của JS

```
├── Scope: global, function, block — biến sống ở đâu, chết ở đâu
├── Hoisting: var được hoist khác function declaration
│   — lý do code "chạy được" dù khai báo sau khi dùng
├── Strict mode: "use strict" thay đổi hành vi JS
│   ├── Cấm dùng biến chưa khai báo, cấm duplicate parameter
│   ├── this trong function thường trả về undefined thay vì global object
│   └── Nền tảng để hiểu tại sao ES6 module mặc định là strict
├── Closure: function nhớ scope nơi nó được tạo ra
│   — không phải syntax trick, là cơ chế nền tảng của JS
├── this: 4 quy tắc xác định this
│   — implicit, explicit (call/apply/bind), new, arrow function
├── Prototype & prototype chain
│   — JS không có class thật sự, kế thừa thông qua prototype
├── Classes: syntactic sugar trên prototype
│   ├── constructor, method, static method
│   ├── extends & super — kế thừa và gọi lên class cha
│   ├── private field (#field) — thực sự private, khác convention _field
│   ├── getter & setter — kiểm soát cách đọc/ghi property
│   └── class expression vs class declaration
└── Array methods functional: map, filter, reduce, find, some, every, flat, flatMap
    — tư duy xử lý dữ liệu không dùng vòng lặp thủ công
```

---

## Phần 3 — Mô hình thực thi

```
├── Call Stack: JS thực thi từng dòng thế nào
├── Heap: object được lưu ở đâu trong bộ nhớ
├── Memory Management
│   ├── Garbage Collection: mark-and-sweep — object không còn được reference thì bị thu hồi
│   ├── Memory leak phổ biến: global variable, closure giữ reference thừa,
│   │   event listener không được remove, detached DOM node còn được JS giữ
│   └── Cách phát hiện: Memory tab trong DevTools — chụp và so sánh heap snapshot
├── Event Loop: tại sao JS không bị đơ khi chờ I/O
├── Task Queue vs Microtask Queue: setTimeout vs Promise — thứ tự thực thi thế nào
├── Iterators & Generators
│   ├── Iterator protocol: object có next() trả về { value, done }
│   ├── Iterable protocol: object có [Symbol.iterator] — cho phép dùng for...of
│   ├── Generator function (function*): tạo iterator bằng yield
│   │   — dừng tại yield, gọi next() mới chạy tiếp
│   ├── Ứng dụng: lazy evaluation, xử lý data stream, infinite sequence
│   └── Async generator: kết hợp async/await với generator cho data stream bất đồng bộ
├── Callback: bất đồng bộ thế hệ đầu — và tại sao callback hell là vấn đề thật
├── Promise: giải quyết callback hell
│   — then/catch/finally, Promise.all, Promise.race, Promise.allSettled
└── Async/Await: syntactic sugar của Promise
    — trông như đồng bộ nhưng vẫn là bất đồng bộ bên dưới
```

---

## Phần 4 — Môi trường trình duyệt

```
├── DOM
│   ├── DOM tree: document là gì, node là gì
│   ├── Truy cập phần tử: querySelector, getElementById, getElementsByClassName...
│   ├── Thêm/xóa/sửa phần tử: createElement, appendChild, innerHTML vs textContent
│   ├── Attribute vs Property: sự khác biệt quan trọng hay bị bỏ qua
│   ├── Traversal: parentNode, children, nextSibling...
│   ├── Event
│   │   ├── addEventListener — cách gắn event đúng
│   │   ├── Event object: target, currentTarget, preventDefault, stopPropagation
│   │   ├── Event bubbling & capturing: tại sao click vào con lại trigger cha
│   │   └── Event delegation: gắn 1 listener thay vì gắn cho từng phần tử con
│   └── Form
│       ├── Truy cập giá trị: input.value, checkbox.checked, select.value
│       ├── Attribute vs Property trong form: value ban đầu vs value hiện tại
│       ├── Submit event: preventDefault để chặn reload trang
│       ├── Validation: checkValidity, setCustomValidity, reportValidity
│       ├── FormData API: đọc toàn bộ form một lúc, hỗ trợ file upload
│       └── Reset form: reset(), và sự khác biệt giữa reset value vs clear value
│
├── BOM (Browser Object Model)
│   ├── window: global object của trình duyệt — mọi biến global đều là property của window
│   ├── window.location: URL hiện tại, điều hướng trang
│   │   — href, pathname, search, hash, origin, assign(), replace(), reload()
│   ├── window.history: điều hướng không reload trang
│   │   — pushState(), replaceState() — nền tảng của client-side routing
│   ├── window.navigator: thông tin trình duyệt và thiết bị
│   │   — userAgent, language, onLine, geolocation, clipboard
│   ├── window.screen vs window.innerWidth/innerHeight
│   │   — screen là màn hình vật lý, innerWidth/Height là kích thước viewport
│   ├── Timers: setTimeout, setInterval, clearTimeout, clearInterval
│   │   — chạy trong event loop, không đảm bảo đúng giờ tuyệt đối
│   ├── window.alert / confirm / prompt: dialog đồng bộ, block UI — tránh trong production
│   └── window.open / close: mở tab/popup — bị chặn nếu không từ user gesture
│
├── Browser Storage
│   ├── Cookie: lưu trên client, tự động gửi kèm mọi HTTP request
│   │   — path, domain, expires, httpOnly, secure, SameSite
│   ├── localStorage: lưu vĩnh viễn, chỉ đọc được bằng JS cùng origin
│   ├── sessionStorage: mất khi đóng tab
│   ├── IndexedDB: database thật sự trong trình duyệt
│   │   — dùng khi cần lưu lượng lớn hoặc query phức tạp
│   └── Cache API: lưu response HTTP — dùng trong Service Worker
│       — nền tảng của PWA và offline-first
│
└── Browser DevTools
    ├── Console: log, warn, error, table, group, time — không chỉ là console.log
    ├── Elements tab: inspect DOM thật sự đang render, khác với source HTML gốc
    ├── Sources tab: đặt breakpoint, step through code, watch variable
    ├── Network tab: xem request/response, timing, header, payload
    ├── Memory tab: heap snapshot, phát hiện memory leak
    ├── Performance tab: flame chart, tìm bottleneck render và JS execution
    └── Application tab: xem và chỉnh sửa localStorage, sessionStorage, cookie, IndexedDB
```

---

## Phần 5 — Kiến trúc và pattern

```
├── OOP trong JS: class, constructor, extends, super
│   — syntactic sugar trên prototype, bên dưới vẫn là prototype chain
├── Functional programming: pure function, immutability, function composition
├── Data Structures trong JS
│   ├── Map: key-value, key có thể là bất kỳ kiểu nào — khác Object ở chỗ không có key kế thừa
│   ├── Set: tập hợp không trùng lặp — dùng để dedup array
│   ├── WeakMap & WeakSet: giữ reference yếu, không ngăn garbage collection
│   │   — dùng để lưu metadata gắn với object mà không gây memory leak
│   └── Stack, Queue, LinkedList: tự implement bằng array hoặc class
│       — hiểu khi nào dùng cấu trúc nào thay vì mặc định dùng array
├── Module pattern: tổ chức code, tránh pollute global scope
├── Observer pattern: nền tảng của event system và reactive programming
├── Error handling: try/catch/finally, custom Error class
│   — xử lý lỗi trong async code, tránh unhandled rejection
└── Immutability patterns: spread operator, Object.freeze
    — tránh side effect ngoài ý muốn
```

---

## Phần 6 — Làm việc với Server APIs

```
├── HTTP cơ bản
│   ├── Giao thức request/response — stateless: server không nhớ request trước
│   ├── Anatomy of a request
│   │   ├── Method: GET, POST, PUT, PATCH, DELETE
│   │   ├── URL: scheme, host, path, query string, fragment
│   │   ├── Headers: Content-Type, Authorization, Accept, Cache-Control
│   │   └── Body: chỉ có ở POST/PUT/PATCH — JSON, FormData, binary
│   ├── Anatomy of a response
│   │   ├── Status code: 2xx thành công, 3xx redirect, 4xx lỗi client, 5xx lỗi server
│   │   │   — 200, 201, 204, 301, 400, 401, 403, 404, 409, 422, 500
│   │   ├── Headers: Content-Type, Set-Cookie, Location, CORS headers
│   │   └── Body: JSON, HTML, binary — tùy Content-Type mà parse khác nhau
│   ├── HTTPS & TLS: mã hóa ở transport layer — certificate, handshake
│   ├── CORS: tại sao trình duyệt chặn request cross-origin
│   │   ├── Same-origin policy: scheme + host + port phải khớp
│   │   ├── Preflight request: OPTIONS request trước khi gửi request thật
│   │   └── Xử lý CORS ở server, không phải client
│   └── Caching: Cache-Control, ETag, Last-Modified — tránh download lại khi không cần
│
├── RESTful API
│   ├── REST là kiến trúc, không phải giao thức — stateless, uniform interface
│   ├── Resource & URL design
│   │   ├── Danh từ, không phải động từ: /users thay vì /getUsers
│   │   ├── Số nhiều nhất quán: /users/:id
│   │   └── Quan hệ lồng nhau: /users/:id/posts
│   ├── HTTP method mapping
│   │   ├── GET /resources — lấy danh sách
│   │   ├── GET /resources/:id — lấy 1 item
│   │   ├── POST /resources — tạo mới
│   │   ├── PUT /resources/:id — thay thế toàn bộ
│   │   ├── PATCH /resources/:id — cập nhật một phần
│   │   └── DELETE /resources/:id — xóa
│   ├── Response format nhất quán: { data, error, message, meta }
│   ├── Pagination: cursor-based vs offset-based
│   ├── Idempotency: GET/PUT/DELETE là idempotent, POST thì không
│   │   — quan trọng khi retry request thất bại
│   └── Versioning: /api/v1/ — tại sao cần và các chiến lược
│
└── Fetch API & HTTP client trong JS
    ├── XHR (XMLHttpRequest): API gốc, event-based — cần biết để đọc code legacy
    ├── Fetch API: Promise-based, clean hơn XHR
    │   ├── Request, Response, Headers object
    │   ├── fetch không throw khi 4xx/5xx, chỉ throw khi network fail
    │   └── Đọc body: response.json(), response.text(), response.blob()
    └── Axios & thư viện wrapper
        — tự động parse JSON, interceptor, cancel request, timeout
```

---

## Phần 7 — Hệ sinh thái

```
├── NPM: package.json, dependencies vs devDependencies, scripts, lockfile
├── Module system: CommonJS (require) vs ESM (import/export)
│   — tại sao có 2 hệ thống và chúng khác nhau thế nào
├── Bundler: Vite/Webpack — tại sao cần bundle, tree shaking, code splitting
├── Node.js: JS chạy ngoài trình duyệt
│   — event-driven server, fs, path, http module
├── Framework: React/Vue/Svelte — mỗi cái giải quyết vấn đề gì
└── TypeScript: type system trên nền JS — bắt lỗi tại compile time thay vì runtime
```
