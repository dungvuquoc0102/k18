# Bản đồ kiến thức TypeScript

---

## Phần 1 — Nền tảng tư duy

```
├── Nguồn gốc & bản chất
│   ├── Phát triển bởi Microsoft — superset của JS, mọi JS hợp lệ đều là TS hợp lệ
│   ├── Là ngôn ngữ riêng biệt — cần compiler (tsc) để biên dịch sang JS
│   └── Mục tiêu: bắt lỗi tại compile time thay vì runtime
│
├── Tại sao cần TypeScript
│   ├── JS không kiểm tra kiểu — hàm nhận bất cứ thứ gì, lỗi chỉ xuất hiện khi chạy
│   ├── TS buộc khai báo rõ kiểu → IDE hiểu code → autocomplete, refactor an toàn hơn
│   └── Tài liệu hóa code ngay trong code — đọc signature hàm biết ngay đầu vào/ra
│
└── Cách TS hoạt động
    ├── Viết .ts → tsc biên dịch → ra .js → chạy như JS bình thường
    ├── Kiểm tra kiểu chỉ xảy ra lúc biên dịch — runtime không có TS
    └── tsconfig.json: cấu hình compiler — target, strict, paths, include/exclude
```

---

## Phần 2 — Hệ thống kiểu

```
├── Kiểu nguyên thủy — kế thừa từ JS
│   ├── string, number, boolean, undefined, null, bigint, symbol
│   └── Khai báo: let name: string = "Vu" — annotation sau tên biến
│
├── Kiểu phức hợp
│   ├── Array: number[] hoặc Array<number>
│   ├── Tuple: mảng chặt — chỉ định rõ số lượng và kiểu từng vị trí
│   │   └── const user: [string, number, boolean] = ["Vu", 25, true]
│   ├── Object: khai báo inline hoặc qua interface/type
│   └── Function: khai báo kiểu tham số và kiểu trả về
│       └── const sum = (a: number, b: number): number => a + b
│
├── Kiểu đặc biệt của TS
│   ├── any: tắt kiểm tra kiểu — tránh dùng, mất hết lợi ích TS
│   ├── unknown: không biết kiểu nhưng buộc phải kiểm tra trước khi dùng
│   │   — logic hơn any: if (typeof x === "string") { x.length }
│   ├── void: hàm không trả về giá trị — ngầm return undefined
│   ├── never: hàm không bao giờ kết thúc — throw error, vòng lặp vô tận
│   └── Enum: biến thuộc bộ giá trị cố định
│       └── enum City { Hanoi = "Hà Nội", HCM = "Hồ Chí Minh" }
│
├── Union & Intersection
│   ├── Union: biến có thể là một trong nhiều kiểu — let id: string | number
│   └── Intersection: kết hợp nhiều kiểu thành một — type AB = A & B
│
└── Cú pháp mở rộng
    ├── Optional: dấu ? — property hoặc tham số có thể vắng mặt
    ├── readonly: chỉ đọc, không thể gán lại sau khi khởi tạo
    └── Non-null assertion: dấu ! — khẳng định với TS giá trị này không null/undefined
```

---

## Phần 3 — Interface vs Type

```
├── Interface
│   ├── Định nghĩa cấu trúc của object hoặc class
│   ├── Có thể khai báo lại để mở rộng — declaration merging
│   ├── Dùng khi làm việc với OOP, định nghĩa contract cho class implements
│   └── Đại diện tư tưởng OOP — cấu trúc dữ liệu, hợp đồng giữa các module
│
├── Type alias
│   ├── Đặt tên cho bất kỳ kiểu nào — không chỉ object
│   ├── Union/Intersection: type Status = "success" | "error"
│   ├── Mapped types: biến đổi kiểu cũ thành kiểu mới
│   ├── Function types: type Handler = (e: Event) => void
│   └── Đại diện tư tưởng Functional — logic nghiệp vụ, kiểu cục bộ
│
└── Khi nào dùng cái nào
    ├── Interface: object shape, class contract, public API của module
    └── Type: union, intersection, function, mapped, utility types
```

---

## Phần 4 — Suy luận & Khẳng định

```
├── Type Inference — TS tự suy luận kiểu từ ngữ cảnh
│   ├── let x = 5 → TS hiểu x là number, không cần khai báo
│   ├── Return type của hàm tự suy từ giá trị return
│   └── Dùng inference khi có thể — annotation chỉ cần khi TS suy sai hoặc cần rõ ràng
│
├── Type Assertion — ép kiểu thủ công
│   ├── Dùng khi biết rõ kiểu hơn TS — thường gặp khi làm việc với DOM hoặc JSON
│   ├── Cú pháp: value as Type — ưu tiên hơn <Type>value (xung đột JSX)
│   └── Chỉ ép được khi 2 kiểu có mối quan hệ — không ép string thành number trực tiếp
│
└── Type Narrowing — thu hẹp kiểu trong block điều kiện
    ├── typeof: phân biệt string, number, boolean
    ├── instanceof: phân biệt class instance
    ├── in operator: kiểm tra property tồn tại trong object
    └── Discriminated union: dùng field chung để phân biệt các nhánh
```

---

## Phần 5 — OOP trong TypeScript

```
├── Đóng gói
│   ├── public: mặc định — truy cập từ bất kỳ đâu
│   ├── private: chỉ trong class — dùng # (native) hoặc keyword private (TS only)
│   ├── protected: trong class và class con
│   ├── readonly: gán một lần trong constructor, không thể thay đổi sau
│   └── static: thuộc về class, không phải instance
│
├── Kế thừa
│   ├── extends: class con kế thừa class cha
│   ├── super(): gọi constructor cha — bắt buộc trong constructor con trước khi dùng this
│   └── super.method(): gọi method của cha trong class con
│
├── Trừu tượng
│   ├── abstract class: không tạo instance trực tiếp — chỉ để kế thừa
│   ├── abstract method: khai báo trong abstract class, bắt buộc class con phải implement
│   └── Interface implements: class cam kết có đủ các method và property đã khai báo
│
└── Đa hình
    ├── Override: class con viết lại method của cha — từ khóa override để TS kiểm tra
    └── Overload: nhiều signature cho một hàm — TS chọn đúng signature dựa trên tham số
```

---

## Phần 6 — Cấu hình & Hệ sinh thái

```
├── tsconfig.json
│   ├── target: biên dịch ra ES version nào — ES2016, ES2020, ESNext
│   ├── module: hệ thống module — CommonJS, ESM
│   ├── strict: bật tất cả strict checks — nên bật từ đầu dự án
│   ├── noImplicitAny: cấm TS ngầm gán any — buộc khai báo kiểu rõ ràng
│   ├── strictPropertyInitialization: buộc khởi tạo property trong constructor
│   ├── paths: alias import — @/components thay vì ../../components
│   └── include/exclude: chỉ định file nào TS sẽ biên dịch
│
└── Tích hợp thực tế
    ├── ts-node: chạy TS trực tiếp không cần build — dùng trong dev, script
    ├── Vite/Webpack: tích hợp sẵn TS — transpile nhanh, không type-check lúc build
    ├── ESLint + typescript-eslint: lint rule riêng cho TS
    └── Định nghĩa kiểu cho thư viện JS: @types/node, @types/react — DefinitelyTyped
```

---
