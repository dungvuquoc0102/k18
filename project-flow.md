# Luồng dự án thực tế

---

## Phần 1 — Khởi tạo dự án

```
├── Xác định kiến trúc tổng thể trước khi viết dòng code đầu tiên
│   ├── Monolith hay microservices — monolith trước, tách sau khi cần
│   ├── SPA hay SSR hay hybrid — ảnh hưởng tới cách routing và fetching được tổ chức
│   └── Chọn DB: relational (PostgreSQL, MySQL) hay document (MongoDB) — dựa trên tính chất data
│
├── Cấu trúc thư mục
│   ├── FE: tổ chức theo feature — mỗi feature có component, hook, service, type riêng
│   ├── BE: controller → service → repository — mỗi tầng chỉ biết tầng ngay dưới nó
│   └── Không để business logic lọt vào controller, không để HTTP logic lọt vào service
│
├── Môi trường
│   ├── .env phân biệt dev, staging, production — không hard-code bất cứ thứ gì
│   ├── Secret không bao giờ commit lên git — .env.example là template công khai
│   └── Docker Compose cho local: DB, cache, app chạy cùng nhau nhất quán
│
└── CI/CD từ sớm
    ├── Pipeline: push → lint → test → build — fail sớm, không merge code hỏng
    └── Deploy tự động lên staging khi merge vào main
```

---

## Phần 2 — Auth

```
├── Luồng đăng ký
│   ├── FE: validate input trước khi gửi — email format, password strength, confirm match
│   ├── BE: validate lại toàn bộ — không tin input từ client dù FE đã check
│   ├── BE: kiểm tra email đã tồn tại — trả 409 Conflict nếu trùng
│   ├── BE: hash password bằng bcrypt trước khi lưu — không bao giờ lưu plaintext
│   └── DB: lưu user, gắn role mặc định, tạo timestamp created_at
│
├── Luồng đăng nhập — JWT
│   ├── FE: gửi credentials → nhận access token + refresh token
│   ├── BE: xác thực credentials → ký JWT bằng secret → trả cặp token
│   ├── Access token: short-lived (15 phút), lưu trong memory hoặc httpOnly cookie
│   ├── Refresh token: long-lived (7–30 ngày), lưu httpOnly cookie, lưu hash vào DB
│   └── DB: bảng refresh_tokens — lưu để có thể revoke khi cần
│
├── Luồng refresh token
│   ├── FE: access token hết hạn → tự động gọi endpoint refresh
│   ├── BE: verify refresh token → kiểm tra DB còn hợp lệ không → cấp cặp token mới
│   ├── Rotate refresh token: cặp cũ bị xóa, cặp mới được cấp — phát hiện token bị đánh cắp
│   └── Nếu refresh token không hợp lệ → xóa toàn bộ session, buộc đăng nhập lại
│
├── Luồng đăng xuất
│   ├── FE: xóa token khỏi memory, gọi logout endpoint
│   ├── BE: xóa refresh token khỏi DB — access token hết hạn tự nhiên
│   └── FE: redirect về trang login, clear toàn bộ client state
│
├── Protected request — mọi request cần auth
│   ├── FE: interceptor tự động gắn Authorization: Bearer <token> vào mỗi request
│   ├── FE: nếu nhận 401 → thử refresh → nếu refresh fail → redirect login
│   ├── BE: middleware xác thực token trước khi vào controller
│   └── BE: middleware kiểm tra role/permission sau khi xác thực danh tính
│
└── OAuth 2.0 — đăng nhập bên thứ ba
    ├── FE: redirect sang provider (Google, GitHub)
    ├── Provider: user đồng ý → trả authorization code về callback URL
    ├── BE: đổi code lấy token (server-to-server, không qua browser)
    ├── BE: lấy thông tin user từ provider → tìm hoặc tạo user trong DB
    └── BE: cấp JWT của hệ thống → luồng tiếp tục như đăng nhập thường
```

---

## Phần 3 — CRUD cơ bản

```
├── Thiết kế DB trước
│   ├── Xác định entity, quan hệ, ràng buộc trước khi viết API
│   ├── Quan hệ: one-to-many dùng foreign key, many-to-many dùng bảng trung gian
│   ├── Index ngay từ đầu những column thường dùng trong WHERE, JOIN, ORDER BY
│   └── Migration file — mọi thay đổi schema phải qua migration, không sửa thẳng DB
│
├── Thiết kế API
│   ├── URL dùng danh từ số nhiều: /users, /posts/:id — không dùng /getUsers
│   ├── Quan hệ lồng nhau: /users/:id/posts — lấy posts của một user cụ thể
│   └── Response nhất quán: { success, data, error, meta } — cùng cấu trúc mọi endpoint
│
├── Luồng tạo mới (POST)
│   ├── FE: validate form → gửi POST request với body JSON
│   ├── BE: validate input → kiểm tra business rule → tạo record → trả 201 Created
│   └── FE: cập nhật UI — invalidate cache hoặc append vào list hiện tại
│
├── Luồng đọc danh sách (GET)
│   ├── FE: gọi API khi mount, truyền query params cho filter/sort/pagination
│   ├── BE: parse params → build query → trả data kèm meta pagination
│   ├── DB: dùng index đúng, tránh SELECT *, giới hạn LIMIT để không kéo toàn bộ bảng
│   └── FE: hiển thị loading state trong khi chờ, error state nếu thất bại
│
├── Luồng cập nhật (PUT/PATCH)
│   ├── PUT: thay toàn bộ resource — FE gửi đủ tất cả field
│   ├── PATCH: cập nhật một phần — FE chỉ gửi field thay đổi
│   ├── BE: kiểm tra resource tồn tại → kiểm tra quyền sở hữu → cập nhật → trả 200
│   └── FE: cập nhật lại cache hoặc state local sau khi server confirm
│
├── Luồng xóa (DELETE)
│   ├── Soft delete: cập nhật deleted_at — giữ lại dữ liệu, dễ recover, giữ audit trail
│   ├── Hard delete: chỉ dùng khi có lý do rõ ràng (GDPR, yêu cầu nghiệp vụ)
│   ├── BE: kiểm tra quyền → đánh dấu xóa → trả 204 No Content
│   └── FE: xóa khỏi local state ngay lập tức — không cần chờ re-fetch
│
└── Phân trang
    ├── Offset-based: page + limit — đơn giản, nhưng data lệch khi có insert/delete giữa chừng
    ├── Cursor-based: after=<id> — ổn định, phù hợp infinite scroll và realtime data
    └── FE: giữ cursor hiện tại trong state hoặc URL để back/forward hoạt động đúng
```

---

## Phần 4 — Realtime

```
├── Khi nào cần realtime
│   ├── Chat, notification, live feed — data thay đổi liên tục, cần push từ server
│   ├── Polling: gọi API theo interval — đơn giản nhưng tốn tài nguyên, độ trễ cao
│   └── WebSocket hoặc SSE khi cần push thật sự
│
├── WebSocket
│   ├── FE: mở kết nối khi user đăng nhập, đóng khi logout hoặc unmount
│   ├── FE: gửi auth token ngay sau khi kết nối — BE xác thực trước khi cho vào room
│   ├── BE: quản lý connection pool — biết socket nào thuộc user nào
│   ├── BE: khi có event → push tới đúng user hoặc room, không broadcast tràn lan
│   └── FE: nhận event → cập nhật state local ngay lập tức, không cần re-fetch
│
├── Xử lý mất kết nối
│   ├── FE: tự động reconnect với exponential backoff — không reconnect liên tục
│   ├── FE: khi reconnect — fetch lại data đã miss trong lúc offline
│   └── BE: cleanup connection khi client ngắt — tránh giữ socket chết trong memory
│
└── Kết hợp với CRUD
    ├── Mutation xảy ra → BE lưu DB → BE push event WebSocket tới các client liên quan
    ├── Client nhận event → cập nhật local cache/state mà không cần gọi lại API
    └── Optimistic update: cập nhật UI ngay khi gửi, rollback nếu server thất bại
```

---

## Phần 5 — Upload file

```
├── Luồng upload cơ bản
│   ├── FE: đọc file từ input, validate size và type trước khi gửi
│   ├── FE: gửi multipart/form-data — không gửi base64, tốn băng thông gấp đôi
│   ├── BE: nhận file, validate lại phía server — không tin client
│   ├── BE: lưu lên object storage (S3, R2, GCS) — không lưu file trên disk server
│   └── DB: lưu URL trỏ tới file, không lưu file trong DB
│
├── Upload lớn — presigned URL
│   ├── FE: xin presigned URL từ BE
│   ├── BE: tạo presigned URL có TTL ngắn → trả về FE
│   ├── FE: upload thẳng lên storage dùng presigned URL — không qua server
│   └── FE: báo BE biết upload hoàn tất → BE xác nhận và lưu metadata vào DB
│
└── Sau khi upload
    ├── Image: resize, compress, tạo thumbnail — xử lý async, không block response
    ├── Trả về URL public hoặc signed URL nếu file cần kiểm soát quyền truy cập
    └── Cleanup: xóa file cũ khi user upload file mới thay thế
```

---

## Phần 6 — Xử lý lỗi xuyên suốt

```
├── Tầng DB
│   ├── Lỗi constraint (unique, foreign key) → bắt và chuyển thành lỗi nghiệp vụ rõ nghĩa
│   └── Không để database error truyền thẳng lên response
│
├── Tầng BE
│   ├── Global error handler: một nơi duy nhất format lỗi trước khi trả về client
│   ├── Lỗi có thể đoán được (validation, not found, conflict): trả 4xx kèm message rõ ràng
│   ├── Lỗi không đoán được (crash, DB down): trả 500, log đầy đủ server-side
│   └── Không để stack trace, tên bảng, câu SQL lộ ra ngoài response
│
├── Tầng FE
│   ├── Interceptor: bắt tập trung tất cả HTTP error — 401 redirect login, 500 show toast
│   ├── Error boundary: bắt lỗi render, tránh crash toàn app vì một component lỗi
│   └── Phân biệt lỗi network (không có internet) và lỗi server (có response nhưng fail)
│
└── Logging & monitoring
    ├── Log có cấu trúc: timestamp, level, traceId, userId, message — dễ query
    ├── traceId xuyên suốt từ FE → BE → DB — trace được một request đi qua đâu
    └── Alert khi error rate tăng đột biến — phát hiện sự cố trước khi user báo
```
