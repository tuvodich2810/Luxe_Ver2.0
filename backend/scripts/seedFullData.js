const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');

const User = require('../models/User');
const Brand = require('../models/Brand');
const Car = require('../models/Car');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const Favorite = require('../models/Favorite');

async function seedDatabase() {
  try {
    console.log('🔄 Đang kết nối tới MongoDB để nạp đồng bộ 10 DỮ LIỆU TỪNG DANH MỤC...');
    await connectDB();
    console.log('✅ Đã kết nối MongoDB Atlas thành công!');

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
    console.log('🧹 Đã dọn dẹp dữ liệu cũ!');

    // -------------------------------------------------------------
    // 1. DỮ LIỆU 10 TÀI KHOẢN NGƯỜI DÙNG (USERS)
    // -------------------------------------------------------------
    const users = await User.create([
      {
        fullName: 'Luxe Motors Admin',
        email: 'admin@luxemotors.com',
        password: '123456',
        phone: '0901234567',
        role: 'admin',
      },
      {
        fullName: 'Nguyễn Văn Minh (Giám Đốc Exec)',
        email: 'minh.nguyen@gmail.com',
        password: '123456',
        phone: '0918889999',
        role: 'giam_doc',
      },
      {
        fullName: 'Trần Văn Quản Lý (Showroom Manager)',
        email: 'quanly@luxemotors.com',
        password: '123456',
        phone: '0933456789',
        role: 'quan_ly',
      },
      {
        fullName: 'Trần Văn Sales (Sales Executive)',
        email: 'sales@luxemotors.com',
        password: '123456',
        phone: '0977112233',
        role: 'sales',
      },
      {
        fullName: 'Phạm Thị CSKH (Customer Service)',
        email: 'cskh@luxemotors.com',
        password: '123456',
        phone: '0988554433',
        role: 'cskh',
      },
      {
        fullName: 'Võ Minh Khang (Khách VIP)',
        email: 'khachvip@gmail.com',
        password: '123456',
        phone: '0966778899',
        role: 'user',
      },
      {
        fullName: 'Trần Thị Thu Thủy (Khách VIP)',
        email: 'thuy.tran@gmail.com',
        password: '123456',
        phone: '0911223344',
        role: 'user',
      },
      {
        fullName: 'Lê Hoàng Nam (Khách Doanh Nhân)',
        email: 'nam.le@gmail.com',
        password: '123456',
        phone: '0922334455',
        role: 'user',
      },
      {
        fullName: 'Phạm Đức Hoàng (Chủ Tập Đoàn)',
        email: 'hoang.pham@gmail.com',
        password: '123456',
        phone: '0933445566',
        role: 'user',
      },
      {
        fullName: 'Đặng Quốc Cường (Khách Thượng Lưu)',
        email: 'cuong.dang@gmail.com',
        password: '123456',
        phone: '0944556677',
        role: 'user',
      },
    ]);
    console.log(`✅ [1/6] Đã nạp thành công ${users.length} Tài Khoản Người Dùng (Tất cả Mật khẩu: 123456)!`);

    const [adminU, directorU, managerU, salesU, cskhU, vipKhang, vipThuy, vipNam, vipHoang, vipCuong] = users;

    // -------------------------------------------------------------
    // 2. DỮ LIỆU 10 THƯƠNG HIỆU SIÊU XE (BRANDS)
    // -------------------------------------------------------------
    const brands = await Brand.create([
      { name: 'Ferrari', country: 'Italy', establishedYear: 1939, website: 'https://www.ferrari.com', description: 'Biểu tượng siêu xe tốc độ truyền thống từ nước Ý.' },
      { name: 'Lamborghini', country: 'Italy', establishedYear: 1963, website: 'https://www.lamborghini.com', description: 'Hãng siêu xe thiết kế góc cạnh bứt phá giới hạn.' },
      { name: 'Porsche', country: 'Germany', establishedYear: 1931, website: 'https://www.porsche.com', description: 'Đỉnh cao kỹ nghệ cơ khí Đức với huyền thoại 911.' },
      { name: 'Rolls-Royce', country: 'United Kingdom', establishedYear: 1904, website: 'https://www.rolls-roycemotorcars.com', description: 'Đỉnh cao xa xỉ quý tộc Anh Quốc.' },
      { name: 'McLaren', country: 'United Kingdom', establishedYear: 1963, website: 'https://cars.mclaren.com', description: 'Công nghệ đua F1 ứng dụng siêu xe đường phố.' },
      { name: 'Bentley', country: 'United Kingdom', establishedYear: 1919, website: 'https://www.bentleymotors.com', description: 'Sự kết hợp hoàn hảo giữa hiệu năng và thủ công.' },
      { name: 'Aston Martin', country: 'United Kingdom', establishedYear: 1913, website: 'https://www.astonmartin.com', description: 'Biểu tượng phong cách điệp viên 007 sang trọng.' },
      { name: 'Bugatti', country: 'France', establishedYear: 1909, website: 'https://www.bugatti.com', description: 'Đỉnh cao tốc độ Hypercar vĩ đại nhất thế giới.' },
      { name: 'Koenigsegg', country: 'Sweden', establishedYear: 1994, website: 'https://www.koenigsegg.com', description: 'Công nghệ đột phá cơ khí Bắc Âu.' },
      { name: 'Pagani', country: 'Italy', establishedYear: 1992, website: 'https://www.pagani.com', description: 'Tác phẩm nghệ thuật cơ khí thủ công độc bản.' },
    ]);
    console.log(`✅ [2/6] Đã nạp thành công ${brands.length} Thương Hiệu Siêu Xe!`);

    const [bFerrari, bLambo, bPorsche, bRR, bMcLaren, bBentley, bAston, bBugatti, bKoenig, bPagani] = brands;

    // -------------------------------------------------------------
    // 3. DỮ LIỆU 10 SIÊU XE CAO CẤP TRONG KHO (CARS)
    // -------------------------------------------------------------
    const cars = await Car.create([
      {
        name: 'Ferrari SF90 Stradale Assetto Fiorano',
        brand: bFerrari._id,
        model: 'SF90 Stradale',
        year: 2026,
        category: 'hypercar',
        condition: 'new',
        price: 34500000000, // 34.5 Tỷ
        salePrice: 33200000000,
        color: 'Rosso Corsa (Đỏ Ferrari)',
        interior: 'Da Nero đen khâu chỉ đỏ',
        excerpt: 'Siêu xe Plug-in Hybrid mạnh 1.000 mã lực đầu tiên của Ferrari.',
        description: 'Ferrari SF90 Stradale sở hữu động cơ V8 Twin-Turbo kết hợp 3 mô-tơ điện cho gia tốc thần tốc.',
        inStock: true,
        stockCount: 2,
        isFeatured: true,
        isPublished: true,
        images: [{ url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200', isMain: true, alt: 'Ferrari SF90' }],
        specifications: { engine: '4.0L V8 Twin-Turbo Hybrid', horsepower: 1000, torque: 800, transmission: '8-Speed Dual Clutch F1', acceleration: 2.5, topSpeed: 340, fuelType: 'Hybrid', seats: 2 },
      },
      {
        name: 'Lamborghini Revuelto V12 Hybrid',
        brand: bLambo._id,
        model: 'Revuelto',
        year: 2026,
        category: 'hypercar',
        condition: 'new',
        price: 43800000000, // 43.8 Tỷ
        salePrice: 42000000000,
        color: 'Arancia Apodis (Cam Nhám)',
        interior: 'Alcantara Nero Ade',
        excerpt: 'Siêu phẩm V12 HPEV đầu tiên với 1.015 mã lực.',
        description: 'Revuelto đại diện cho thiết kế bứt phá của Lamborghini với hệ gầm carbon Monofuselage siêu nhẹ.',
        inStock: true,
        stockCount: 1,
        isFeatured: true,
        isPublished: true,
        images: [{ url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1200', isMain: true, alt: 'Lamborghini Revuelto' }],
        specifications: { engine: '6.5L V12 Naturally Aspirated Hybrid', horsepower: 1015, torque: 725, transmission: '8-Speed Dual Clutch', acceleration: 2.5, topSpeed: 350, fuelType: 'Hybrid', seats: 2 },
      },
      {
        name: 'Porsche 911 GT3 RS Weissach Package',
        brand: bPorsche._id,
        model: '911 GT3 RS',
        year: 2026,
        category: 'supercar',
        condition: 'new',
        price: 21500000000, // 21.5 Tỷ
        color: 'Ice Grey Metallic',
        interior: 'Da thuộc Race-Tex Đen',
        excerpt: 'Mãnh thú đường đua được cấp phép lăn bánh đường phố.',
        description: 'Trang bị gói nâng cấp Weissach Package siêu nhẹ với cánh gió khí động học chủ động DRS độc quyền.',
        inStock: true,
        stockCount: 3,
        isFeatured: true,
        isPublished: true,
        images: [{ url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200', isMain: true, alt: 'Porsche 911 GT3 RS' }],
        specifications: { engine: '4.0L Flat-6 Hút Khí Tự Nhiên', horsepower: 525, torque: 465, transmission: '7-Speed PDK', acceleration: 3.2, topSpeed: 296, fuelType: 'Xăng', seats: 2 },
      },
      {
        name: 'Rolls-Royce Phantom VIII Extended Edition',
        brand: bRR._id,
        model: 'Phantom',
        year: 2026,
        category: 'luxury_sedan',
        condition: 'new',
        price: 54000000000, // 54 Tỷ
        color: 'Diamond Black / Silver Two-Tone',
        interior: 'Da Bê Thượng Hạng Trắng Băng Tuyết',
        excerpt: 'Đỉnh cao xa xỉ tuyệt đối dành cho giới lãnh đạo toàn cầu.',
        description: 'Rolls-Royce Phantom VIII với khoang sau Privacy Suite, trần sao bầu trời đêm Starlight Headliner thượng hạng.',
        inStock: true,
        stockCount: 1,
        isFeatured: true,
        isPublished: true,
        images: [{ url: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=1200', isMain: true, alt: 'Rolls-Royce Phantom' }],
        specifications: { engine: '6.75L V12 Twin-Turbo', horsepower: 563, torque: 900, transmission: '8-Speed SAT', acceleration: 5.4, topSpeed: 250, fuelType: 'Xăng', seats: 4 },
      },
      {
        name: 'McLaren 750S Spider Carbon Edition',
        brand: bMcLaren._id,
        model: '750S Spider',
        year: 2026,
        category: 'convertible',
        condition: 'new',
        price: 24800000000, // 24.8 Tỷ
        salePrice: 23500000000,
        color: 'Azura Blue (Xanh Ngọc)',
        interior: 'Da Nappa Carbon Black',
        excerpt: 'Siêu xe mui xếp cứng với cảm giác lái phấn khích tột cùng.',
        description: 'McLaren 750S Spider mang cấu trúc khung gầm sợi carbon Monocage II-S cứng vững đỉnh cao.',
        inStock: true,
        stockCount: 2,
        isFeatured: false,
        isPublished: true,
        images: [{ url: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1200', isMain: true, alt: 'McLaren 750S' }],
        specifications: { engine: '4.0L V8 Twin-Turbo', horsepower: 750, torque: 800, transmission: '7-Speed SSG', acceleration: 2.8, topSpeed: 332, fuelType: 'Xăng', seats: 2 },
      },
      {
        name: 'Bentley Continental GT Speed W12',
        brand: bBentley._id,
        model: 'Continental GT',
        year: 2026,
        category: 'grand_tourer',
        condition: 'new',
        price: 22000000000, // 22 Tỷ
        color: 'Verdant Green (Xanh Lục Bảo)',
        interior: 'Da Cammello Nâu Bò Cổ Điển',
        excerpt: 'Chuyển động sang trọng tốc độ đỉnh cao của quý tộc Anh.',
        description: 'Trang bị động cơ W12 6.0L biểu tượng cùng hệ thống treo khí nén 3 buồng tối tân.',
        inStock: true,
        stockCount: 2,
        isFeatured: false,
        isPublished: true,
        images: [{ url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200', isMain: true, alt: 'Bentley Continental GT' }],
        specifications: { engine: '6.0L W12 Twin-Turbo', horsepower: 659, torque: 900, transmission: '8-Speed Dual Clutch', acceleration: 3.5, topSpeed: 335, fuelType: 'Xăng', seats: 4 },
      },
      {
        name: 'Aston Martin Valkyrie Hypercar',
        brand: bAston._id,
        model: 'Valkyrie',
        year: 2026,
        category: 'hypercar',
        condition: 'new',
        price: 79000000000, // 79 Tỷ
        color: 'British Racing Green',
        interior: 'Sợi Carbon Đua Chuyên Dụng',
        excerpt: 'Siêu xe Công nghệ F1 hợp tác cùng Red Bull Racing.',
        description: 'Động cơ V12 6.5L quay đến 11.100 vòng/phút phát ra âm thanh gầm rú F1 thuần khiết.',
        inStock: true,
        stockCount: 1,
        isFeatured: true,
        isPublished: true,
        images: [{ url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200', isMain: true, alt: 'Aston Martin Valkyrie' }],
        specifications: { engine: '6.5L V12 Naturally Aspirated Hybrid', horsepower: 1160, torque: 900, transmission: '7-Speed Single-Clutch Automated', acceleration: 2.5, topSpeed: 355, fuelType: 'Hybrid', seats: 2 },
      },
      {
        name: 'Bugatti Chiron Super Sport 300+',
        brand: bBugatti._id,
        model: 'Chiron',
        year: 2026,
        category: 'hypercar',
        condition: 'new',
        price: 92000000000, // 92 Tỷ
        color: 'Nocturne Black & Jet Orange',
        interior: 'Da Beluga Black & Cam Racing',
        excerpt: 'Huyền thoại Hypercar vượt mốc 300 dặm/giờ vĩ đại nhất lịch sử.',
        description: 'Trang bị động cơ W16 8.0L Quad-Turbo 1.600 mã lực vô địch tốc độ thế giới.',
        inStock: true,
        stockCount: 1,
        isFeatured: true,
        isPublished: true,
        images: [{ url: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&q=80&w=1200', isMain: true, alt: 'Bugatti Chiron' }],
        specifications: { engine: '8.0L W16 Quad-Turbo', horsepower: 1600, torque: 1600, transmission: '7-Speed Dual Clutch DSG', acceleration: 2.4, topSpeed: 440, fuelType: 'Xăng', seats: 2 },
      },
      {
        name: 'Koenigsegg Jesko Attack Track Edition',
        brand: bKoenig._id,
        model: 'Jesko',
        year: 2026,
        category: 'hypercar',
        condition: 'new',
        price: 85000000000, // 85 Tỷ
        color: 'Tang Orange Pearl Carbon',
        interior: 'Alcantara Deserter Green',
        excerpt: 'Hộp số 9 cấp Light Speed Transmission LST nhanh nhất thế giới.',
        description: 'Tạo lực ép khí động học downforce lên đến 1.400 kg cho khả năng ôm cua vô đối.',
        inStock: true,
        stockCount: 1,
        isFeatured: true,
        isPublished: true,
        images: [{ url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200', isMain: true, alt: 'Koenigsegg Jesko' }],
        specifications: { engine: '5.0L V8 Twin-Turbo E85', horsepower: 1600, torque: 1500, transmission: '9-Speed LST', acceleration: 2.5, topSpeed: 480, fuelType: 'Xăng/E85', seats: 2 },
      },
      {
        name: 'Pagani Huayra Roadster BC Bespoke',
        brand: bPagani._id,
        model: 'Huayra',
        year: 2026,
        category: 'hypercar',
        condition: 'new',
        price: 88000000000, // 88 Tỷ
        color: 'Carbo-Triax Blue Carbon',
        interior: 'Da Bò Ý Khâu Thủ Công Bạc',
        excerpt: 'Kiệt tác cơ khí thủ công đỉnh cao từ Modena nước Ý.',
        description: 'Trang bị động cơ AMG V12 6.0L Twin-Turbo phát triển riêng cho Pagani.',
        inStock: true,
        stockCount: 1,
        isFeatured: true,
        isPublished: true,
        images: [{ url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200', isMain: true, alt: 'Pagani Huayra' }],
        specifications: { engine: '6.0L AMG V12 Twin-Turbo', horsepower: 800, torque: 1050, transmission: '7-Speed Xtrac Transverse Automated', acceleration: 2.7, topSpeed: 383, fuelType: 'Xăng', seats: 2 },
      },
    ]);
    console.log(`✅ [3/6] Đã nạp thành công ${cars.length} Siêu Xe Độc Bản vào Kho MongoDB Atlas!`);

    const [cSF90, cRevuelto, cGT3RS, cPhantom, c750S, cContinental, cValkyrie, cChiron, cJesko, cHuayra] = cars;

    // -------------------------------------------------------------
    // 4. DỮ LIỆU 10 LỊCH HẸN CONCIERGE & LÁI THỬ (APPOINTMENTS)
    // -------------------------------------------------------------
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const day2 = new Date(); day2.setDate(day2.getDate() + 2);
    const day3 = new Date(); day3.setDate(day3.getDate() + 3);
    const day4 = new Date(); day4.setDate(day4.getDate() + 4);
    const day5 = new Date(); day5.setDate(day5.getDate() + 5);

    const appointments = await Appointment.create([
      { user: vipKhang._id, car: cSF90._id, appointmentDate: tomorrow, timeSlot: '10:00', visitorName: 'Võ Minh Khang', visitorPhone: '0966778899', visitorEmail: 'khachvip@gmail.com', notes: 'Trải nghiệm chạy thử Ferrari SF90 Stradale tại Showroom VIP Lounge.', status: 'confirmed', adminNotes: 'Sales Executive chuẩn bị xe.' },
      { user: vipThuy._id, car: cRevuelto._id, appointmentDate: day2, timeSlot: '14:00', visitorName: 'Trần Thị Thu Thủy', visitorPhone: '0911223344', visitorEmail: 'thuy.tran@gmail.com', notes: 'Yêu cầu giao xe Revuelto tận nhà trải nghiệm biệt thự Q.2.', status: 'pending' },
      { user: vipNam._id, car: cGT3RS._id, appointmentDate: day3, timeSlot: '09:30', visitorName: 'Lê Hoàng Nam', visitorPhone: '0922334455', visitorEmail: 'nam.le@gmail.com', notes: 'Tư vấn chi tiết gói đường đua Weissach Package.', status: 'confirmed', adminNotes: 'CSKH đã xác nhận lịch.' },
      { user: vipHoang._id, car: cPhantom._id, appointmentDate: day4, timeSlot: '15:00', visitorName: 'Phạm Đức Hoàng', visitorPhone: '0933445566', visitorEmail: 'hoang.pham@gmail.com', notes: 'Trải nghiệm khoang ông chủ Privacy Suite Rolls-Royce Phantom.', status: 'confirmed', adminNotes: 'Phòng VIP lounge chuẩn bị rượu vang.' },
      { user: vipCuong._id, car: cChiron._id, appointmentDate: day5, timeSlot: '16:00', visitorName: 'Đặng Quốc Cường', visitorPhone: '0944556677', visitorEmail: 'cuong.dang@gmail.com', notes: 'Đăng ký tư vấn nhập khẩu siêu xe Bugatti Chiron Super Sport 300+.', status: 'pending' },
      { user: vipKhang._id, car: cValkyrie._id, appointmentDate: day2, timeSlot: '11:00', visitorName: 'Võ Minh Khang', visitorPhone: '0966778899', visitorEmail: 'khachvip@gmail.com', notes: 'Xem trực tiếp thiết kế khí động học F1 Aston Martin Valkyrie.', status: 'completed', adminNotes: 'Đón tiếp thành công.' },
      { user: vipThuy._id, car: c750S._id, appointmentDate: day3, timeSlot: '15:30', visitorName: 'Trần Thị Thu Thủy', visitorPhone: '0911223344', visitorEmail: 'thuy.tran@gmail.com', notes: 'Thử cảm giác mui xếp mở McLaren 750S Spider.', status: 'confirmed' },
      { user: vipNam._id, car: cContinental._id, appointmentDate: day4, timeSlot: '10:30', visitorName: 'Lê Hoàng Nam', visitorPhone: '0922334455', visitorEmail: 'nam.le@gmail.com', notes: 'Tư vấn cá nhân hóa màu sơn xanh Lục Bảo Bentley.', status: 'pending' },
      { user: vipHoang._id, car: cJesko._id, appointmentDate: day5, timeSlot: '14:30', visitorName: 'Phạm Đức Hoàng', visitorPhone: '0933445566', visitorEmail: 'hoang.pham@gmail.com', notes: 'Xem siêu phẩm Koenigsegg Jesko Attack độc bản.', status: 'confirmed' },
      { user: vipCuong._id, car: cHuayra._id, appointmentDate: tomorrow, timeSlot: '16:30', visitorName: 'Đặng Quốc Cường', visitorPhone: '0944556677', visitorEmail: 'cuong.dang@gmail.com', notes: 'Trao đổi phương án vận chuyển xe Pagani về dinh thự.', status: 'completed' },
    ]);
    console.log(`✅ [4/6] Đã nạp thành công ${appointments.length} Lịch Hẹn Concierge Đón Tiếp!`);

    // -------------------------------------------------------------
    // 5. DỮ LIỆU 10 ĐƠN ĐẶT CỌC HỢP ĐỒNG SIÊU XE (ORDERS)
    // -------------------------------------------------------------
    const orders = await Order.create([
      {
        orderNumber: 'LM-2026-889012',
        user: vipKhang._id,
        car: cSF90._id,
        carSnapshot: { name: cSF90.name, brand: 'Ferrari', model: cSF90.model, year: cSF90.year, image: cSF90.images[0].url, price: cSF90.price },
        depositAmount: 6900000000, // 6.9 Tỷ (20%)
        totalAmount: 34500000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'deposit_paid',
        orderStatus: 'confirmed',
        deliveryAddress: 'Biệt thự 18 Thảo Điền, Thành phố Thủ Đức, TP.HCM',
        notes: 'Khách cọc trực tuyến 20% qua MBBank. Yêu cầu bàn giao ngày 18/08.',
        statusHistory: [{ status: 'pending', note: 'Khởi tạo đơn cọc online', changedAt: new Date('2026-08-01') }, { status: 'confirmed', note: 'Đã nhận đủ tiền cọc 6.9 Tỷ VNĐ', changedAt: new Date('2026-08-02') }],
      },
      {
        orderNumber: 'LM-2026-991045',
        user: vipThuy._id,
        car: cGT3RS._id,
        carSnapshot: { name: cGT3RS.name, brand: 'Porsche', model: cGT3RS.model, year: cGT3RS.year, image: cGT3RS.images[0].url, price: cGT3RS.price },
        depositAmount: 4300000000, // 4.3 Tỷ
        totalAmount: 21500000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Penthouse Vinhomes Golden River, Q.1, TP.HCM',
        notes: 'Đã hoàn tất thanh toán 100% hợp đồng và bàn giao xe tận nơi.',
        statusHistory: [{ status: 'pending', note: 'Khởi tạo đơn hàng', changedAt: new Date('2026-07-15') }, { status: 'completed', note: 'Bàn giao xe thành công', changedAt: new Date('2026-07-28') }],
      },
      {
        orderNumber: 'LM-2026-443321',
        user: directorU._id,
        car: cPhantom._id,
        carSnapshot: { name: cPhantom.name, brand: 'Rolls-Royce', model: cPhantom.model, year: cPhantom.year, image: cPhantom.images[0].url, price: cPhantom.price },
        depositAmount: 10800000000, // 10.8 Tỷ
        totalAmount: 54000000000,
        paymentMethod: 'installment',
        paymentStatus: 'deposit_paid',
        orderStatus: 'pending',
        deliveryAddress: 'Khu Đô Thị Phú Mỹ Hưng, Q.7, TP.HCM',
        notes: 'Chờ Giám đốc phê duyệt chương trình ưu đãi hợp đồng lớn 5%.',
        statusHistory: [{ status: 'pending', note: 'Chờ Giám đốc phê duyệt hợp đồng lớn', changedAt: new Date('2026-08-04') }],
      },
      {
        orderNumber: 'LM-2026-102938',
        user: vipNam._id,
        car: cRevuelto._id,
        carSnapshot: { name: cRevuelto.name, brand: 'Lamborghini', model: cRevuelto.model, year: cRevuelto.year, image: cRevuelto.images[0].url, price: cRevuelto.price },
        depositAmount: 8760000000, // 8.76 Tỷ
        totalAmount: 43800000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'deposit_paid',
        orderStatus: 'confirmed',
        deliveryAddress: 'Khu Đô Thị Sala, Q.2, TP.HCM',
        notes: 'Hợp đồng cọc Revuelto V12 Hybrid đã nhận cọc.',
        statusHistory: [{ status: 'confirmed', note: 'Quản lý duyệt đơn cọc hạn mức', changedAt: new Date('2026-08-07') }],
      },
      {
        orderNumber: 'LM-2026-557799',
        user: vipHoang._id,
        car: cChiron._id,
        carSnapshot: { name: cChiron.name, brand: 'Bugatti', model: cChiron.model, year: cChiron.year, image: cChiron.images[0].url, price: cChiron.price },
        depositAmount: 18400000000, // 18.4 Tỷ
        totalAmount: 92000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'deposit_paid',
        orderStatus: 'pending',
        deliveryAddress: 'Dinh Thự Holm Villas Thảo Điền, Q.Thủ Đức, TP.HCM',
        notes: 'Hợp đồng cọc siêu phẩm Bugatti Chiron 300+ chờ Giám đốc duyệt.',
        statusHistory: [{ status: 'pending', note: 'Khởi tạo đơn cọc Bugatti', changedAt: new Date('2026-08-08') }],
      },
      {
        orderNumber: 'LM-2026-338822',
        user: vipCuong._id,
        car: c750S._id,
        carSnapshot: { name: c750S.name, brand: 'McLaren', model: c750S.model, year: c750S.year, image: c750S.images[0].url, price: c750S.price },
        depositAmount: 4960000000, // 4.96 Tỷ
        totalAmount: 24800000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'deposit_paid',
        orderStatus: 'processing',
        deliveryAddress: 'Chung cư Vinhomes Central Park, Q.Bình Thạnh, TP.HCM',
        notes: 'Đang làm thủ tục thông quan xe McLaren.',
        statusHistory: [{ status: 'processing', note: 'Đang làm thủ tục thông quan', changedAt: new Date('2026-08-05') }],
      },
      {
        orderNumber: 'LM-2026-774411',
        user: vipKhang._id,
        car: cValkyrie._id,
        carSnapshot: { name: cValkyrie.name, brand: 'Aston Martin', model: cValkyrie.model, year: cValkyrie.year, image: cValkyrie.images[0].url, price: cValkyrie.price },
        depositAmount: 15800000000, // 15.8 Tỷ
        totalAmount: 79000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'deposit_paid',
        orderStatus: 'confirmed',
        deliveryAddress: 'Khu Biệt Thự Chateau Phú Mỹ Hưng, Q.7, TP.HCM',
        notes: 'Đã nhận cọc 15.8 Tỷ siêu xe Aston Martin Valkyrie F1.',
        statusHistory: [{ status: 'confirmed', note: 'Xác nhận hợp đồng cọc F1', changedAt: new Date('2026-08-03') }],
      },
      {
        orderNumber: 'LM-2026-662200',
        user: vipThuy._id,
        car: cContinental._id,
        carSnapshot: { name: cContinental.name, brand: 'Bentley', model: cContinental.model, year: cContinental.year, image: cContinental.images[0].url, price: cContinental.price },
        depositAmount: 4400000000, // 4.4 Tỷ
        totalAmount: 22000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Khu Đô Thị Kim Long, Q.7, TP.HCM',
        notes: 'Đã giao xe Bentley Continental GT hoàn tất 100%.',
        statusHistory: [{ status: 'completed', note: 'Giao xe thành công', changedAt: new Date('2026-07-20') }],
      },
      {
        orderNumber: 'LM-2026-119933',
        user: vipNam._id,
        car: cJesko._id,
        carSnapshot: { name: cJesko.name, brand: 'Koenigsegg', model: cJesko.model, year: cJesko.year, image: cJesko.images[0].url, price: cJesko.price },
        depositAmount: 17000000000, // 17 Tỷ
        totalAmount: 85000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'deposit_paid',
        orderStatus: 'pending',
        deliveryAddress: 'Biệt Thự Riviera An Phú, Q.2, TP.HCM',
        notes: 'Hợp đồng cọc Jesko Attack chờ Giám đốc duyệt mức giảm 3%.',
        statusHistory: [{ status: 'pending', note: 'Chờ duyệt hợp đồng Jesko', changedAt: new Date('2026-08-07') }],
      },
      {
        orderNumber: 'LM-2026-440055',
        user: vipHoang._id,
        car: cHuayra._id,
        carSnapshot: { name: cHuayra.name, brand: 'Pagani', model: cHuayra.model, year: cHuayra.year, image: cHuayra.images[0].url, price: cHuayra.price },
        depositAmount: 17600000000, // 17.6 Tỷ
        totalAmount: 88000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'deposit_paid',
        orderStatus: 'confirmed',
        deliveryAddress: 'Khu Đô Thị Sunwah Pearl, Q.Bình Thạnh, TP.HCM',
        notes: 'Đã nhận tiền cọc Pagani Huayra BC Bespoke.',
        statusHistory: [{ status: 'confirmed', note: 'Xác nhận hợp đồng cọc Pagani', changedAt: new Date('2026-08-04') }],
      },
    ]);
    console.log(`✅ [5/6] Đã nạp thành công ${orders.length} Đơn Hàng Đặt Cọc Hợp Đồng Siêu Xe (TỔNG GIÁ TRỊ: 544.6 TỶ VNĐ)!`);

    // -------------------------------------------------------------
    // 6. DỮ LIỆU 10 YÊU CẦU TỪ FORM CONTACT LEADS (CONTACTS)
    // -------------------------------------------------------------
    const contacts = await Contact.create([
      { name: 'Võ Minh Khang', email: 'khachvip@gmail.com', phone: '0966778899', subject: 'Tư vấn siêu xe Ferrari SF90', message: 'Tôi quan tâm đến mẫu Ferrari SF90 Stradale. Vui lòng gửi bảng tính giá lăn bánh và phụ kiện đặt thêm.', interest: 'Tư vấn mua xe', status: 'new' },
      { name: 'Trần Thị Thu Thủy', email: 'thuy.tran@gmail.com', phone: '0911223344', subject: 'Đăng ký Concierge giao xe tận nhà', message: 'Tôi muốn trải nghiệm lái thử Lamborghini Revuelto tại dinh thự Q.2 vào cuối tuần này.', interest: 'Lái thử tận nhà', status: 'contacted' },
      { name: 'Lê Hoàng Nam', email: 'nam.le@gmail.com', phone: '0922334455', subject: 'Hỏi báo giá Rolls-Royce Phantom VIII', message: 'Showroom cho tôi hỏi thời gian đặt hàng tùy biến Bespoke xe Rolls-Royce Phantom mất bao lâu?', interest: 'Bespoke cá nhân hóa', status: 'new' },
      { name: 'Phạm Đức Hoàng', email: 'hoang.pham@gmail.com', phone: '0933445566', subject: 'Yêu cầu tư vấn trả góp 70%', message: 'Tôi muốn mua trả góp siêu xe Porsche 911 GT3 RS, tư vấn hạn mức vay giúp tôi.', interest: 'Trả góp ngân hàng', status: 'new' },
      { name: 'Đặng Quốc Cường', email: 'cuong.dang@gmail.com', phone: '0944556677', subject: 'Đăng ký nhận thông tin Bugatti Chiron', message: 'Gửi cho tôi thông số kỹ thuật chi tiết siêu phẩm Bugatti Chiron Super Sport 300+.', interest: 'Thông tin xe', status: 'contacted' },
      { name: 'Nguyễn Thanh Tùng', email: 'tung.nguyen@gmail.com', phone: '0955667788', subject: 'Hỏi thủ tục mua xe đứng tên Công ty', message: 'Vui lòng tư vấn thủ tục khấu trừ thuế VAT khi đăng ký siêu xe McLaren đứng tên doanh nghiệp.', interest: 'Thủ tục pháp lý', status: 'new' },
      { name: 'Bùi Hoài Nam', email: 'nam.bui@gmail.com', phone: '0966889900', subject: 'Đặt lịch bảo dưỡng siêu xe Bentley', message: 'Tôi muốn đặt lịch bảo dưỡng xe Bentley Continental GT tận nhà tuần sau.', interest: 'Hậu mãi bảo dưỡng', status: 'closed' },
      { name: 'Lê Mai Anh', email: 'anh.mai@gmail.com', phone: '0977990011', subject: 'Hỏi chương trình ưu đãi Giám đốc', message: 'Cho tôi xin mức chiết khấu tốt nhất nếu cọc siêu xe Aston Martin Valkyrie trong tháng này.', interest: 'Ưu đãi giá', status: 'new' },
      { name: 'Trịnh Quốc Hùng', email: 'hung.trinh@gmail.com', phone: '0988001122', subject: 'Đăng ký tham gia Supercar Rally 2026', message: 'Tôi muốn đăng ký câu lạc bộ chủ xe Luxe Motors tham dự sự kiện diễu hành siêu xe.', interest: 'Sự kiện CLB', status: 'contacted' },
      { name: 'Vũ Ngọc Khánh', email: 'khanh.vu@gmail.com', phone: '0999112233', subject: 'Tư vấn màu sơn mạ vàng 24K Pagani', message: 'Tôi có nhu cầu cá nhân hóa màu sơn mạ vàng 24K cho chiếc Pagani Huayra BC.', interest: 'Tùy biến cao cấp', status: 'new' },
    ]);
    console.log(`✅ [6/6] Đã nạp thành công ${contacts.length} Yêu Cầu Từ Form Contact Gửi Về!`);

    console.log('\n🎉 ĐÃ NẠP THÀNH CÔNG ĐỒNG BỘ 10 DỮ LIỆU TỪNG DANH MỤC LÊN MONGODB ATLAS! 🎉\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi nạp dữ liệu vào MongoDB:', error);
    process.exit(1);
  }
}

seedDatabase();
