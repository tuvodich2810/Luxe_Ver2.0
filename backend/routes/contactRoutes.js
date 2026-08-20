const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  seedContacts,
} = require('../controllers/contactController');

const { protect } = require('../middlewares/authMiddleware');
const { staffOnly } = require('../middlewares/adminMiddleware');

// Route công khai gửi liên hệ & seed dữ liệu
router.post('/', createContact);
router.post('/seed', seedContacts);

// Routes dành riêng cho nhân sự nội bộ (Admin, Giám đốc, Quản lý, Sales, CSKH)
router.get('/', protect, staffOnly, getAllContacts);
router.get('/:id', protect, staffOnly, getContactById);
router.put('/:id', protect, staffOnly, updateContactStatus);
router.delete('/:id', protect, staffOnly, deleteContact);

module.exports = router;

