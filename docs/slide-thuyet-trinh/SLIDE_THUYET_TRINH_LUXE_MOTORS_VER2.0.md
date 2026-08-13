# 📊 BỘ SLIDE THUYẾT TRÌNH ĐỒ ÁN / KỸ THUẬT
## HỆ THỐNG PHÂN PHỐI & TRẢI NGHIỆM SIÊU XE TRỰC TUYẾN LUXE MOTORS VER 2.0

---

## 📽️ SLIDE 1: BÌA THUYẾT TRÌNH (TITLE SLIDE)

### LUXE MOTORS VER 2.0
**Hệ Thống Phân Phối & Trải Nghiệm Siêu Xe Trực Tuyến Concierge**

- **Tác Giả / Developer:** Đặng Quang Tuấn
- **Phiên Bản:** Ver 2.0 (Production Ready)
- **Hotline Support VIP:** 0372 950 720
- **Kiến Trúc:** Decoupled React 18 SPA + Node.js Express REST API + Cloud MongoDB Atlas

---

## 📽️ SLIDE 2: TỔNG QUAN & SỨ MỆNH THƯƠNG HIỆU

### Sứ Mệnh & Bài Toán Nghiệp Vụ Siêu Xe

1. **💎 Trải Nghiệm Khách VIP Concierge**:
   - Khám phá bộ sưu tập Hypercar, Supercar, Luxury SUV với thông số chuẩn.
   - Đặt cọc 1-Click giữ chỗ siêu xe qua VietQR / PayOS.
   - Dịch vụ Concierge lái thử tận nhà hoặc đón tiếp tại Showroom Hà Nội / TP.HCM.
   - AI Chatbot VIP Concierge tư vấn 24/7.

2. **🏢 Quản Trị Doanh Nghiệp (RBAC 6 Roles)**:
   - Ma trận phân quyền 6 phân hệ: Admin, Giám đốc, Quản lý, Sales, CSKH, Khách VIP.
   - Quản lý tồn kho xe realtime (+1/-1 chiếc).
   - Thuật toán tự động phân loại Lead HOT 🔴 / WARM 🟡 / COLD 🔵.
   - Phê duyệt ưu đãi hợp đồng lớn 1-Click cho Giám đốc Exec.

---

## 📽️ SLIDE 3: KIẾN TRÚC HỆ THỐNG & TECH STACK

### Decoupled Client-Server Architecture

- **Frontend Core (SPA)**:
  - **Framework:** React 18 + Vite (Tối ưu tốc độ load & build).
  - **Styling:** Vanilla CSS + Tailwind CSS (Obsidian `#0B0C10` & Gold `#D4AF37`).
  - **Typography:** Jost Geometric Sans + Cormorant Garamond Serif.
  - **Network:** Axios Client Interceptor tự động Refresh Token.

- **Backend Core (REST API)**:
  - **Runtime:** Node.js + Express Framework.
  - **Cloud DB:** Cloud MongoDB Atlas + Mongoose Client Session Transaction.
  - **Security:** Helmet, Custom Memory IP Rate Limiter, Express Mongo Sanitize NoSQL Guard.
  - **Auth:** JWT Dual Token (Access Token 15m + HttpOnly Cookie 7d).

---

## 📽️ SLIDE 4: THIẾT KẾ DỮ LIỆU CLOUD MONGODB (8 SCHEMAS)

### Structure & Entity Relationships

1. `User`: Quản lý thông tin tài khoản, bcrypt password, role RBAC & Soft delete fields.
2. `Car`: Chi tiết siêu xe, giá niêm yết VNĐ, thông số động cơ, tồn kho realtime `stockCount`.
3. `Order`: Đơn cọc xe 10-30%, trạng thái thanh toán VietQR / PayOS, giao xe Concierge.
4. `Appointment`: Lịch hẹn lái thử tận nhà / showroom, thời gian & trạng thái CSKH.
5. `Contact`: Khách hàng liên hệ, thuật toán chấm điểm Lead Intent.
6. `Brand`: Danh mục thương hiệu siêu xe (Ferrari, Lamborghini, Rolls-Royce, Porsche).
7. `Favorite`: Bộ sưu tập siêu xe yêu thích của Khách VIP.
8. `NotificationLog`: Nhật ký phát thông báo Email Obsidian & Zalo OA API.

---

## 📽️ SLIDE 5: MONGOOSE ACID CLIENT SESSION TRANSACTION

### Xử Lý An Toàn Tồn Kho & Đặt Cọc Đồng Thời

- **Bài toán**: Ngăn ngừa tình trạng Overselling (bán quá số lượng tồn kho) khi nhiều khách cọc cùng lúc.
- **Giải pháp**: Bọc thao tác trừ kho và tạo đơn trong Mongoose Session Transaction:

```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  const car = await Car.findOneAndUpdate(
    { _id: carId, stockCount: { $gt: 0 }, isDeleted: false },
    { $inc: { stockCount: -1 } },
    { new: true, session }
  );
  if (!car) throw new Error('Xe đã hết hàng');

  const order = await Order.create([{ ... }], { session });
  await session.commitTransaction();
  return order[0];
} catch (err) {
  await session.abortTransaction();
  throw err;
}
```

---

## 📽️ SLIDE 6: MA TRẬN PHÂN QUYỀN RBAC 6 ROLES

### Bảng Phân Hệ Trang & Tài Khoản Đã Xác Thực 100%

| Bộ Phận | Role Key | Email Đăng Nhập | URL Phân Hệ | Quyền Hạn Trọng Tâm |
|---|---|---|---|---|
| 👤 **Khách VIP** | `customer` | `khachvip@gmail.com` | `/orders` | Đặt cọc xe 1-Click, Lịch Concierge, Mã VietQR |
| 🎧 **CSKH** | `cskh` | `cskh@luxemotors.com` | `/cskh` | Duyệt lịch hẹn concierge & Lưu nhật ký gọi CSKH |
| 🛍️ **Sales** | `sales` | `sales@luxemotors.com` | `/sales` | Lọc Lead HOT/WARM/COLD, Theo dõi hợp đồng |
| 👔 **Quản Lý** | `quanly` | `quanly@luxemotors.com` | `/manager` | Tồn kho (+1/-1 Realtime), Duyệt hạn mức cọc |
| 💼 **Giám Đốc** | `giam_doc` | `minh.nguyen@gmail.com` | `/director` | Doanh thu bàn giao thực tế, Duyệt ưu đãi lớn |
| 👑 **Admin** | `admin` | `admin@luxemotors.com` | `/admin` | Master control 100% hệ thống & User Access |

---

## 📽️ SLIDE 7: TRẢI NGHIỆM KHÁCH VIP & LOADING SCREEN

### UI/UX Pro Max System Tokens

- **Geometric Sans Typography**: Chuẩn hóa 100% font **Jost** thanh lịch trên toàn bộ giao diện điều khiển và font serif **Cormorant Garamond** cho tiêu đề siêu xe.
- **LoadingScreen.jsx**: Màn hình chào VIP biểu tượng kim cương mạ vàng xoay mượt, đếm tiến độ %, lưu `sessionStorage` xuất hiện 1 lần duy nhất khi mở trang.
- **VIP PolicyModal.jsx**: Modal 3 tab xem chính sách bảo mật NDA 256-bit, quy trình đặt cọc/lái thử tận nhà, và đặc quyền bảo hành 5 năm chính hãng.

---

## 📽️ SLIDE 8: CỔNG THANH TOÁN VIETQR VIETINBANK & PAYOS GATEWAY

### Chuẩn Hóa Thanh Toán Giao Dịch Cọc Siêu Xe

- **Thẻ Mã QR VietinBank chuẩn VIP (`VietQRBankCard.jsx`)**:
  - Chủ TK: **DANG QUANG TUAN** - STK: **108879666470** - Ngân hàng VietinBank CN TP.HCM.
  - Tự động sinh mã VietQR theo số tiền cọc (10%, 20%, 30% VNĐ).
  - Tiện ích Sao chép 1-Click STK / Số tiền / Nội dung cọc, Nút Tải ảnh QR về máy, Đồng hồ đếm ngược 15:00 giữ chỗ.

- **Cổng PayOS Gateway**:
  - Xác thực Webhook HMAC-SHA256 bảo đảm an toàn giao dịch trực tuyến.
  - Tự động chuyển `paymentStatus: 'paid'` và phát email biên nhận cho khách VIP.

---

## 📽️ SLIDE 9: AI CHATBOT VIP CONCIERGE & DUAL TOKEN SECURITY

### Hỗ Trợ Thông Minh & An Ninh Xác Thực

- **AI Chatbot VIP Concierge (`Chatbot.jsx`)**:
  - Tích hợp Google Gemini AI với System Prompt lịch sự, am hiểu siêu xe.
  - Tất cả liên kết xe gợi ý từ AI được thiết kế dạng bấm mở ở **tab mới (`target="_blank"`)** giữ nguyên hội thoại khách hàng.

- **Mô Hình Security Dual Token**:
  - Access Token (15 phút) cấp cho Client.
  - Refresh Token (7 ngày) lưu an toàn trong **HttpOnly Cookie** (`sameSite: 'lax'`).
  - Axios Interceptor tự động refresh ngầm khi token hết hạn.

---

## 📽️ SLIDE 10: PHÂN HỆ GIÁM ĐỐC EXEC (`/director`)

### Giám Sát Doanh Thu Realtime & Phê Duyệt Ưu Đãi

- **Doanh Thu Realtime**: Hiển thị chính xác tổng giá trị bàn giao xe `completedRevenue` và lợi nhuận gộp thực thu `totalProfit`.
- **Thanh Tiến Độ Chỉ Tiêu**: Đo đạc doanh thu Quý 3/2026 (Mục tiêu 300 Tỷ VNĐ) & biểu đồ phân bổ tỷ trọng doanh số theo các hãng siêu xe.
- **Phê Duyệt 1-Click**: Nút **`✓ Phê Duyệt Ưu Đãi Giám Đốc`** kích hoạt lệnh duyệt hợp đồng cập nhật DB trực tiếp.

---

## 📽️ SLIDE 11: PHÂN HỆ QUẢN LÝ SHOWROOM (`/manager`)

### Điều Chỉnh Tồn Kho & Phân Bổ Nguồn Lực

- **Điều Chỉnh Tồn Kho Realtime (+1/-1)**: Tích hợp 2 nút **`+`** và **`-`** trên từng thẻ xe cho phép Quản lý tăng/giảm số lượng xe sẵn có trong kho ngay lập tức.
- **Duyệt Hạn Mức Cọc**: Kiểm soát hạn mức cọc xe đối với các siêu xe Hypercar hiếm.
- **Phân Bổ Lead**: Gán trực tiếp khách hàng tiềm năng cho chuyên viên Sales Executive phụ trách.

---

## 📽️ SLIDE 12: PHÂN HỆ SALES EXECUTIVE (`/sales`)

### Thuật Toán Phân Loại Lead HOT🔴 / WARM🟡 / COLD🔵

- **Thuật Toán Chấm Điểm Intent (`AdminContacts.jsx`)**:
  - Email doanh nghiệp riêng: +2 điểm.
  - Từ khóa mua bán / cọc xe / chốt giá: +1 điểm/từ.
  - Điền đầy đủ thông tin: +1 điểm/trường.
  - **HOT 🔴** (Điểm >= 5) | **WARM 🟡** (Điểm >= 3) | **COLD 🔵**.
  - Tự động ưu tiên xếp HOT Lead lên đầu danh sách để chăm sóc tức thì.

---

## 📽️ SLIDE 13: PHÂN HỆ CHĂM SÓC KHÁCH HÀNG (`/cskh`)

### Quản Lý Concierge & Nhật Ký Tư Vấn

- **Quản Lý Lịch Hẹn**: Nút **`Xác Nhận Lịch`** và **`✓ Hoàn Thành`** cập nhật trạng thái đón tiếp lái thử trực tiếp trên Cloud Database.
- **Lưu Nhật Ký Cuộc Gọi CSKH**: Modal nhập nội dung ghi chú tư vấn và lưu trữ vĩnh viễn vào DB.
- **Hotline VIP Đồng Bộ**: Hotline chính thức **0372 950 720** hiển thị trên tất cả giao diện.

---

## 📽️ SLIDE 14: HỆ THỐNG THÔNG BÁO ĐA KÊNH (EMAIL & ZALO OA)

### Asynchronous Notification Orchestrator

- **Bất Đồng Bộ An Toàn**: Sử dụng `Promise.allSettled` và `setImmediate` trong `notificationService.js` đảm bảo việc gửi email/zalo không làm nghẽn API response.
- **Email Nodemailer Gold Obsidian**: Template HTML cao cấp cho 4 sự kiện (Đơn cọc mới, Nạp cọc thành công, Cập nhật giao xe, Cảnh báo giữ chỗ sắp hết hạn).
- **Zalo Official Account API**: Tích hợp Zalo OA API native fetch, lưu nhật ký chi tiết trong `NotificationLog`.

---

## 📽️ SLIDE 15: SECURITY AUDIT & KHẮC PHỤC 44 ISSUE (P01 - P41)

### Nhật Ký Xử Lý Lỗ Hổng Kỹ Thuật Tiêu Biểu

- **P01 (Critical)**: Fixed Rate Limiter Bypass bằng Custom IP Memory Rate Limiter.
- **P02 (Critical)**: Xóa bỏ hardcode DNS `1.1.1.1` trong `server.js`.
- **P03 (Critical)**: Sửa lỗi quy đổi giá bị nhân 25.000 lần trong `orderService.js`.
- **P04 (Critical)**: Khóa chặt CORS Origin theo Whitelist cấu hình.
- **P05 (Critical)**: Mongoose Client Session Transaction bảo vệ atomicity trừ kho & tạo đơn.
- **P06 (Critical)**: Dual Token Model (Access Token 15m + Refresh Cookie 7d).
- **P19 (High)**: Thêm `mongoSanitizeMiddleware` chống NoSQL Query Injection.
- **P29 (High)**: Axios Response Interceptors tự động Refresh Token khi gặp HTTP 401.

---

## 📽️ SLIDE 16: TỔNG KẾT & Q&A

### Luxe Motors Ver 2.0 Ready For Production

- **100% Hoàn Thành**: 12+ hạng mục UI/UX & 44 Issue Audit an ninh xử lý triệt để.
- **Đồng Bộ Realtime Cloud**: 6 Phân hệ người dùng kết nối MongoDB Atlas mượt mà.
- **Hotline Concierge VIP**: **0372 950 720** (Đặng Quang Tuấn).

**CẢM ƠN HỘI ĐỒNG & QUÝ KHÁCH HÀNG ĐÃ THEO DÕI!**
