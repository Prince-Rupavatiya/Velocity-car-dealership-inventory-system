const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    action: {
      type: String,
      enum: ['purchase', 'restock', 'create', 'update', 'delete'],
      required: true,
    },
    quantity: Number,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
