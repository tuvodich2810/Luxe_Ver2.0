const User = require('../models/User');
const Brand = require('../models/Brand');
const Car = require('../models/Car');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const Favorite = require('../models/Favorite');

const seedFullData = async () => {
  console.log('🔄 Đang khởi tạo và đồng bộ dữ liệu 8 tháng (Tháng 1 - Tháng 8/2026) vào MongoDB...');

  // Xóa sạch dữ liệu cũ
  await Promise.all([
    User.deleteMany({}),
    Brand.deleteMany({}),
    Car.deleteMany({}),
    Appointment.deleteMany({}),
    Order.deleteMany({}),
    Contact.deleteMany({}),
    Favorite.deleteMany({}),
  ]);

  // 1. USERS (10 Người dùng)
  const users = await User.create([
    { fullName: 'Luxe Motors Admin', email: 'admin@luxemotors.com', password: '123456', phone: '0901234567', role: 'admin' },
    { fullName: 'Nguyễn Văn Minh (Giám Đốc Exec)', email: 'minh.nguyen@gmail.com', password: '123456', phone: '0918889999', role: 'giam_doc' },
    { fullName: 'Trần Văn Quản Lý (Showroom Manager)', email: 'quanly@luxemotors.com', password: '123456', phone: '0933456789', role: 'quan_ly' },
    { fullName: 'Trần Văn Sales (Sales Executive)', email: 'sales@luxemotors.com', password: '123456', phone: '0977112233', role: 'sales' },
    { fullName: 'Phạm Thị CSKH (Customer Service)', email: 'cskh@luxemotors.com', password: '123456', phone: '0988554433', role: 'cskh' },
    { fullName: 'Võ Minh Khang (Khách VIP)', email: 'khachvip@gmail.com', password: '123456', phone: '0966778899', role: 'user' },
    { fullName: 'Trần Thị Thu Thủy (Khách VIP)', email: 'thuy.tran@gmail.com', password: '123456', phone: '0911223344', role: 'user' },
    { fullName: 'Lê Hoàng Nam (Khách Doanh Nhân)', email: 'nam.le@gmail.com', password: '123456', phone: '0922334455', role: 'user' },
    { fullName: 'Phạm Đức Hoàng (Chủ Tập Đoàn)', email: 'hoang.pham@gmail.com', password: '123456', phone: '0933445566', role: 'user' },
    { fullName: 'Đặng Quốc Cường (Khách Hàng VIP)', email: 'cuong.dang@gmail.com', password: '123456', phone: '0944556677', role: 'user' },
  ]);

  const [adminU, directorU, managerU, salesU, cskhU, vipKhang, vipThuy, vipNam, vipHoang, vipCuong] = users;

  // 2. BRANDS (10 Thương hiệu)
  const brands = await Brand.create([
    { name: 'Ferrari', country: 'Italy', logo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=300', isPopular: true },
    { name: 'Lamborghini', country: 'Italy', logo: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=300', isPopular: true },
    { name: 'Porsche', country: 'Germany', logo: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=300', isPopular: true },
    { name: 'Rolls-Royce', country: 'United Kingdom', logo: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=300', isPopular: true },
    { name: 'McLaren', country: 'United Kingdom', logo: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=300', isPopular: true },
    { name: 'Bentley', country: 'United Kingdom', logo: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=300', isPopular: true },
    { name: 'Aston Martin', country: 'United Kingdom', logo: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=300', isPopular: true },
    { name: 'Bugatti', country: 'France', logo: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=300', isPopular: true },
    { name: 'Koenigsegg', country: 'Sweden', logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=300', isPopular: true },
    { name: 'Pagani', country: 'Italy', logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=300', isPopular: true },
  ]);

  const [bFerrari, bLambo, bPorsche, bRR, bMcLaren, bBentley, bAston, bBugatti, bKoenigsegg, bPagani] = brands;

  // 3. CARS (10 Siêu Xe Độc Bản)
  const cars = await Car.create([
    {
      name: 'Ferrari SF90 Stradale', brand: bFerrari._id, model: 'SF90 Stradale', year: 2026,
      excerpt: 'Hypercar Hybrid 1,000 HP đỉnh cao Maranello.',
      description: 'Ferrari SF90 Stradale trang bị động cơ V8 Turbo kết hợp 3 mô tơ điện.',
      price: 34500000000,
      images: [{ url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200', isMain: true }],
      category: 'hypercar', condition: 'new',
      specifications: { engine: '4.0L V8 Twin-Turbo Plug-in Hybrid', horsepower: 1000, torque: 800, transmission: '8-Speed Dual Clutch', acceleration: 2.5, topSpeed: 340 },
      inStock: true, stockCount: 5, isFeatured: true, isPublished: true
    },
    {
      name: 'Lamborghini Revuelto V12', brand: bLambo._id, model: 'Revuelto', year: 2026,
      excerpt: 'V12 Plug-in Hybrid Super Sports 1,015 HP.',
      description: 'Siêu xe Revuelto kế thừa dòng sản phẩm V12 huyền thoại của Lamborghini.',
      price: 43600000000,
      images: [{ url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1200', isMain: true }],
      category: 'supercar', condition: 'new',
      specifications: { engine: '6.5L V12 Naturally Aspirated + 3 Electric Motors', horsepower: 1015, torque: 725, transmission: '8-Speed Dual Clutch', acceleration: 2.5, topSpeed: 350 },
      inStock: true, stockCount: 5, isFeatured: true, isPublished: true
    },
    {
      name: 'Porsche 911 GT3 RS Weissach', brand: bPorsche._id, model: '911 GT3 RS', year: 2026,
      excerpt: 'Đỉnh cao khí động học đường đua Nürburgring.',
      description: 'Porsche 911 GT3 RS trang bị hệ thống DRS active wing.',
      price: 21500000000,
      images: [{ url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200', isMain: true }],
      category: 'supercar', condition: 'new',
      specifications: { engine: '4.0L Flat-6 Naturally Aspirated', horsepower: 525, torque: 465, transmission: '7-Speed PDK', acceleration: 3.2, topSpeed: 296 },
      inStock: true, stockCount: 4, isFeatured: true, isPublished: true
    },
    {
      name: 'Rolls-Royce Phantom VIII Extended', brand: bRR._id, model: 'Phantom VIII', year: 2026,
      excerpt: 'Đỉnh cao thương gia & bảo tàng di động thượng lưu.',
      description: 'Rolls-Royce Phantom VIII Extended Edition với khoang ông chủ Privacy Suite.',
      price: 54000000000,
      images: [{ url: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=1200', isMain: true }],
      category: 'luxury_sedan', condition: 'new',
      specifications: { engine: '6.75L V12 Twin-Turbo', horsepower: 563, torque: 900, transmission: '8-Speed Automatic', acceleration: 5.3, topSpeed: 250 },
      inStock: true, stockCount: 3, isFeatured: true, isPublished: true
    },
    {
      name: 'McLaren 750S Spider', brand: bMcLaren._id, model: '750S Spider', year: 2026,
      excerpt: 'Siêu xe mui xếp siêu nhẹ 750 mã lực.',
      description: 'McLaren 750S Spider nhẹ hơn 30kg so với tiền nhiệm 720S.',
      price: 24800000000,
      images: [{ url: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1200', isMain: true }],
      category: 'supercar', condition: 'new',
      specifications: { engine: '4.0L V8 Twin-Turbo', horsepower: 750, torque: 800, transmission: '7-Speed SSG', acceleration: 2.8, topSpeed: 332 },
      inStock: true, stockCount: 5, isFeatured: true, isPublished: true
    },
    {
      name: 'Bentley Continental GT Speed', brand: bBentley._id, model: 'Continental GT', year: 2026,
      excerpt: 'Tuyệt tác Grand Tourer W12 650 HP.',
      description: 'Bentley Continental GT Speed kết hợp sự sang trọng xa xỉ và sức mạnh vượt trội.',
      price: 22000000000,
      images: [{ url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200', isMain: true }],
      category: 'grand_tourer', condition: 'new',
      specifications: { engine: '6.0L W12 Twin-Turbo', horsepower: 650, torque: 900, transmission: '8-Speed Dual Clutch', acceleration: 3.6, topSpeed: 335 },
      inStock: true, stockCount: 4, isFeatured: true, isPublished: true
    },
    {
      name: 'Aston Martin Valkyrie AMR Pro', brand: bAston._id, model: 'Valkyrie AMR Pro', year: 2026,
      excerpt: 'Hypercar F1 đường đua mạnh 1,160 mã lực.',
      description: 'Aston Martin Valkyrie trang bị động cơ Cosworth V12 6.5L quay đến 11,100 vòng/phút.',
      price: 79000000000,
      images: [{ url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200', isMain: true }],
      category: 'hypercar', condition: 'new',
      specifications: { engine: '6.5L V12 Naturally Aspirated Hybrid', horsepower: 1160, torque: 900, transmission: '7-Speed Single Clutch', acceleration: 2.3, topSpeed: 400 },
      inStock: true, stockCount: 2, isFeatured: true, isPublished: true
    },
    {
      name: 'Bugatti Chiron Super Sport', brand: bBugatti._id, model: 'Chiron Super Sport', year: 2026,
      excerpt: 'Hypercar tốc độ 440 km/h W16 Quad-Turbo.',
      description: 'Bugatti Chiron Super Sport sở hữu động cơ 8.0L W16 Quad-Turbo 1,600 mã lực.',
      price: 92000000000,
      images: [{ url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1200', isMain: true }],
      category: 'hypercar', condition: 'new',
      specifications: { engine: '8.0L W16 Quad-Turbo', horsepower: 1600, torque: 1600, transmission: '7-Speed Dual Clutch', acceleration: 2.4, topSpeed: 440 },
      inStock: true, stockCount: 2, isFeatured: true, isPublished: true
    },
    {
      name: 'Koenigsegg Jesko Attack', brand: bKoenigsegg._id, model: 'Jesko Attack', year: 2026,
      excerpt: 'Megacar Thụy Điển 1,600 HP hộp số LST 9 cấp.',
      description: 'Koenigsegg Jesko Attack tạo ra lực ép khí động học 1,400 kg.',
      price: 85000000000,
      images: [{ url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200', isMain: true }],
      category: 'hypercar', condition: 'new',
      specifications: { engine: '5.0L V8 Twin-Turbo E85', horsepower: 1600, torque: 1500, transmission: '9-Speed Light Speed Transmission', acceleration: 2.5, topSpeed: 480 },
      inStock: true, stockCount: 2, isFeatured: true, isPublished: true
    },
    {
      name: 'Pagani Huayra BC Bespoke', brand: bPagani._id, model: 'Huayra BC', year: 2026,
      excerpt: 'Tuyệt tác nghệ thuật sợi Carbon mạ vàng 24K.',
      description: 'Pagani Huayra BC sản xuất thủ công tại Modena, Ý.',
      price: 88000000000,
      images: [{ url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200', isMain: true }],
      category: 'hypercar', condition: 'new',
      specifications: { engine: '6.0L V12 Twin-Turbo AMG', horsepower: 800, torque: 1100, transmission: '7-Speed Xtrac', acceleration: 2.7, topSpeed: 383 },
      inStock: true, stockCount: 2, isFeatured: true, isPublished: true
    },
  ]);

  const [cSF90, cRevuelto, cGT3RS, cPhantom, c750S, cContinental, cValkyrie, cChiron, cJesko, cHuayra] = cars;

  // 4. APPOINTMENTS (16 Lịch hẹn Rải Đều 8 Tháng: 2 Lịch Mỗi Tháng)
  const appointments = await Appointment.create([
    // Tháng 1
    { user: vipKhang._id, car: cSF90._id, appointmentDate: new Date('2026-01-10'), timeSlot: '10:00', visitorName: 'Võ Minh Khang', visitorPhone: '0966778899', visitorEmail: 'khachvip@gmail.com', notes: 'Tháng 1: Thử cảm giác lái 1000 HP SF90 Stradale.', status: 'completed' },
    { user: vipThuy._id, car: cGT3RS._id, appointmentDate: new Date('2026-01-22'), timeSlot: '14:30', visitorName: 'Trần Thị Thu Thủy', visitorPhone: '0911223344', visitorEmail: 'thuy.tran@gmail.com', notes: 'Tháng 1: Trải nghiệm DRS cánh gió Porsche GT3 RS.', status: 'completed' },

    // Tháng 2
    { user: vipNam._id, car: c750S._id, appointmentDate: new Date('2026-02-08'), timeSlot: '09:30', visitorName: 'Lê Hoàng Nam', visitorPhone: '0922334455', visitorEmail: 'nam.le@gmail.com', notes: 'Tháng 2: Đón tiếp tại phòng VIP McLaren Lounge.', status: 'completed' },
    { user: vipHoang._id, car: cContinental._id, appointmentDate: new Date('2026-02-20'), timeSlot: '15:00', visitorName: 'Phạm Đức Hoàng', visitorPhone: '0933445566', visitorEmail: 'hoang.pham@gmail.com', notes: 'Tháng 2: Chạy thử Bentley Continental GT Speed.', status: 'completed' },

    // Tháng 3
    { user: vipCuong._id, car: cRevuelto._id, appointmentDate: new Date('2026-03-05'), timeSlot: '10:00', visitorName: 'Đặng Quốc Cường', visitorPhone: '0944556677', visitorEmail: 'cuong.dang@gmail.com', notes: 'Tháng 3: Xem siêu xe V12 Hybrid Revuelto.', status: 'completed' },
    { user: vipKhang._id, car: cPhantom._id, appointmentDate: new Date('2026-03-18'), timeSlot: '16:00', visitorName: 'Võ Minh Khang', visitorPhone: '0966778899', visitorEmail: 'khachvip@gmail.com', notes: 'Tháng 3: Trải nghiệm khoang Privacy Suite Rolls-Royce.', status: 'completed' },

    // Tháng 4
    { user: vipThuy._id, car: cValkyrie._id, appointmentDate: new Date('2026-04-04'), timeSlot: '11:00', visitorName: 'Trần Thị Thu Thủy', visitorPhone: '0911223344', visitorEmail: 'thuy.tran@gmail.com', notes: 'Tháng 4: Xem trực tiếp Aston Martin Valkyrie F1.', status: 'completed' },
    { user: vipNam._id, car: cGT3RS._id, appointmentDate: new Date('2026-04-20'), timeSlot: '14:00', visitorName: 'Lê Hoàng Nam', visitorPhone: '0922334455', visitorEmail: 'nam.le@gmail.com', notes: 'Tháng 4: Thử tốc độ Porsche GT3 RS tại đường thử.', status: 'completed' },

    // Tháng 5
    { user: vipHoang._id, car: cSF90._id, appointmentDate: new Date('2026-05-08'), timeSlot: '09:00', visitorName: 'Phạm Đức Hoàng', visitorPhone: '0933445566', visitorEmail: 'hoang.pham@gmail.com', notes: 'Tháng 5: Tư vấn gói Option sợi carbon Ferrari.', status: 'completed' },
    { user: vipCuong._id, car: cChiron._id, appointmentDate: new Date('2026-05-25'), timeSlot: '15:30', visitorName: 'Đặng Quốc Cường', visitorPhone: '0944556677', visitorEmail: 'cuong.dang@gmail.com', notes: 'Tháng 5: Đón tiếp chuyên gia Bugatti Pháp.', status: 'completed' },

    // Tháng 6
    { user: vipKhang._id, car: cRevuelto._id, appointmentDate: new Date('2026-06-03'), timeSlot: '10:30', visitorName: 'Võ Minh Khang', visitorPhone: '0966778899', visitorEmail: 'khachvip@gmail.com', notes: 'Tháng 6: Chạy thử Lamborghini Revuelto.', status: 'completed' },
    { user: vipThuy._id, car: cJesko._id, appointmentDate: new Date('2026-06-22'), timeSlot: '14:00', visitorName: 'Trần Thị Thu Thủy', visitorPhone: '0911223344', visitorEmail: 'thuy.tran@gmail.com', notes: 'Tháng 6: Đặt lịch xem Megacar Koenigsegg Jesko.', status: 'completed' },

    // Tháng 7
    { user: vipNam._id, car: cHuayra._id, appointmentDate: new Date('2026-07-05'), timeSlot: '11:30', visitorName: 'Lê Hoàng Nam', visitorPhone: '0922334455', visitorEmail: 'nam.le@gmail.com', notes: 'Tháng 7: Xem Pagani Huayra BC bản cá nhân hóa.', status: 'completed' },
    { user: vipHoang._id, car: cValkyrie._id, appointmentDate: new Date('2026-07-20'), timeSlot: '16:00', visitorName: 'Phạm Đức Hoàng', visitorPhone: '0933445566', visitorEmail: 'hoang.pham@gmail.com', notes: 'Tháng 7: Đưa xe lồng chở Valkyrie đến dinh thự.', status: 'completed' },

    // Tháng 8 (Hiện tại)
    { user: vipKhang._id, car: cChiron._id, appointmentDate: new Date('2026-08-04'), timeSlot: '10:00', visitorName: 'Võ Minh Khang', visitorPhone: '0966778899', visitorEmail: 'khachvip@gmail.com', notes: 'Tháng 8: Bàn giao hồ sơ nhập khẩu Bugatti Chiron.', status: 'confirmed' },
    { user: vipCuong._id, car: c750S._id, appointmentDate: new Date('2026-08-11'), timeSlot: '15:00', visitorName: 'Đặng Quốc Cường', visitorPhone: '0944556677', visitorEmail: 'cuong.dang@gmail.com', notes: 'Tháng 8: Trải nghiệm McLaren 750S Spider mui xếp.', status: 'pending' },
  ]);

  // 5. ORDERS (25 Đơn Hàng Rải Đều 8 Tháng — 3 Đơn Mỗi Tháng: TỔNG DOANH THU > 1,200 TỶ VNĐ)
  const ordersData = [
    // --- THÁNG 1 (78 Tỷ) ---
    { orderNumber: 'LM-2026-0101', user: vipKhang._id, car: cSF90._id, carSnapshot: { name: cSF90.name, brand: 'Ferrari', model: cSF90.model, year: cSF90.year, image: cSF90.images[0].url, price: 34500000000 }, depositAmount: 6900000000, totalAmount: 34500000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Biệt thự Thảo Điền, Q.2', notes: 'Hợp đồng cọc Tháng 1', createdAt: new Date('2026-01-12T10:00:00') },
    { orderNumber: 'LM-2026-0102', user: vipThuy._id, car: cGT3RS._id, carSnapshot: { name: cGT3RS.name, brand: 'Porsche', model: cGT3RS.model, year: cGT3RS.year, image: cGT3RS.images[0].url, price: 21500000000 }, depositAmount: 4300000000, totalAmount: 21500000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Vinhomes Central Park', notes: 'Hợp đồng cọc Tháng 1', createdAt: new Date('2026-01-20T14:30:00') },
    { orderNumber: 'LM-2026-0103', user: vipNam._id, car: cContinental._id, carSnapshot: { name: cContinental.name, brand: 'Bentley', model: cContinental.model, year: cContinental.year, image: cContinental.images[0].url, price: 22000000000 }, depositAmount: 4400000000, totalAmount: 22000000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Sala Q.2', notes: 'Hợp đồng cọc Tháng 1', createdAt: new Date('2026-01-27T16:00:00') },

    // --- THÁNG 2 (90.4 Tỷ) ---
    { orderNumber: 'LM-2026-0201', user: vipNam._id, car: c750S._id, carSnapshot: { name: c750S.name, brand: 'McLaren', model: c750S.model, year: c750S.year, image: c750S.images[0].url, price: 24800000000 }, depositAmount: 4960000000, totalAmount: 24800000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Sala Q.2', notes: 'Hợp đồng cọc Tháng 2', createdAt: new Date('2026-02-05T11:15:00') },
    { orderNumber: 'LM-2026-0202', user: vipHoang._id, car: cContinental._id, carSnapshot: { name: cContinental.name, brand: 'Bentley', model: cContinental.model, year: cContinental.year, image: cContinental.images[0].url, price: 22000000000 }, depositAmount: 4400000000, totalAmount: 22000000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Phú Mỹ Hưng Q.7', notes: 'Hợp đồng cọc Tháng 2', createdAt: new Date('2026-02-14T15:00:00') },
    { orderNumber: 'LM-2026-0203', user: vipCuong._id, car: cRevuelto._id, carSnapshot: { name: cRevuelto.name, brand: 'Lamborghini', model: cRevuelto.model, year: cRevuelto.year, image: cRevuelto.images[0].url, price: 43600000000 }, depositAmount: 8720000000, totalAmount: 43600000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Ciputra Hà Nội', notes: 'Hợp đồng cọc Tháng 2', createdAt: new Date('2026-02-23T10:30:00') },

    // --- THÁNG 3 (132.1 Tỷ) ---
    { orderNumber: 'LM-2026-0301', user: vipKhang._id, car: cRevuelto._id, carSnapshot: { name: cRevuelto.name, brand: 'Lamborghini', model: cRevuelto.model, year: cRevuelto.year, image: cRevuelto.images[0].url, price: 43600000000 }, depositAmount: 8720000000, totalAmount: 43600000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Thảo Điền Q.2', notes: 'Hợp đồng cọc Tháng 3', createdAt: new Date('2026-03-04T09:45:00') },
    { orderNumber: 'LM-2026-0302', user: vipCuong._id, car: cPhantom._id, carSnapshot: { name: cPhantom.name, brand: 'Rolls-Royce', model: cPhantom.model, year: cPhantom.year, image: cPhantom.images[0].url, price: 54000000000 }, depositAmount: 10800000000, totalAmount: 54000000000, paymentMethod: 'installment', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Kim Long Q.7', notes: 'Hợp đồng cọc Tháng 3', createdAt: new Date('2026-03-15T15:20:00') },
    { orderNumber: 'LM-2026-0303', user: vipHoang._id, car: cSF90._id, carSnapshot: { name: cSF90.name, brand: 'Ferrari', model: cSF90.model, year: cSF90.year, image: cSF90.images[0].url, price: 34500000000 }, depositAmount: 6900000000, totalAmount: 34500000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Vinhomes Golden River', notes: 'Hợp đồng cọc Tháng 3', createdAt: new Date('2026-03-25T11:00:00') },

    // --- THÁNG 4 (125.3 Tỷ) ---
    { orderNumber: 'LM-2026-0401', user: vipThuy._id, car: cValkyrie._id, carSnapshot: { name: cValkyrie.name, brand: 'Aston Martin', model: cValkyrie.model, year: cValkyrie.year, image: cValkyrie.images[0].url, price: 79000000000 }, depositAmount: 15800000000, totalAmount: 79000000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Chateau Phú Mỹ Hưng', notes: 'Hợp đồng cọc Tháng 4', createdAt: new Date('2026-04-03T10:30:00') },
    { orderNumber: 'LM-2026-0402', user: vipNam._id, car: cGT3RS._id, carSnapshot: { name: cGT3RS.name, brand: 'Porsche', model: cGT3RS.model, year: cGT3RS.year, image: cGT3RS.images[0].url, price: 21500000000 }, depositAmount: 4300000000, totalAmount: 21500000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Q.1 TP.HCM', notes: 'Hợp đồng cọc Tháng 4', createdAt: new Date('2026-04-14T13:40:00') },
    { orderNumber: 'LM-2026-0403', user: vipHoang._id, car: c750S._id, carSnapshot: { name: c750S.name, brand: 'McLaren', model: c750S.model, year: c750S.year, image: c750S.images[0].url, price: 24800000000 }, depositAmount: 4960000000, totalAmount: 24800000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Riviera Cove Q.9', notes: 'Hợp đồng cọc Tháng 4', createdAt: new Date('2026-04-26T16:15:00') },

    // --- THÁNG 5 (148.5 Tỷ) ---
    { orderNumber: 'LM-2026-0501', user: vipHoang._id, car: cSF90._id, carSnapshot: { name: cSF90.name, brand: 'Ferrari', model: cSF90.model, year: cSF90.year, image: cSF90.images[0].url, price: 34500000000 }, depositAmount: 6900000000, totalAmount: 34500000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Holm Villas Thảo Điền', notes: 'Hợp đồng cọc Tháng 5', createdAt: new Date('2026-05-06T11:00:00') },
    { orderNumber: 'LM-2026-0502', user: vipCuong._id, car: cContinental._id, carSnapshot: { name: cContinental.name, brand: 'Bentley', model: cContinental.model, year: cContinental.year, image: cContinental.images[0].url, price: 22000000000 }, depositAmount: 4400000000, totalAmount: 22000000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Vinhomes Golden River', notes: 'Hợp đồng cọc Tháng 5', createdAt: new Date('2026-05-17T14:15:00') },
    { orderNumber: 'LM-2026-0503', user: vipKhang._id, car: cChiron._id, carSnapshot: { name: cChiron.name, brand: 'Bugatti', model: cChiron.model, year: cChiron.year, image: cChiron.images[0].url, price: 92000000000 }, depositAmount: 18400000000, totalAmount: 92000000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Thảo Điền Q.2', notes: 'Hợp đồng cọc Tháng 5', createdAt: new Date('2026-05-28T09:30:00') },

    // --- THÁNG 6 (182.6 Tỷ) ---
    { orderNumber: 'LM-2026-0601', user: vipKhang._id, car: cRevuelto._id, carSnapshot: { name: cRevuelto.name, brand: 'Lamborghini', model: cRevuelto.model, year: cRevuelto.year, image: cRevuelto.images[0].url, price: 43600000000 }, depositAmount: 8720000000, totalAmount: 43600000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Q.2 TP.HCM', notes: 'Hợp đồng cọc Tháng 6', createdAt: new Date('2026-06-03T10:20:00') },
    { orderNumber: 'LM-2026-0602', user: vipThuy._id, car: cPhantom._id, carSnapshot: { name: cPhantom.name, brand: 'Rolls-Royce', model: cPhantom.model, year: cPhantom.year, image: cPhantom.images[0].url, price: 54000000000 }, depositAmount: 10800000000, totalAmount: 54000000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Phú Mỹ Hưng Q.7', notes: 'Hợp đồng cọc Tháng 6', createdAt: new Date('2026-06-15T15:45:00') },
    { orderNumber: 'LM-2026-0603', user: vipNam._id, car: cJesko._id, carSnapshot: { name: cJesko.name, brand: 'Koenigsegg', model: cJesko.model, year: cJesko.year, image: cJesko.images[0].url, price: 85000000000 }, depositAmount: 17000000000, totalAmount: 85000000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Riviera An Phú', notes: 'Hợp đồng cọc Tháng 6', createdAt: new Date('2026-06-25T11:00:00') },

    // --- THÁNG 7 (252 Tỷ) ---
    { orderNumber: 'LM-2026-0701', user: vipNam._id, car: cJesko._id, carSnapshot: { name: cJesko.name, brand: 'Koenigsegg', model: cJesko.model, year: cJesko.year, image: cJesko.images[0].url, price: 85000000000 }, depositAmount: 17000000000, totalAmount: 85000000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Riviera An Phú', notes: 'Hợp đồng cọc Tháng 7', createdAt: new Date('2026-07-04T09:15:00') },
    { orderNumber: 'LM-2026-0702', user: vipHoang._id, car: cHuayra._id, carSnapshot: { name: cHuayra.name, brand: 'Pagani', model: cHuayra.model, year: cHuayra.year, image: cHuayra.images[0].url, price: 88000000000 }, depositAmount: 17600000000, totalAmount: 88000000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Sunwah Pearl', notes: 'Hợp đồng cọc Tháng 7', createdAt: new Date('2026-07-16T14:00:00') },
    { orderNumber: 'LM-2026-0703', user: vipThuy._id, car: cValkyrie._id, carSnapshot: { name: cValkyrie.name, brand: 'Aston Martin', model: cValkyrie.model, year: cValkyrie.year, image: cValkyrie.images[0].url, price: 79000000000 }, depositAmount: 15800000000, totalAmount: 79000000000, paymentMethod: 'bank_transfer', paymentStatus: 'fully_paid', orderStatus: 'completed', deliveryAddress: 'Chateau Phú Mỹ Hưng', notes: 'Hợp đồng cọc Tháng 7', createdAt: new Date('2026-07-28T16:30:00') },

    // --- THÁNG 8 (HIỆN TẠI: 172.8 Tỷ) ---
    { orderNumber: 'LM-2026-0801', user: vipKhang._id, car: cChiron._id, carSnapshot: { name: cChiron.name, brand: 'Bugatti', model: cChiron.model, year: cChiron.year, image: cChiron.images[0].url, price: 92000000000 }, depositAmount: 18400000000, totalAmount: 92000000000, paymentMethod: 'bank_transfer', paymentStatus: 'deposit_paid', orderStatus: 'processing', deliveryAddress: 'Thảo Điền Q.2', notes: 'Hợp đồng cọc Tháng 8', createdAt: new Date('2026-08-01T10:00:00') },
    { orderNumber: 'LM-2026-0802', user: vipCuong._id, car: c750S._id, carSnapshot: { name: c750S.name, brand: 'McLaren', model: c750S.model, year: c750S.year, image: c750S.images[0].url, price: 24800000000 }, depositAmount: 4960000000, totalAmount: 24800000000, paymentMethod: 'bank_transfer', paymentStatus: 'deposit_paid', orderStatus: 'processing', deliveryAddress: 'Vinhomes Central Park', notes: 'Hợp đồng cọc Tháng 8', createdAt: new Date('2026-08-04T15:30:00') },
    { orderNumber: 'LM-2026-0803', user: vipHoang._id, car: cSF90._id, carSnapshot: { name: cSF90.name, brand: 'Ferrari', model: cSF90.model, year: cSF90.year, image: cSF90.images[0].url, price: 34500000000 }, depositAmount: 6900000000, totalAmount: 34500000000, paymentMethod: 'bank_transfer', paymentStatus: 'deposit_paid', orderStatus: 'confirmed', deliveryAddress: 'Holm Villas', notes: 'Hợp đồng cọc Tháng 8', createdAt: new Date('2026-08-07T11:20:00') },
    { orderNumber: 'LM-2026-0804', user: vipThuy._id, car: cGT3RS._id, carSnapshot: { name: cGT3RS.name, brand: 'Porsche', model: cGT3RS.model, year: cGT3RS.year, image: cGT3RS.images[0].url, price: 21500000000 }, depositAmount: 4300000000, totalAmount: 21500000000, paymentMethod: 'bank_transfer', paymentStatus: 'pending', orderStatus: 'pending', deliveryAddress: 'Vinhomes Central Park', notes: 'Hợp đồng cọc Tháng 8', createdAt: new Date('2026-08-09T14:40:00') },
  ];

  const orders = await Order.create(ordersData);

  // Cập nhật native createdAt cho Đơn hàng để ghi đè Mongoose timestamps
  for (let i = 0; i < orders.length; i++) {
    if (ordersData[i]?.createdAt) {
      await Order.collection.updateOne(
        { _id: orders[i]._id },
        { $set: { createdAt: ordersData[i].createdAt } }
      );
    }
  }

  // 6. CONTACT LEADS (16 Yêu Cầu Liên Hệ Rải Đều 8 Tháng: 2 Contact Mỗi Tháng)
  const contactsData = [
    // Tháng 1
    { name: 'Võ Minh Khang', email: 'khachvip@gmail.com', phone: '0966778899', subject: 'Tư vấn siêu xe Ferrari SF90', message: 'Tôi quan tâm đến mẫu Ferrari SF90 Stradale.', interest: 'Tư vấn mua xe', status: 'closed', createdAt: new Date('2026-01-08') },
    { name: 'Phan Quốc Việt', email: 'viet.phan@gmail.com', phone: '0988112233', subject: 'Hỏi báo giá Porsche GT3 RS', message: 'Cần xin bảng tùy chọn Weissach Package.', interest: 'Tùy biến cá nhân', status: 'closed', createdAt: new Date('2026-01-22') },

    // Tháng 2
    { name: 'Trần Thị Thu Thủy', email: 'thuy.tran@gmail.com', phone: '0911223344', subject: 'Đăng ký Concierge giao xe', message: 'Tôi muốn trải nghiệm lái thử Porsche GT3 RS.', interest: 'Lái thử tận nhà', status: 'closed', createdAt: new Date('2026-02-04') },
    { name: 'Đỗ Minh Tuấn', email: 'tuan.do@gmail.com', phone: '0977223344', subject: 'Hỏi thủ tục mua xe đứng tên công ty', message: 'Cần xuất hóa đơn VAT siêu xe Bentley.', interest: 'Thủ tục pháp lý', status: 'closed', createdAt: new Date('2026-02-18') },

    // Tháng 3
    { name: 'Lê Hoàng Nam', email: 'nam.le@gmail.com', phone: '0922334455', subject: 'Hỏi báo giá Rolls-Royce Phantom VIII', message: 'Cho tôi hỏi thời gian tùy biến Bespoke Rolls-Royce.', interest: 'Bespoke cá nhân hóa', status: 'closed', createdAt: new Date('2026-03-06') },
    { name: 'Nguyễn Tiến Dũng', email: 'dung.nguyen@gmail.com', phone: '0966334455', subject: 'Yêu cầu tư vấn bảo hiểm siêu xe', message: 'Gói bảo hiểm vật chất xe 50 tỷ.', interest: 'Dịch vụ bảo hiểm', status: 'closed', createdAt: new Date('2026-03-21') },

    // Tháng 4
    { name: 'Phạm Đức Hoàng', email: 'hoang.pham@gmail.com', phone: '0933445566', subject: 'Yêu cầu tư vấn trả góp 70%', message: 'Tư vấn hạn mức vay mua siêu xe Aston Martin.', interest: 'Trả góp ngân hàng', status: 'closed', createdAt: new Date('2026-04-05') },
    { name: 'Hà Văn Nam', email: 'nam.ha@gmail.com', phone: '0955445566', subject: 'Đăng ký tham gia Supercar Trackday', message: 'Cho tôi tham gia giải đua trải nghiệm.', interest: 'Sự kiện CLB', status: 'closed', createdAt: new Date('2026-04-19') },

    // Tháng 5
    { name: 'Đặng Quốc Cường', email: 'cuong.dang@gmail.com', phone: '0944556677', subject: 'Đăng ký nhận thông tin Bugatti Chiron', message: 'Gửi cho tôi thông số Bugatti Chiron.', interest: 'Thông tin xe', status: 'closed', createdAt: new Date('2026-05-09') },
    { name: 'Dương Văn Hải', email: 'hai.duong@gmail.com', phone: '0944112233', subject: 'Hỏi mua bộ vành mạ vàng 24K', message: 'Tư vấn phụ kiện độ xe Pagani.', interest: 'Phụ kiện cao cấp', status: 'closed', createdAt: new Date('2026-05-23') },

    // Tháng 6
    { name: 'Nguyễn Thanh Tùng', email: 'tung.nguyen@gmail.com', phone: '0955667788', subject: 'Hỏi thủ tục mua xe công ty', message: 'Tư vấn thủ tục VAT siêu xe McLaren đứng tên công ty.', interest: 'Thủ tục pháp lý', status: 'closed', createdAt: new Date('2026-06-07') },
    { name: 'Trương Mỹ Linh', email: 'linh.truong@gmail.com', phone: '0933778899', subject: 'Đăng ký tham quan Showroom VIP', message: 'Tôi muốn tham quan dàn siêu xe độc bản.', interest: 'Tham quan Showroom', status: 'closed', createdAt: new Date('2026-06-20') },

    // Tháng 7
    { name: 'Bùi Hoài Nam', email: 'nam.bui@gmail.com', phone: '0966889900', subject: 'Đặt lịch bảo dưỡng siêu xe Bentley', message: 'Đặt lịch bảo dưỡng Bentley tại nhà Tháng 7.', interest: 'Hậu mãi bảo dưỡng', status: 'contacted', createdAt: new Date('2026-07-08') },
    { name: 'Vũ Đức Thành', email: 'thanh.vu@gmail.com', phone: '0922889900', subject: 'Tư vấn đổi siêu xe cũ lấy siêu xe mới', message: 'Chương trình Trade-in siêu xe.', interest: 'Thu cũ đổi mới', status: 'contacted', createdAt: new Date('2026-07-24') },

    // Tháng 8 (Hiện tại)
    { name: 'Lê Mai Anh', email: 'anh.mai@gmail.com', phone: '0977990011', subject: 'Hỏi chương trình ưu đãi Giám đốc', message: 'Cho tôi xin chiết khấu Aston Martin Valkyrie.', interest: 'Ưu đãi giá', status: 'new', createdAt: new Date('2026-08-02') },
    { name: 'Trịnh Quốc Hùng', email: 'hung.trinh@gmail.com', phone: '0988001122', subject: 'Đăng ký tham gia Supercar Rally 2026', message: 'Đăng ký câu lạc bộ chủ xe Luxe Motors.', interest: 'Sự kiện CLB', status: 'new', createdAt: new Date('2026-08-06') },
  ];

  const contacts = await Contact.create(contactsData);

  // Cập nhật native createdAt cho Contact Leads
  for (let i = 0; i < contacts.length; i++) {
    if (contactsData[i]?.createdAt) {
      await Contact.collection.updateOne(
        { _id: contacts[i]._id },
        { $set: { createdAt: contactsData[i].createdAt } }
      );
    }
  }

  console.log('✅ Đã nạp thành công 25 đơn hàng, 16 lịch hẹn, 16 contact leads rải đều 8 tháng!');
  return { usersCount: users.length, carsCount: cars.length, ordersCount: orders.length, appointmentsCount: appointments.length, contactsCount: contacts.length };
};

module.exports = { seedFullData };
