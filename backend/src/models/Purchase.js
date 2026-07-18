const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Card', 'Cash', 'Financing'],
      default: 'Card',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Paid',
    },
    status: {
      type: String,
      enum: ['Completed', 'Cancelled'],
      default: 'Completed',
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
