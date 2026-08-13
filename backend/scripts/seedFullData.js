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

    // -------------------------------------------------------------
    // 4. DỮ LIỆU LỊCH HẸN CONCIERGE (APPOINTMENTS) RẢI ĐỀU CÁC THÁNG 1 - 8
    // -------------------------------------------------------------
    const appointments = await Appointment.create([
      { user: vipKhang._id, car: cSF90._id, appointmentDate: new Date('2026-01-14'), timeSlot: '10:00', visitorName: 'Võ Minh Khang', visitorPhone: '0966778899', visitorEmail: 'khachvip@gmail.com', notes: 'Lịch hẹn Tháng 1: Thử cảm giác lái 1000 HP SF90.', status: 'completed', createdAt: new Date('2026-01-10') },
      { user: vipThuy._id, car: cGT3RS._id, appointmentDate: new Date('2026-02-18'), timeSlot: '14:00', visitorName: 'Trần Thị Thu Thủy', visitorPhone: '0911223344', visitorEmail: 'thuy.tran@gmail.com', notes: 'Lịch hẹn Tháng 2: Thử gói cánh gió khí động học Porsche 911.', status: 'completed', createdAt: new Date('2026-02-15') },
      { user: vipNam._id, car: c750S._id, appointmentDate: new Date('2026-03-22'), timeSlot: '09:30', visitorName: 'Lê Hoàng Nam', visitorPhone: '0922334455', visitorEmail: 'nam.le@gmail.com', notes: 'Lịch hẹn Tháng 3: Đón tiếp tại phòng VIP McLaren Lounge.', status: 'completed', createdAt: new Date('2026-03-19') },
      { user: vipHoang._id, car: cPhantom._id, appointmentDate: new Date('2026-04-12'), timeSlot: '15:00', visitorName: 'Phạm Đức Hoàng', visitorPhone: '0933445566', visitorEmail: 'hoang.pham@gmail.com', notes: 'Lịch hẹn Tháng 4: Trải nghiệm khoangPrivacy Suite Rolls-Royce.', status: 'completed', createdAt: new Date('2026-04-08') },
      { user: vipCuong._id, car: cRevuelto._id, appointmentDate: new Date('2026-05-20'), timeSlot: '16:00', visitorName: 'Đặng Quốc Cường', visitorPhone: '0944556677', visitorEmail: 'cuong.dang@gmail.com', notes: 'Lịch hẹn Tháng 5: Thử động cơ V12 Hybrid Revuelto.', status: 'completed', createdAt: new Date('2026-05-16') },
      { user: vipKhang._id, car: cChiron._id, appointmentDate: new Date('2026-06-15'), timeSlot: '11:00', visitorName: 'Võ Minh Khang', visitorPhone: '0966778899', visitorEmail: 'khachvip@gmail.com', notes: 'Lịch hẹn Tháng 6: Tư vấn gói cá nhân hóa Bugatti.', status: 'completed', createdAt: new Date('2026-06-11') },
      { user: vipThuy._id, car: cValkyrie._id, appointmentDate: new Date('2026-07-22'), timeSlot: '15:30', visitorName: 'Trần Thị Thu Thủy', visitorPhone: '0911223344', visitorEmail: 'thuy.tran@gmail.com', notes: 'Lịch hẹn Tháng 7: Đưa xe lồng chở Valkyrie đến dinh thự Q.2.', status: 'completed', createdAt: new Date('2026-07-18') },
      { user: vipNam._id, car: cJesko._id, appointmentDate: new Date('2026-08-05'), timeSlot: '10:30', visitorName: 'Lê Hoàng Nam', visitorPhone: '0922334455', visitorEmail: 'nam.le@gmail.com', notes: 'Lịch hẹn Tháng 8: Đón tiếp tư vấn siêu xe Jesko Attack.', status: 'confirmed', createdAt: new Date('2026-08-02') },
      { user: vipHoang._id, car: cHuayra._id, appointmentDate: new Date('2026-08-12'), timeSlot: '14:30', visitorName: 'Phạm Đức Hoàng', visitorPhone: '0933445566', visitorEmail: 'hoang.pham@gmail.com', notes: 'Lịch hẹn Tháng 8: Đăng ký xem trực tiếp Pagani Huayra BC.', status: 'pending', createdAt: new Date('2026-08-08') },
    ]);
    console.log(`✅ [4/6] Đã nạp thành công ${appointments.length} Lịch Hẹn Concierge Rải Đều 8 Tháng!`);

    // -------------------------------------------------------------
    // 5. DỮ LIỆU ĐƠN ĐẶT CỌC HỢP ĐỒNG SIÊU XE (ORDERS) RẢI ĐỀU CÁC THÁNG 1 - 8
    // -------------------------------------------------------------
    const orders = await Order.create([
      // --- THÁNG 1 ---
      {
        orderNumber: 'LM-2026-0101',
        user: vipKhang._id,
        car: cSF90._id,
        carSnapshot: { name: cSF90.name, brand: 'Ferrari', model: cSF90.model, year: cSF90.year, image: cSF90.images[0].url, price: 34500000000 },
        depositAmount: 6900000000,
        totalAmount: 34500000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Biệt thự Thảo Điền, Q.2, TP.HCM',
        notes: 'Đơn cọc Tháng 1 — Đã bàn giao xe hoàn tất.',
        createdAt: new Date('2026-01-15T10:00:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe thành công Tháng 1', changedAt: new Date('2026-01-25') }],
      },
      {
        orderNumber: 'LM-2026-0102',
        user: vipThuy._id,
        car: cGT3RS._id,
        carSnapshot: { name: cGT3RS.name, brand: 'Porsche', model: cGT3RS.model, year: cGT3RS.year, image: cGT3RS.images[0].url, price: 21500000000 },
        depositAmount: 4300000000,
        totalAmount: 21500000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Penthouse Vinhomes Central Park, Q.Bình Thạnh, TP.HCM',
        notes: 'Đơn cọc Tháng 1 — Đã hoàn tất thanh toán.',
        createdAt: new Date('2026-01-28T14:30:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 1', changedAt: new Date('2026-02-05') }],
      },

      // --- THÁNG 2 ---
      {
        orderNumber: 'LM-2026-0201',
        user: vipNam._id,
        car: c750S._id,
        carSnapshot: { name: c750S.name, brand: 'McLaren', model: c750S.model, year: c750S.year, image: c750S.images[0].url, price: 24800000000 },
        depositAmount: 4960000000,
        totalAmount: 24800000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Khu Đô Thị Sala, Q.2, TP.HCM',
        notes: 'Đơn cọc Tháng 2 — Đã giao xe McLaren.',
        createdAt: new Date('2026-02-12T11:15:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 2', changedAt: new Date('2026-02-22') }],
      },
      {
        orderNumber: 'LM-2026-0202',
        user: vipHoang._id,
        car: cContinental._id,
        carSnapshot: { name: cContinental.name, brand: 'Bentley', model: cContinental.model, year: cContinental.year, image: cContinental.images[0].url, price: 22000000000 },
        depositAmount: 4400000000,
        totalAmount: 22000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Phú Mỹ Hưng, Q.7, TP.HCM',
        notes: 'Đơn cọc Tháng 2 — Bentley Continental GT.',
        createdAt: new Date('2026-02-24T16:00:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 2', changedAt: new Date('2026-03-02') }],
      },

      // --- THÁNG 3 ---
      {
        orderNumber: 'LM-2026-0301',
        user: vipKhang._id,
        car: cRevuelto._id,
        carSnapshot: { name: cRevuelto.name, brand: 'Lamborghini', model: cRevuelto.model, year: cRevuelto.year, image: cRevuelto.images[0].url, price: 43600000000 },
        depositAmount: 8720000000,
        totalAmount: 43600000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Dinh thự Thảo Điền, Q.2, TP.HCM',
        notes: 'Đơn cọc Tháng 3 — Lamborghini Revuelto V12.',
        createdAt: new Date('2026-03-08T09:45:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 3', changedAt: new Date('2026-03-25') }],
      },
      {
        orderNumber: 'LM-2026-0302',
        user: vipCuong._id,
        car: cPhantom._id,
        carSnapshot: { name: cPhantom.name, brand: 'Rolls-Royce', model: cPhantom.model, year: cPhantom.year, image: cPhantom.images[0].url, price: 54000000000 },
        depositAmount: 10800000000,
        totalAmount: 54000000000,
        paymentMethod: 'installment',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Khu Kim Long, Q.7, TP.HCM',
        notes: 'Đơn cọc Tháng 3 — Rolls-Royce Phantom VIII.',
        createdAt: new Date('2026-03-20T15:20:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 3', changedAt: new Date('2026-04-05') }],
      },

      // --- THÁNG 4 ---
      {
        orderNumber: 'LM-2026-0401',
        user: vipThuy._id,
        car: cValkyrie._id,
        carSnapshot: { name: cValkyrie.name, brand: 'Aston Martin', model: cValkyrie.model, year: cValkyrie.year, image: cValkyrie.images[0].url, price: 79000000000 },
        depositAmount: 15800000000,
        totalAmount: 79000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Chateau Phú Mỹ Hưng, Q.7, TP.HCM',
        notes: 'Đơn cọc Tháng 4 — Hypercar Valkyrie.',
        createdAt: new Date('2026-04-05T10:30:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 4', changedAt: new Date('2026-04-20') }],
      },
      {
        orderNumber: 'LM-2026-0402',
        user: vipNam._id,
        car: cGT3RS._id,
        carSnapshot: { name: cGT3RS.name, brand: 'Porsche', model: cGT3RS.model, year: cGT3RS.year, image: cGT3RS.images[0].url, price: 21500000000 },
        depositAmount: 4300000000,
        totalAmount: 21500000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Q.1, TP.HCM',
        notes: 'Đơn cọc Tháng 4 — Porsche 911 GT3 RS.',
        createdAt: new Date('2026-04-18T13:40:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 4', changedAt: new Date('2026-04-30') }],
      },

      // --- THÁNG 5 ---
      {
        orderNumber: 'LM-2026-0501',
        user: vipHoang._id,
        car: cSF90._id,
        carSnapshot: { name: cSF90.name, brand: 'Ferrari', model: cSF90.model, year: cSF90.year, image: cSF90.images[0].url, price: 34500000000 },
        depositAmount: 6900000000,
        totalAmount: 34500000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Holm Villas Thảo Điền, TP.Thủ Đức',
        notes: 'Đơn cọc Tháng 5 — Ferrari SF90.',
        createdAt: new Date('2026-05-09T11:00:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 5', changedAt: new Date('2026-05-25') }],
      },
      {
        orderNumber: 'LM-2026-0502',
        user: vipCuong._id,
        car: cContinental._id,
        carSnapshot: { name: cContinental.name, brand: 'Bentley', model: cContinental.model, year: cContinental.year, image: cContinental.images[0].url, price: 22000000000 },
        depositAmount: 4400000000,
        totalAmount: 22000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Vinhomes Golden River, Q.1',
        notes: 'Đơn cọc Tháng 5 — Bentley GT.',
        createdAt: new Date('2026-05-22T14:15:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 5', changedAt: new Date('2026-06-01') }],
      },

      // --- THÁNG 6 ---
      {
        orderNumber: 'LM-2026-0601',
        user: vipKhang._id,
        car: cRevuelto._id,
        carSnapshot: { name: cRevuelto.name, brand: 'Lamborghini', model: cRevuelto.model, year: cRevuelto.year, image: cRevuelto.images[0].url, price: 43600000000 },
        depositAmount: 8720000000,
        totalAmount: 43600000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Q.2, TP.HCM',
        notes: 'Đơn cọc Tháng 6 — Lamborghini Revuelto.',
        createdAt: new Date('2026-06-04T10:20:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 6', changedAt: new Date('2026-06-20') }],
      },
      {
        orderNumber: 'LM-2026-0602',
        user: vipThuy._id,
        car: cPhantom._id,
        carSnapshot: { name: cPhantom.name, brand: 'Rolls-Royce', model: cPhantom.model, year: cPhantom.year, image: cPhantom.images[0].url, price: 54000000000 },
        depositAmount: 10800000000,
        totalAmount: 54000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Phú Mỹ Hưng, Q.7',
        notes: 'Đơn cọc Tháng 6 — Rolls-Royce Phantom.',
        createdAt: new Date('2026-06-16T15:45:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 6', changedAt: new Date('2026-06-30') }],
      },

      // --- THÁNG 7 ---
      {
        orderNumber: 'LM-2026-0701',
        user: vipNam._id,
        car: cJesko._id,
        carSnapshot: { name: cJesko.name, brand: 'Koenigsegg', model: cJesko.model, year: cJesko.year, image: cJesko.images[0].url, price: 85000000000 },
        depositAmount: 17000000000,
        totalAmount: 85000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'fully_paid',
        orderStatus: 'completed',
        deliveryAddress: 'Riviera An Phú, Q.2',
        notes: 'Đơn cọc Tháng 7 — Koenigsegg Jesko Attack.',
        createdAt: new Date('2026-07-06T09:15:00'),
        statusHistory: [{ status: 'completed', note: 'Bàn giao xe Tháng 7', changedAt: new Date('2026-07-22') }],
      },
      {
        orderNumber: 'LM-2026-0702',
        user: vipHoang._id,
        car: cHuayra._id,
        carSnapshot: { name: cHuayra.name, brand: 'Pagani', model: cHuayra.model, year: cHuayra.year, image: cHuayra.images[0].url, price: 88000000000 },
        depositAmount: 17600000000,
        totalAmount: 88000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'deposit_paid',
        orderStatus: 'confirmed',
        deliveryAddress: 'Sunwah Pearl, Q.Bình Thạnh',
        notes: 'Đơn cọc Tháng 7 — Pagani Huayra BC.',
        createdAt: new Date('2026-07-18T14:00:00'),
        statusHistory: [{ status: 'confirmed', note: 'Xác nhận hợp đồng cọc Tháng 7', changedAt: new Date('2026-07-20') }],
      },

      // --- THÁNG 8 (HIỆN TẠI) ---
      {
        orderNumber: 'LM-2026-0801',
        user: vipKhang._id,
        car: cChiron._id,
        carSnapshot: { name: cChiron.name, brand: 'Bugatti', model: cChiron.model, year: cChiron.year, image: cChiron.images[0].url, price: 92000000000 },
        depositAmount: 18400000000,
        totalAmount: 92000000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'deposit_paid',
        orderStatus: 'pending',
        deliveryAddress: 'Thảo Điền, Q.2',
        notes: 'Đơn cọc Tháng 8 — Bugatti Chiron Super Sport.',
        createdAt: new Date('2026-08-02T10:00:00'),
        statusHistory: [{ status: 'pending', note: 'Khởi tạo đơn cọc Tháng 8', changedAt: new Date('2026-08-02') }],
      },
      {
        orderNumber: 'LM-2026-0802',
        user: vipCuong._id,
        car: c750S._id,
        carSnapshot: { name: c750S.name, brand: 'McLaren', model: c750S.model, year: c750S.year, image: c750S.images[0].url, price: 24800000000 },
        depositAmount: 4960000000,
        totalAmount: 24800000000,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'deposit_paid',
        orderStatus: 'processing',
        deliveryAddress: 'Vinhomes Central Park, Q.Bình Thạnh',
        notes: 'Đơn cọc Tháng 8 — McLaren 750S.',
        createdAt: new Date('2026-08-06T15:30:00'),
        statusHistory: [{ status: 'processing', note: 'Đang làm hồ sơ giao xe Tháng 8', changedAt: new Date('2026-08-07') }],
      },
    ]);
    console.log(`✅ [5/6] Đã nạp thành công ${orders.length} Đơn Hàng Rải Đều 8 Tháng (TỔNG GIÁ TRỊ DOANH THU: > 800 TỶ VNĐ)!`);

    // -------------------------------------------------------------
    // 6. DỮ LIỆU YÊU CẦU TỪ FORM CONTACT LEADS RẢI ĐỀU CÁC THÁNG 1 - 8
    // -------------------------------------------------------------
    const contacts = await Contact.create([
      { name: 'Võ Minh Khang', email: 'khachvip@gmail.com', phone: '0966778899', subject: 'Tư vấn siêu xe Ferrari SF90', message: 'Tôi quan tâm đến mẫu Ferrari SF90 Stradale.', interest: 'Tư vấn mua xe', status: 'closed', createdAt: new Date('2026-01-12') },
      { name: 'Trần Thị Thu Thủy', email: 'thuy.tran@gmail.com', phone: '0911223344', subject: 'Đăng ký Concierge giao xe', message: 'Tôi muốn trải nghiệm lái thử Porsche GT3 RS.', interest: 'Lái thử tận nhà', status: 'closed', createdAt: new Date('2026-02-14') },
      { name: 'Lê Hoàng Nam', email: 'nam.le@gmail.com', phone: '0922334455', subject: 'Hỏi báo giá Rolls-Royce Phantom VIII', message: 'Cho tôi hỏi thời gian tùy biến Bespoke Rolls-Royce.', interest: 'Bespoke cá nhân hóa', status: 'closed', createdAt: new Date('2026-03-16') },
      { name: 'Phạm Đức Hoàng', email: 'hoang.pham@gmail.com', phone: '0933445566', subject: 'Yêu cầu tư vấn trả góp 70%', message: 'Tư vấn hạn mức vay mua siêu xe.', interest: 'Trả góp ngân hàng', status: 'closed', createdAt: new Date('2026-04-10') },
      { name: 'Đặng Quốc Cường', email: 'cuong.dang@gmail.com', phone: '0944556677', subject: 'Đăng ký nhận thông tin Bugatti Chiron', message: 'Gửi cho tôi thông số Bugatti Chiron.', interest: 'Thông tin xe', status: 'closed', createdAt: new Date('2026-05-18') },
      { name: 'Nguyễn Thanh Tùng', email: 'tung.nguyen@gmail.com', phone: '0955667788', subject: 'Hỏi thủ tục mua xe công ty', message: 'Tư vấn thủ tục VAT siêu xe McLaren đứng tên công ty.', interest: 'Thủ tục pháp lý', status: 'closed', createdAt: new Date('2026-06-08') },
      { name: 'Bùi Hoài Nam', email: 'nam.bui@gmail.com', phone: '0966889900', subject: 'Đặt lịch bảo dưỡng siêu xe Bentley', message: 'Đặt lịch bảo dưỡng Bentley tại nhà Tháng 7.', interest: 'Hậu mãi bảo dưỡng', status: 'contacted', createdAt: new Date('2026-07-14') },
      { name: 'Lê Mai Anh', email: 'anh.mai@gmail.com', phone: '0977990011', subject: 'Hỏi chương trình ưu đãi Giám đốc', message: 'Cho tôi xin chiết khấu Aston Martin Valkyrie.', interest: 'Ưu đãi giá', status: 'new', createdAt: new Date('2026-08-01') },
      { name: 'Trịnh Quốc Hùng', email: 'hung.trinh@gmail.com', phone: '0988001122', subject: 'Đăng ký tham gia Supercar Rally 2026', message: 'Đăng ký câu lạc bộ chủ xe Luxe Motors.', interest: 'Sự kiện CLB', status: 'new', createdAt: new Date('2026-08-05') },
      { name: 'Vũ Ngọc Khánh', email: 'khanh.vu@gmail.com', phone: '0999112233', subject: 'Tư vấn màu sơn mạ vàng 24K Pagani', message: 'Nhu cầu cá nhân hóa màu sơn mạ vàng Pagani Huayra.', interest: 'Tùy biến cao cấp', status: 'new', createdAt: new Date('2026-08-07') },
    ]);
    console.log(`✅ [6/6] Đã nạp thành công ${contacts.length} Yêu Cầu Liên Hệ Rải Đều 8 Tháng!`);

    // -------------------------------------------------------------
    // ĐỒNG BỘ NATIVE CREATEDAT DẠNG TIMESTAMP CHO TẤT CẢ ĐƠN HÀNG, LỊCH HẸN & CONTACTS (THÁNG 1 - THÁNG 8)
    // -------------------------------------------------------------
    const orderDates = [
      new Date('2026-01-15T10:00:00'),
      new Date('2026-01-28T14:30:00'),
      new Date('2026-02-12T11:15:00'),
      new Date('2026-02-24T16:00:00'),
      new Date('2026-03-08T09:45:00'),
      new Date('2026-03-20T15:20:00'),
      new Date('2026-04-05T10:30:00'),
      new Date('2026-04-18T13:40:00'),
      new Date('2026-05-09T11:00:00'),
      new Date('2026-05-22T14:15:00'),
      new Date('2026-06-04T10:20:00'),
      new Date('2026-06-16T15:45:00'),
      new Date('2026-07-06T09:15:00'),
      new Date('2026-07-18T14:00:00'),
      new Date('2026-08-02T10:00:00'),
      new Date('2026-08-06T15:30:00'),
    ];

    for (let i = 0; i < orders.length; i++) {
      if (orderDates[i]) {
        await Order.collection.updateOne(
          { _id: orders[i]._id },
          { $set: { createdAt: orderDates[i] } }
        );
      }
    }

    const contactDates = [
      new Date('2026-01-12'),
      new Date('2026-02-14'),
      new Date('2026-03-16'),
      new Date('2026-04-10'),
      new Date('2026-05-18'),
      new Date('2026-06-08'),
      new Date('2026-07-14'),
      new Date('2026-08-01'),
      new Date('2026-08-05'),
      new Date('2026-08-07'),
    ];

    for (let i = 0; i < contacts.length; i++) {
      if (contactDates[i]) {
        await Contact.collection.updateOne(
          { _id: contacts[i]._id },
          { $set: { createdAt: contactDates[i] } }
        );
      }
    }

    console.log('\n🎉 ĐÃ NẠP & ĐỒNG BỘ NATIVE CREATEDAT THÀNH CÔNG CHO TẤT CẢ 8 THÁNG TRÊN MONGODB ATLAS! 🎉\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi nạp dữ liệu vào MongoDB:', error);
    process.exit(1);
  }
}

seedDatabase();
