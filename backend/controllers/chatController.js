const OpenAI = require("openai");
const { GROQ_API_KEY, GROQ_MODEL } = require("../config/env");

// Khởi tạo client Groq
const client = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Chat với AI
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tin nhắn.",
      });
    }

    // Truy vấn dữ liệu thực tế từ MongoDB
    const Car = require('../models/Car');
    const availableCars = await Car.find({ isPublished: true })
      .select('name price salePrice category brand model year specifications.horsepower')
      .populate('brand', 'name')
      .limit(15)
      .lean();

    const carDataSummary = availableCars.length > 0
      ? availableCars
          .map((c) => `- ${c.name} (${c.brand?.name || ''} ${c.year}): Giá niêm yết ${new Intl.NumberFormat('vi-VN').format(c.price)} VNĐ${c.salePrice ? `, Giá ưu đãi: ${new Intl.NumberFormat('vi-VN').format(c.salePrice)} VNĐ` : ''} [Công suất: ${c.specifications?.horsepower || 'N/A'} HP]`)
          .join('\n')
      : 'Hiện tại dữ liệu xe đang được cập nhật.';

    const frontendUrl = process.env.FRONTEND_URL || 'https://luxe-ver2-0.vercel.app';

    const systemPrompt = `Bạn là Trợ Lý AI VIP Concierge độc quyền của showroom siêu xe Luxe Motors.

MỤC TIÊU DUY NHẤT:
- Chỉ hỗ trợ câu hỏi thuộc phạm vi: Siêu xe, các thương hiệu siêu xe (Ferrari, Lamborghini, Rolls-Royce, Porsche, Bentley, McLaren, Bugatti,...), giá bán xe, thông số kỹ thuật, dịch vụ bảo hành, quy trình đặt lịch xem xe & cọc xe tại Luxe Motors.

QUY TẮC PHẠM VI BẮT BUỘC (STRICT SCOPE BOUNDARY):
1. Tuyệt đối KHÔNG trả lời các chủ đề ngoài phạm vi siêu xe & showroom (như bóng đá, thời tiết, công nghệ chung, v.v.).
2. Khi khách hàng hỏi bất kỳ câu hỏi nào ngoài phạm vi siêu xe & Luxe Motors, hãy từ chối nhẹ nhàng, lịch sự và hướng khách hàng quay lại chủ đề siêu xe. Ví dụ:
   "Quý khách thông cảm, em chỉ được đào tạo chuyên sâu về lĩnh vực siêu xe và dịch vụ VIP tại Luxe Motors. Tuy nhiên, nếu quý khách có bất kỳ thắc mắc nào về bộ sưu tập siêu xe, giá bán, hay trải nghiệm lái thử, em rất sẵn lòng hỗ trợ ạ!"

QUY TẮC BẢO MẬT TUYỆT ĐỐI (STRICT PRIVACY & SECURITY SHIELD):
1. TUYỆT ĐỐI KHÔNG TIẾT LỘ mật khẩu, tài khoản đăng nhập, email người dùng khác, thông tin admin, token hay dữ liệu hệ thống dưới bất kỳ hình thức nào.
2. Nếu hỏi mật khẩu/tài khoản admin, trả lời:
   "Vì lý do bảo mật an toàn thông tin, em không thể chia sẻ dữ liệu hệ thống hoặc thông tin cá nhân. Em chỉ hỗ trợ tư vấn các mẫu siêu xe cho quý khách ạ."

DANH SÁCH SIÊU XE VÀ GIÁ BÁN THỰC TẾ TRONG KHO (MONGODB LIVE DATA):
${carDataSummary}

THÔNG TIN SHOWROOM:
- Địa chỉ: 18 Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội
- Hotline VIP Concierge (24/7): 0372 950 720

HƯỚNG DẪN ĐẶT LỊCH & CHỐT ĐƠN:
- Khi khách hàng hỏi hoặc có nhu cầu đặt lịch xem xe, lái thử, tư vấn riêng hoặc chốt đơn: Bạn hướng dẫn khách hàng để lại Họ tên & Số điện thoại trực tiếp tại khung chat, HOẶC đính kèm trực tiếp đường link sau vào câu trả lời: ${frontendUrl}/contact
- Ví dụ trả lời: "Để đặt lịch xem xe hoặc chốt đơn, quý khách vui lòng để lại Họ tên và Số điện thoại ngay tại đây, hoặc truy cập đường link: ${frontendUrl}/contact để chuyên viên Concierge hỗ trợ nhanh nhất ạ."
- Khi phát hiện trong hội thoại khách hàng có để lại số điện thoại (ví dụ: 0988..., 0903...), đính kèm thẻ JSON ẩn ở cuối:
[LEAD:{"name":"Khách VIP","phone":"SĐT_KHÁCH","interest":"Đặt lịch xem xe"}]`;

    // Gửi yêu cầu đến Groq
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.3,
      max_tokens: 512,
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Groq/AI Error:", error?.message || error);

    // Fallback thông minh & lịch sự dành cho Khách VIP
    const fallbackReply = `Kính chào quý khách. Hệ thống tư vấn tự động AI đang được bảo trì định kỳ. Quý khách vui lòng kết nối trực tiếp với Chuyên viên Concierge VIP qua **Hotline / Zalo: 0372 950 720** hoặc để lại lời nhắn tại trang [Liên Hệ](${process.env.FRONTEND_URL || 'https://luxe-ver2-0.vercel.app'}/contact) để được phục vụ ngay lập tức ạ!`;

    return res.status(200).json({
      success: true,
      reply: fallbackReply,
      isFallback: true,
    });
  }
};

module.exports = {
  chatWithAI,
};