# BÁO CÁO KỸ THUẬT & ĐỒ ÁN CHI TIẾT
## HỆ THỐNG PHÂN PHỐI & TRẢI NGHIỆM SIÊU XE TRỰC TUYẾN LUXE MOTORS VER 2.0

---

## 🏛️ CHƯƠNG 1: TỔNG QUAN DỰ ÁN & MỤC TIÊU NGHIỆP VỤ

### 1.1 Giới Thiệu Dự Án
**Luxe Motors Ver 2.0** là nền tảng thương mại điện tử trực tuyến dành riêng cho phân khúc siêu xe (Hypercar, Supercar, Luxury SUV) hàng đầu Việt Nam. Nền tảng được thiết kế theo tiêu chuẩn sang trọng **Obsidian & Gold**, áp dụng hệ ngôn ngữ thiết kế **UI/UX Pro Max** nhằm đem lại trải nghiệm cao cấp nhất cho khách hàng VIP và quy trình quản trị chuyên nghiệp cho đội ngũ doanh nghiệp.

### 1.2 Mục Tiêu Nghiệp Vụ & Đối Tượng Sử Dụng
- **Khách Hàng VIP**: Trải nghiệm xem siêu xe 360 độ, đặt cọc giữ chỗ 1-Click qua VietQR / PayOS, đăng ký dịch vụ concierge lái thử tận nhà, tương tác với AI Chatbot VIP Concierge 24/7.
- **Doanh Nghiệp (Showroom)**: Vận hành theo mô hình quản trị doanh nghiệp hiện đại với **6 phân hệ người dùng (RBAC)** riêng biệt: Master Admin, Giám Đốc Exec, Quản Lý Showroom, Chuyên Viên Sales, Chuyên Viên CSKH, và Khách VIP.

---

## 🏗️ CHƯƠNG 2: KIẾN TRÚC HỆ THỐNG & TECH STACK

### 2.1 Tổng Quan Kiến Trúc
Hệ thống Luxe Motors Ver 2.0 xây dựng theo mô hình **Client-Server Decoupled Architecture** (Tách biệt Frontend và Backend):

```
+-----------------------------------------------------------------------+
|                            CLIENT LAYER                               |
|   React 18 + Vite | Tailwind CSS | Font Jost Geometric Sans           |
|   Axios Interceptor | Context API (Auth, Cart, Favorites)              |
+-----------------------------------------------------------------------+
                                   |
                         HTTPS / REST API + JSON
                                   v
+-----------------------------------------------------------------------+
|                            SECURITY LAYER                             |
|   Helmet | Custom IP Memory Rate Limiter | NoSQL Sanitizer Guard      |
|   CORS Whitelist | Dual-Token Middleware (HttpOnly Refresh Cookie)    |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                            BACKEND LAYER                              |
|   Node.js + Express Framework                                         |
|   Controllers | Services | Async Notification Orchestrator            |
+-----------------------------------------------------------------------+
                   /               |               \
                  v                v                v
+-----------------------+ +------------------+ +------------------------+
|   DATABASE LAYER      | |   NOTIFICATION   | |    PAYMENT GATEWAY     |
| Cloud MongoDB Atlas   | | Email Nodemailer | | VietQR VietinBank      |
| Mongoose ACID Session | | Zalo OA API      | | PayOS (HMAC-SHA256)   |
+-----------------------+ +------------------+ +------------------------+
```

### 2.2 Chi Tiết Công Nghệ Sử Dụng (Tech Stack)

| Phân Hệ | Công Nghệ / Thư Viện | Mục Đích Sử Dụng |
|---|---|---|
| **Frontend Core** | React 18, Vite | Xây dựng Single Page Application (SPA) tốc độ cao |
| **Frontend Styling** | Vanilla CSS, Tailwind CSS, Lucide Icons | Thiết kế chuẩn Obsidian Gold, Icon sắc nét |
| **State & Route** | React Router v6, React Context API | Điều hướng trang & Quản lý trạng thái Auth, Cart |
| **Typography** | Jost, Cormorant Garamond | Chuẩn hóa Font Geometric Sans cho siêu xe |
| **Backend Core** | Node.js, Express.js | Khởi tạo RESTful API server bất đồng bộ |
| **Database** | MongoDB Atlas, Mongoose ORM | Lưu trữ NoSQL Cloud, Quản lý Schema & ACID Transactions |
| **Security** | Helmet, CORS, Custom Rate Limiter, Express Mongo Sanitize | Bảo vệ server chống DDoS, NoSQL Injection, XSS |
| **Authentication** | JWT (JSON Web Token), Cookie-Parser | Xác thực Dual Token (Access Token 15m + Refresh Cookie 7d) |
| **Integrations** | PayOS SDK, Nodemailer, Zalo OA API, Google Gemini AI | Cổng thanh toán, Thông báo đa kênh & AI Chatbot VIP |

---

## 🗄️ CHƯƠNG 3: THIẾT KẾ CƠ SỞ DỮ LIỆU & MONGOOSE ACID TRANSACTIONS

### 3.1 Chi Tiết 8 MongoDB Schemas

#### 1. Schema `User` (User.js)
- `name`: String (Required)
- `email`: String (Required, Unique, Indexed)
- `password`: String (Required, Select: false)
- `role`: String (Enum: `['admin', 'giam_doc', 'quan_ly', 'sales', 'cskh', 'customer']`, Default: `'customer'`)
- `phone`: String
- `avatar`: String
- `isDeleted`: Boolean (Default: `false`, Indexed)
- `deletedAt`: Date (Default: `null`)

#### 2. Schema `Car` (Car.js)
- `name`: String (Required, Trim)
- `brand`: ObjectId (Ref: `'Brand'`, Required)
- `price`: Number (Required, Min: 0) - Định dạng VNĐ
- `salePrice`: Number (Min: 0)
- `category`: String (Enum: `['Hypercar', 'Supercar', 'Luxury SUV', 'Grand Tourer']`)
- `year`: Number
- `engine`: String
- `power`: String (Ví dụ: `'710 HP'`)
- `topSpeed`: String (Ví dụ: `'340 km/h'`)
- `acceleration`: String (Ví dụ: `'0-100 km/h: 2.9s'`)
- `images`: [String] (URL ảnh siêu xe)
- `stockCount`: Number (Default: `1`, Min: 0)
- `isFeatured`: Boolean (Default: `false`)
- `isDeleted`: Boolean (Default: `false`, Indexed)

#### 3. Schema `Order` (Order.js)
- `orderCode`: Number (Unique, Required, Index)
- `user`: ObjectId (Ref: `'User'`, Required)
- `car`: ObjectId (Ref: `'Car'`, Required)
- `depositAmount`: Number (Required) - Số tiền cọc VNĐ
- `totalAmount`: Number (Required) - Tổng giá trị xe VNĐ
- `depositPercentage`: Number (Enum: `[10, 20, 30]`, Default: `10`)
- `orderStatus`: String (Enum: `['pending', 'confirmed', 'delivered', 'cancelled']`, Default: `'pending'`)
- `paymentStatus`: String (Enum: `['unpaid', 'partially_paid', 'paid', 'refunded']`, Default: `'unpaid'`)
- `paymentMethod`: String (Enum: `['payos', 'vietqr', 'bank_transfer']`, Default: `'vietqr'`)
- `customerInfo`: Object (`fullName`, `phone`, `email`, `address`, `notes`)
- `isDeleted`: Boolean (Default: `false`)

#### 4. Schema `Appointment` (Appointment.js)
- `user`: ObjectId (Ref: `'User'`)
- `car`: ObjectId (Ref: `'Car'`, Required)
- `fullName`: String (Required)
- `phone`: String (Required)
- `email`: String (Required)
- `preferredDate`: Date (Required)
- `preferredTime`: String (Required)
- `location`: String (Enum: `['showroom_hanoi', 'showroom_hcm', 'home_concierge']`)
- `status`: String (Enum: `['pending', 'confirmed', 'completed', 'cancelled']`, Default: `'pending'`)
- `notes`: String

#### 5. Schema `Contact` (Contact.js)
- `fullName`: String (Required)
- `email`: String (Required)
- `phone`: String (Required)
- `carInterest`: String
- `message`: String
- `leadScore`: Number (Default: `0`)
- `leadCategory`: String (Enum: `['HOT', 'WARM', 'COLD']`, Default: `'COLD'`)
- `status`: String (Enum: `['new', 'processing', 'contacted', 'closed']`, Default: `'new'`)

#### 6. Schema `Brand` (Brand.js)
- `name`: String (Required, Unique)
- `logo`: String
- `country`: String
- `description`: String

#### 7. Schema `Favorite` (Favorite.js)
- `user`: ObjectId (Ref: `'User'`, Required)
- `car`: ObjectId (Ref: `'Car'`, Required)

#### 8. Schema `NotificationLog` (NotificationLog.js)
- `recipient`: String (Email hoặc SĐT)
- `channel`: String (Enum: `['email', 'zalo']`)
- `eventType`: String (Ví dụ: `ORDER_CREATED`, `PAYMENT_SUCCESS`)
- `status`: String (Enum: `['success', 'failed', 'simulated']`)
- `payload`: Object
- `error`: String

---

### 3.2 Cơ Chế Mongoose ACID Session Transaction (Tạo Đơn Cọc & Trừ Kho)
Để giải quyết bài toán tranh chấp dữ liệu khi nhiều khách hàng cùng cọc xe (Race Condition), backend áp dụng **Mongoose ACID Client Session Transaction** trong `orderService.js`:

```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // 1. Kiểm tra và trừ tồn kho atomicity
  const car = await Car.findOneAndUpdate(
    { _id: carId, stockCount: { $gt: 0 }, isDeleted: false },
    { $inc: { stockCount: -1 } },
    { new: true, session }
  );

  if (!car) {
    throw new Error('Xe đã hết hàng hoặc không khả dụng');
  }

  // 2. Tạo đơn cọc trong cùng transaction
  const order = await Order.create([{
    orderCode: generateUniqueOrderCode(),
    user: userId,
    car: carId,
    depositAmount,
    totalAmount: car.price,
    customerInfo
  }], { session });

  // 3. Commit toàn bộ thay đổi vào MongoDB Cloud Atlas
  await session.commitTransaction();
  session.endSession();
  return order[0];
} catch (error) {
  // 4. Nếu bất kỳ bước nào lỗi, Hoàn tác 100% (Abort)
  await session.abortTransaction();
  session.endSession();
  throw error;
}
```

---

## 🔑 CHƯƠNG 4: THIẾT KẾ MA TRẬN PHÂN QUYỀN RBAC 6 ROLES & PHÂN HỆ TRANG

### 4.1 Bảng Ma Trận Phân Quyền RBAC 6 Roles

| Chức Năng / Endpoint | Khách VIP (`customer`) | CSKH (`cskh`) | Sales (`sales`) | Quản Lý (`quanly`) | Giám Đốc (`giam_doc`) | Master Admin (`admin`) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Xem Danh Sách & Chi Tiết Xe** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Đặt Cọc Xe / Lái Thử Concierge** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Quản Lý Lịch Hẹn & Nhật Ký CSKH** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Quản Lý Lead Sales HOT/WARM/COLD** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Quản Lý Tồn Kho Xe (+1/-1 Realtime)**| ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Duyệt Hạn Mức Cọc & Phân Bổ Lead** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Xem Doanh Thu & Duyệt Ưu Đãi Giám Đốc**| ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Master Control & Quản Lý User** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 4.2 Bảng Tài Khoản & URL Phân Hệ Đã Xác Thực 100%

| STT | Phân Hệ Bộ Phận | Email Đăng Nhập | Mật Khẩu | URL Phân Hệ Trang | Chức Năng Chính |
|---|---|---|---|---|---|
| 1 | 👤 **Khách VIP** | `khachvip@gmail.com` | `123456` | `/orders` | Quản lý đơn cọc xe cá nhân & mã VietQR |
| 2 | 🎧 **CSKH** | `cskh@luxemotors.com` | `123456` | `/cskh` | Duyệt lịch hẹn concierge & Lưu nhật ký cuộc gọi |
| 3 | 🛍️ **Sales Executive** | `sales@luxemotors.com` | `123456` | `/sales` | Quản lý leads, lọc HOT/WARM/COLD & Hợp đồng |
| 4 | 👔 **Quản Lý Showroom** | `quanly@luxemotors.com` | `123456` | `/manager` | Điều chỉnh tồn kho (+1/-1) & Duyệt hạn mức cọc |
| 5 | 💼 **Giám Đốc Exec** | `minh.nguyen@gmail.com` | `123456` | `/director` | Giám sát Doanh thu bàn giao & Duyệt ưu đãi lớn |
| 6 | 👑 **Master Admin** | `admin@luxemotors.com` | `123456` | `/admin` | Toàn quyền kiểm soát CRM & Hệ thống |

---

## 💳 CHƯƠNG 5: CỔNG THANH TOÁN VIETQR VIETINBANK & PAYOS GATEWAY

### 5.1 Thẻ Mã QR Ngân Hàng VietinBank chuẩn VIP (`VietQRBankCard.jsx`)
Hệ thống tái tạo 100% giao diện thẻ thanh toán VietQR ngân hàng cao cấp:
- **Ngân Hàng Thụ Hưởng**: VietinBank - Chi nhánh TP.HCM - Hội Sở
- **Chủ Tài Khoản**: `DANG QUANG TUAN`
- **Số Tài Khoản**: `108879666470`
- **Bộ Tiện Ích VIP**:
  - Sao chép 1-Click: Số tài khoản, Số tiền cọc, và Nội dung chuyển khoản.
  - Tải Ảnh QR Về Máy (`downloadQRImage`).
  - Đồng hồ đếm ngược 15:00 phút giữ chỗ cọc xe.
  - Tự động sinh mã VietQR theo chuẩn Quick Link: `https://img.vietqr.io/image/vietinbank-108879666470-compact2.png?amount={depositAmount}&addInfo={orderCode}&accountName=DANG%20QUANG%20TUAN`

### 5.2 Tích Hợp PayOS & Xác Thực HMAC-SHA256 Webhook
- Backend tích hợp `@payos/node` SDK với cơ chế xác minh chữ ký Webhook HMAC-SHA256 trong `payosService.js`.
- Sửa dứt điểm lỗi CJS Default Import Constructor Mismatch: `const PayOS = require('@payos/node').default || require('@payos/node');`.

---

## 📢 CHƯƠNG 6: HỆ THỐNG THÔNG BÁO ĐA KÊNH (NOTIFICATION ENGINE)

### 6.1 Điều Phối Bất Đồng Bộ (`notificationService.js`)
Hệ thống sử dụng mô hình **Asynchronous Non-blocking Orchestration** kết hợp `Promise.allSettled` và `setImmediate` để phát thông báo đa kênh mà không ảnh hưởng tới thời gian phản hồi của API chính:

```
                  [Event: Order Created / Payment Paid]
                                    |
                                    v
                       notificationService.send()
                                    |
            +-----------------------+-----------------------+
            | (Promise.allSettled / setImmediate)           |
            v                                               v
  emailService.sendMail()                         zaloService.sendMessage()
 (Nodemailer Obsidian Gold)                       (Zalo OA API Native Fetch)
            |                                               |
            +-----------------------+-----------------------+
                                    |
                                    v
                       NotificationLog.create()
                     (Lưu nhật ký MongoDB Cloud)
```

### 6.2 Email Template Obsidian & Gold (`emailService.js`)
Gửi email thương hiệu chuẩn phong cách siêu xe cho 4 sự kiện chính:
1. **Tạo đơn đặt cọc mới**: Chi tiết xe, số tiền cọc & hướng dẫn VietQR.
2. **Xác nhận nạp cọc thành công**: Gửi biên nhận giao dịch trực tuyến.
3. **Cập nhật trạng thái đơn**: Bàn giao xe / Đang vận chuyển concierge.
4. **Cảnh báo giữ chỗ sắp hết hạn**: Thông báo đếm ngược thanh toán cọc.

---

## 🛡️ CHƯƠNG 7: NHẬT KÝ AUDIT AN NINH & XỬ LÝ 44 ISSUE KỸ THUẬT (P01 - P41)

Bảng tổng hợp tiêu biểu các lỗ hổng kỹ thuật nghiêm trọng đã được khắc phục hoàn toàn trong dự án:

| Mã Issue | Loại Issue | Mức Độ | Tệp Mã Nguồn | Mô Tả & Phương Pháp Khắc Phục |
|---|---|---|---|---|
| **P01** | Security | **CRITICAL** | `rateLimitMiddleware.js` | Loại bỏ dummy `next()`. Triển khai Custom IP Memory Rate Limiter (Auth 10/15m, Chat 15/1m, API 100/1m). |
| **P02** | Bug #001 | **CRITICAL** | `server.js` | Xóa bỏ lệnh gán DNS cứng `1.1.1.1`. Trả quyền phân giải DNS cho OS/Cloud Host. |
| **P03** | Bug #002 | **CRITICAL** | `orderService.js` | Xóa bỏ khối logic nhân 25.000 lần giá xe bị lặp. Giữ nguyên định dạng VNĐ chuẩn từ DB. |
| **P04** | Security | **CRITICAL** | `server.js` | Khóa chặt CORS Origin theo Whitelist cấu hình, loại bỏ wildcard `.vercel.app`. |
| **P05** | Consistency | **CRITICAL** | `orderService.js` | Triển khai Mongoose ACID Session Transaction bảo đảm atomicity khi trừ kho và tạo đơn cọc. |
| **P06** | Security | **CRITICAL** | `authController.js` | Nâng cấp mô hình Dual Token (Access Token 15m + Refresh Token HttpOnly Cookie 7d). |
| **P07** | Security | **HIGH** | `orderRoutes.js` | Tước quyền duyệt cọc xe của role `cskh`, giới hạn chỉ dành cho `admin`, `giam_doc`, `quan_ly`, `sales`. |
| **P08** | Performance | **HIGH** | `server.js` | Xóa bỏ tự động chạy `seedFullData()` khi boot HTTP server. Tách riêng thành CLI command `npm run seed`. |
| **P12** | Data Protection | **HIGH** | `Car.js`, `User.js`, `Order.js` | Bổ sung cơ chế Soft Delete với các trường `isDeleted` và `deletedAt`. |
| **P14** | Bug #003 | **HIGH** | `imageController.js` | Tự động phát hiện header `x-forwarded-proto` để ép kiểu URL ảnh HTTPS, chống Mixed-Content. |
| **P19** | Security | **HIGH** | `sanitizeMiddleware.js` | Thêm `mongoSanitizeMiddleware` loại bỏ các operator NoSQL Injection (`$gt`, `$ne`, `$where`). |
| **P29** | UX/Security | **HIGH** | `api.js` (Frontend) | Tích hợp Axios Interceptor tự động làm mới token qua `/api/auth/refresh` khi bị lỗi 401. |
| **P28** | Resilience | **MEDIUM** | `ErrorBoundary.jsx` | Thêm React Error Boundary bao bọc ứng dụng, ngăn hiện tượng White Screen of Death. |

---

## 🎨 CHƯƠNG 8: CHUẨN HÓA UI/UX PRO MAX & HỆ THỐNG DESIGN TOKENS

### 8.1 Hệ Ngôn Ngữ Thiết Kế Obsidian & Gold
- **Obsidian Dark Background**: `#0B0C10` (Trang chính), `#16181D` (Card & Modal background).
- **Luxury Metallic Gold Primary**: `#D4AF37` / `#E5C158` (Border, Button, Highlight Badge).
- **Emerald Green Status**: `#10B981` (Tồn kho còn hàng, Đơn đã xác nhận).
- **Crimson Red Alert**: `#EF4444` (Xe hết hàng, HOT Lead 🔴).

### 8.2 Chuẩn Hóa Font Chữ Toàn Hệ Thống
- **Display Header**: `Cormorant Garamond` (Font Serif sang trọng dành cho tiêu đề siêu xe).
- **Body & Controls**: `Jost` (Font Geometric Sans thanh lịch được các hãng xe hàng đầu thế giới tin dùng).

### 8.3 Màn Hình Chờ Sang Trọng (`LoadingScreen.jsx`)
- Tích hợp hiệu ứng logo kim cương mạ vàng xoay mượt, thanh đếm tiến độ %, slogan thương hiệu.
- Lưu trạng thái vào `sessionStorage` để chỉ hiển thị 1 lần duy nhất khi khách mở trang đầu tiên.

---

## 🚀 CHƯƠNG 9: KẾT LUẬN & HƯỚNG PHÁT TRIỂN

### 9.1 Kết Quả Đạt Được
- Hệ thống **Luxe Motors Ver 2.0** hoàn thiện 100% các tính năng thương mại siêu xe VIP Concierge.
- Khắc phục triệt để **44 lỗi an ninh và nợ kỹ thuật**, đạt tiêu chuẩn sẵn sàng vận hành trên môi trường Production Cloud.
- Hệ thống 6 phân hệ người dùng hoạt động mượt mà, đồng bộ dữ liệu Cloud MongoDB Atlas theo thời gian thực.

### 9.2 Hướng Phát Triển Tương Lai
1. Tích hợp công nghệ thực tế ảo **AR / 3D WebGL** cho phép khách hàng cá nhân hóa màu sơn và nội thất siêu xe theo yêu cầu (Bespoke Configurator).
2. Tích hợp AI Predictive Analytics dự báo xu hướng nhu cầu mua siêu xe theo mùa cho Giám đốc Exec.
3. Mở rộng ứng dụng di động Native (React Native / Flutter) cho Khách VIP.
