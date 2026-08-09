const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, updateUserStatus, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

router.get('/', protect, adminOnly, getUsers);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.put('/:id/status', protect, adminOnly, updateUserStatus);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
