const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'ORDER_CREATED',
        'DEPOSIT_SUCCESS',
        'ORDER_STATUS_CHANGED',
        'RESERVATION_EXPIRING',
        'APPOINTMENT_CREATED',
        'APPOINTMENT_UPDATED',
        'CONTACT_RECEIVED',
        'CONTACT_REPLY',
      ],
      index: true,
    },
    channel: {
      type: String,
      required: true,
      enum: ['email', 'zalo'],
      index: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['success', 'failed', 'simulated'],
      default: 'success',
      index: true,
    },
    subject: {
      type: String,
      default: '',
    },
    messageContent: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: null,
    },
    sentAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
