const express = require('express');
const router = express.Router();
const {
  getAllAppointments, getMyAppointments,
  createAppointment, updateAppointmentStatus, cancelAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

router.get('/', protect, adminOnly, getAllAppointments);
router.get('/my', protect, getMyAppointments);
router.post('/', protect, createAppointment);
router.put('/:id', protect, adminOnly, updateAppointmentStatus);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;