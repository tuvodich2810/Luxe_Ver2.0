const expressAsyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const emailService = require('../services/emailService');
const { created, ok, badRequest, notFound } = require('../utils/apiResponse');

// POST /api/contacts
const createContact = expressAsyncHandler(async (req, res) => {
  const { name, email, phone, message, subject, interest, car } = req.body;

  if (!name || !message || (!email && !phone)) {
    return badRequest(
      res,
      'Vui lòng điền tên, nội dung và tối thiểu một liên hệ: email hoặc số điện thoại.'
    );
  }

  const contact = await Contact.create({
    name,
    email: email || '',
    phone: phone || '',
    message,
    subject: subject || 'Tư vấn siêu xe',
    interest: interest || subject || '',
    car: car || '',
    status: 'new',
  });

  // TỰ ĐỘNG GỬI EMAIL XÁC NHẬN CHO KHÁCH HÀNG (NẾU CÓ EMAIL)
  if (email) {
    setImmediate(async () => {
      try {
        await emailService.sendContactReceivedEmail(contact);
      } catch (err) {
        console.error('❌ Lỗi gửi email xác nhận tiếp nhận liên hệ:', err.message);
      }
    });
  }

  return created(res, 'Liên hệ của bạn đã được gửi thành công.', contact);
});

// POST /api/contacts/:id/reply [Admin/Staff]
// Gửi Gmail phản hồi trực tiếp cho khách hàng
const replyToContact = expressAsyncHandler(async (req, res) => {
  const { replyMessage, subject } = req.body;

  if (!replyMessage || !replyMessage.trim()) {
    return badRequest(res, 'Vui lòng nhập nội dung thư phản hồi');
  }

  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return notFound(res, 'Không tìm thấy thông tin liên hệ này');
  }

  if (!contact.email) {
    return badRequest(res, 'Khách hàng này không cung cấp địa chỉ email');
  }

  const staffName = req.user?.fullName || 'Chuyên viên VIP Concierge';

  const sendResult = await emailService.sendContactReplyEmail({
    toEmail: contact.email,
    customerName: contact.name,
    subject: subject || `[Luxe Motors Concierge] Thư Phản Hồi Tư Vấn Gửi ${contact.name}`,
    replyMessage: replyMessage.trim(),
    originalMessage: contact.message,
    staffName,
  });

  if (!sendResult) {
    return badRequest(res, 'Không thể gửi email qua máy chủ SMTP. Vui lòng kiểm tra lại cấu hình Gmail.');
  }

  // Cập nhật trạng thái liên hệ sang contacted
  contact.status = 'contacted';
  contact.notes = (contact.notes ? contact.notes + '\n\n' : '') + `[${new Date().toLocaleString('vi-VN')}] Đã gửi email phản hồi bởi ${staffName}:\n${replyMessage}`;
  await contact.save();

  return ok(res, `Đã gửi email phản hồi thành công đến ${contact.email}!`, contact);
});

// GET /api/contacts [Admin]
const getAllContacts = expressAsyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return ok(res, 'Lấy danh sách liên hệ thành công', contacts);
});

// GET /api/contacts/:id [Admin]
const getContactById = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return notFound(res, 'Không tìm thấy liên hệ này');
  return ok(res, 'Lấy liên hệ thành công', contact);
});

// PUT /api/contacts/:id [Admin]
const updateContactStatus = expressAsyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const updateData = {};
  if (status) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!contact) return notFound(res, 'Không tìm thấy liên hệ này');
  return ok(res, 'Cập nhật trạng thái liên hệ thành công', contact);
});

// DELETE /api/contacts/:id [Admin]
const deleteContact = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return notFound(res, 'Không tìm thấy liên hệ này');
  return ok(res, 'Xóa thông tin liên hệ thành công');
});

// POST /api/contacts/seed [Admin/Staff]
const seedContacts = expressAsyncHandler(async (req, res) => {
  const sampleLeads = [
    {
      name: 'Nguyễn Hoàng Long',
      email: 'long.nguyen@vinaholding.vn',
      phone: '0912345678',
      car: 'Ferrari SF90 Stradale',
      subject: 'Đăng ký lái thử Ferrari SF90 Stradale tại Sala',
      message: 'Tôi muốn lái thử vào lúc 10:00 sáng Thứ Bảy tại Khu đô thị Sala Thủ Đức. Yêu cầu mang theo mẫu da Alcantara và bảng màu Đỏ Rosso Corsa.',
      interest: 'Lái thử tận nhà Concierge',
      status: 'new',
      createdAt: new Date('2026-08-15T09:30:00'),
    },
    {
      name: 'Trần Thị Ánh Tuyết',
      email: 'tuyet.tran@vietcapital.com',
      phone: '0903888999',
      car: 'Rolls-Royce Ghost Extended',
      subject: 'Tư vấn xe doanh nghiệp Rolls-Royce Ghost',
      message: 'Doanh nghiệp cần mua xe phục vụ đối ngoại cấp cao, yêu cầu gói trần sao Starlight Headliner, ghế massage và hóa đơn VAT minh bạch.',
      interest: 'Xe doanh nghiệp & Bespoke',
      status: 'contacted',
      createdAt: new Date('2026-08-14T14:15:00'),
    },
    {
      name: 'Đỗ Gia Huy',
      email: 'huy.do@luxurydecor.vn',
      phone: '0933222111',
      car: 'Lamborghini Revuelto V12',
      subject: 'Đặt cọc giữ chỗ Lamborghini Revuelto V12 màu Cam',
      message: 'Tôi muốn đặt cọc 20% giữ xe chiếc Lamborghini Revuelto màu Cam Arancio Apodis qua Napas VietQR. Hẹn bàn giao xe tháng 09/2026.',
      interest: 'Đặt cọc xe Online',
      status: 'closed',
      createdAt: new Date('2026-08-13T16:45:00'),
    },
    {
      name: 'Bùi Quang Hải',
      email: 'hai.bui@techcorp.io',
      phone: '0918999777',
      car: 'McLaren 750S Spider',
      subject: 'Đăng ký tham gia Track Day McLaren 750S',
      message: 'Tôi muốn lái thử và test hiệu năng mẫu McLaren 750S Spider tại Trường đua Đại Nam vào Chủ Nhật tuần này cùng chuyên gia kỹ thuật.',
      interest: 'Trải nghiệm đường đua',
      status: 'contacted',
      createdAt: new Date('2026-08-12T11:20:00'),
    },
    {
      name: 'Ngô Bảo Trâm',
      email: 'tramngo@fashionhouse.com',
      phone: '0922444888',
      car: 'Ferrari Roma Spider',
      subject: 'Tham quan và chiêm ngưỡng Ferrari Roma Spider',
      message: 'Khách chọn màu ngoại thất Đỏ Rosso Corsa. Hẹn tiếp đón riêng tại VIP Lounge Showroom Hà Nội chiều Thứ Sáu.',
      interest: 'Tham quan VIP Lounge',
      status: 'contacted',
      createdAt: new Date('2026-08-11T15:10:00'),
    },
    {
      name: 'Phạm Minh Đức',
      email: 'ducpham.invest@gmail.com',
      phone: '0987654321',
      car: 'Porsche 911 GT3 RS',
      subject: 'Hỏi tùy chọn gói Weissach Package GT3 RS',
      message: 'Quan tâm gói nâng cấp khí động học Weissach Package, mâm Magie siêu nhẹ và hệ thống cánh gió DRS chủ động.',
      interest: 'Phụ kiện hiệu năng cao',
      status: 'new',
      createdAt: new Date('2026-08-10T10:00:00'),
    },
    {
      name: 'Hoàng Anh Dũng',
      email: 'dung.hoang@vietsteel.com',
      phone: '0968555444',
      car: 'Bentley Continental GT',
      subject: 'Chương trình đổi xe cũ lấy mới (Trade-in Bentley)',
      message: 'Tôi muốn đổi từ mẫu Flying Spur cũ sang Continental GT thế hệ mới. Đề nghị chuyên viên liên hệ thẩm định xe tại nhà.',
      interest: 'Thu cũ đổi mới (Trade-in)',
      status: 'contacted',
      createdAt: new Date('2026-08-08T13:30:00'),
    },
    {
      name: 'Vũ Đình Trọng',
      email: 'trongvu.logistics@yahoo.com',
      phone: '0976112233',
      car: 'Mercedes-Maybach S680',
      subject: 'Tư vấn trải nghiệm Mercedes-Maybach S680',
      message: 'Khách cần lái thử vào cuối tuần tại Showroom. Yêu cầu tư vấn gói màu sơn hai tông màu Two-Tone độc bản.',
      interest: 'Lái thử tại Showroom',
      status: 'new',
      createdAt: new Date('2026-08-07T09:15:00'),
    },
    {
      name: 'Lê Phương Thảo',
      email: 'thao.le@globaltrade.vn',
      phone: '0945678123',
      car: 'Aston Martin DB12',
      subject: 'Tư vấn trả góp ngân hàng mua Aston Martin DB12',
      message: 'Cần phương án vay 70% qua VietinBank ưu đãi lãi suất và thời gian hoàn tất thủ tục đăng ký biển số thành phố.',
      interest: 'Trả góp ngân hàng',
      status: 'contacted',
      createdAt: new Date('2026-08-05T14:50:00'),
    },
    {
      name: 'Nguyễn Thanh Tùng',
      email: 'tung.nguyen@techhub.vn',
      phone: '0955667788',
      car: 'Bugatti Chiron Super Sport',
      subject: 'Yêu cầu báo giá và thủ tục nhập khẩu Bugatti Chiron',
      message: 'Yêu cầu trọn bộ thông số kỹ thuật W16 1.600 HP, quy trình cá nhân hóa và tiến độ bàn giao xe chính ngạch.',
      interest: 'Hypercar Bespoke',
      status: 'new',
      createdAt: new Date('2026-08-03T11:00:00'),
    },
    {
      name: 'Đặng Quốc Cường',
      email: 'cuong.dang@vietsteel.com',
      phone: '0944556677',
      car: 'Rolls-Royce Phantom VIII',
      subject: 'Tư vấn khoang thương gia Rolls-Royce Phantom',
      message: 'Hỏi về gói Privacy Suite khoang sau cách âm tuyệt đối và thời gian giao xe tại Vinhomes Golden River.',
      interest: 'Bespoke cá nhân hóa',
      status: 'closed',
      createdAt: new Date('2026-07-28T16:20:00'),
    },
    {
      name: 'Võ Minh Khang',
      email: 'khachvip@gmail.com',
      phone: '0966778899',
      car: 'Lamborghini Revuelto V12',
      subject: 'Đăng ký lái thử Lamborghini Revuelto tại Thảo Điền',
      message: 'Tôi muốn trải nghiệm cảm giác tăng tốc 0-100 km/h trong 2.5s của khối động cơ V12 Hybrid tại tư gia.',
      interest: 'Lái thử tận nhà',
      status: 'closed',
      createdAt: new Date('2026-07-20T10:45:00'),
    },
    {
      name: 'Trần Thị Thu Thủy',
      email: 'thuy.tran@gmail.com',
      phone: '0911223344',
      car: 'Porsche 911 Turbo S',
      subject: 'Hẹn giao xe và bàn giao hồ sơ Porsche 911',
      message: 'Đã hoàn tất cọc, hẹn tổ chức lễ bàn giao riêng tư tại Showroom có hoa và rượu champagne.',
      interest: 'Bàn giao xe VIP',
      status: 'closed',
      createdAt: new Date('2026-07-15T15:00:00'),
    },
    {
      name: 'Phạm Gia Bách',
      email: 'bach.pham@vinalimited.com',
      phone: '0918776655',
      car: 'Ferrari 296 GTB',
      subject: 'Hỏi tùy chọn mâm Carbon Ferrari 296 GTB',
      message: 'Tư vấn công suất động cơ V6 Hybrid và gói bảo hiểm thân vỏ cao cấp 5 năm chính hãng.',
      interest: 'Tư vấn kỹ thuật',
      status: 'contacted',
      createdAt: new Date('2026-07-08T09:30:00'),
    },
    {
      name: 'Trịnh Công Thành',
      email: 'thanh.trinh@gmail.com',
      phone: '0909333777',
      car: 'Siêu xe thể thao nhập môn',
      subject: 'Tư vấn các dòng siêu xe dưới 15 Tỷ',
      message: 'Khách hàng đang cân nhắc tài chính, xin bảng so sánh chi tiết giữa Porsche 911 Carrera và Audi R8.',
      interest: 'Tìm hiểu thị trường',
      status: 'contacted',
      createdAt: new Date('2026-06-25T14:10:00'),
    },
    {
      name: 'Nguyễn Tiến Dũng',
      email: 'dung.nguyen@gmail.com',
      phone: '0966334455',
      car: 'Dịch vụ bảo hiểm',
      subject: 'Yêu cầu tư vấn bảo hiểm siêu xe 50 tỷ',
      message: 'Tư vấn mức bồi thường bảo hiểm thân vỏ khi vận hành trên đường đua chuyên nghiệp.',
      interest: 'Dịch vụ bảo hiểm',
      status: 'closed',
      createdAt: new Date('2026-06-12T11:00:00'),
    },
  ];

  // Xóa sạch contacts cũ và nạp mới
  await Contact.deleteMany({});
  const createdLeads = await Contact.create(sampleLeads);

  // Cập nhật native createdAt
  for (let i = 0; i < createdLeads.length; i++) {
    if (sampleLeads[i]?.createdAt) {
      await Contact.collection.updateOne(
        { _id: createdLeads[i]._id },
        { $set: { createdAt: sampleLeads[i].createdAt } }
      );
    }
  }

  return ok(res, `Đã khởi tạo thành công ${createdLeads.length} hồ sơ khách hàng tiềm năng lên MongoDB Atlas!`, createdLeads);
});

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  seedContacts,
};

