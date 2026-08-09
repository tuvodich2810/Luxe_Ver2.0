const expressAsyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
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
  return created(res, 'Liên hệ của bạn đã được gửi thành công.', contact);
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
  const { status } = req.body;
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
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

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};
