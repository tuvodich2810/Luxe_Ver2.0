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

    // Gửi yêu cầu đến Groq
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Bạn là trợ lý AI của Luxe Motors. Hãy trả lời bằng tiếng Việt, lịch sự, ngắn gọn và hỗ trợ khách hàng về các dòng xe, giá bán, đặt lịch xem xe và thông tin đại lý.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Groq Error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể kết nối đến AI.",
      error: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};