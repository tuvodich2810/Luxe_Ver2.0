const expressAsyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const { created, ok, badRequest, notFound } = require('../utils/apiResponse');

const createContact = expressAsyncHandler(async (req, res) => {
  const { name, email, phone, message, interest, car } = req.body;

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
    interest: interest || '',
    car: car || '',
  });
  return created(res, 'Liên hệ của bạn đã được gửi thành công.', contact);
});

const getAllContacts = expressAsyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort('-createdAt');
  return ok(res, 'Lấy danh sách liên hệ thành công', contacts);
});

const getContactById = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return notFound(res, 'Không tìm thấy liên hệ này');
  return ok(res, 'Lấy liên hệ thành công', contact);
});

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
};
