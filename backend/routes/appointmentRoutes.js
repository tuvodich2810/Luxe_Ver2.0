const express = require('express');
const router = express.Router();
const {
  getAllAppointments, getMyAppointments,
  createAppointment, updateAppointmentStatus, cancelAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');
const { staffOnly } = require('../middlewares/adminMiddleware');

const { validateAppointmentInput } = require('../utils/validators');

router.get('/', protect, staffOnly, getAllAppointments);
router.get('/my', protect, getMyAppointments);
router.post('/', protect, validateAppointmentInput, createAppointment);
router.put('/:id', protect, staffOnly, updateAppointmentStatus);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;