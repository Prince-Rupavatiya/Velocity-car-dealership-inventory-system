const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const Purchase = require('../models/Purchase');
const Restock = require('../models/Restock');
const InventoryLog = require('../models/InventoryLog');

/**
 * POST /api/vehicles/:id/purchase
 * Purchases a vehicle, decreasing its quantity. Body: { quantity, paymentMethod }
 */
const purchaseVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quantity = Number(req.body.quantity) || 1;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (vehicle.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${vehicle.quantity} unit(s) available`,
      });
    }

    vehicle.quantity -= quantity;
    await vehicle.save();

    const totalPrice = vehicle.price * quantity;
    const invoiceNumber = `INV-${Date.now()}`;

    const purchase = await Purchase.create({
      vehicleId: vehicle._id,
      userId: req.user._id,
      quantity,
      price: vehicle.price,
      totalPrice,
      paymentMethod: req.body.paymentMethod || 'Card',
      paymentStatus: 'Paid',
      status: 'Completed',
      invoiceNumber,
    });

    await InventoryLog.create({
      vehicleId: vehicle._id,
      action: 'purchase',
      quantity,
      performedBy: req.user._id,
      remarks: `${quantity} unit(s) purchased. Invoice ${invoiceNumber}`,
    });

    res.status(201).json({
      success: true,
      message: 'Purchase completed successfully',
      purchase,
      remainingStock: vehicle.quantity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/vehicles/:id/restock
 * Restocks a vehicle, increasing its quantity. Admin only. Body: { quantity, supplier, reason }
 */
const restockVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quantityAdded = Number(req.body.quantity);

    if (!quantityAdded || quantityAdded <= 0) {
      return res.status(400).json({ success: false, message: 'quantity must be a positive number' });
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const previousStock = vehicle.quantity;
    vehicle.quantity += quantityAdded;
    await vehicle.save();

    const restock = await Restock.create({
      vehicleId: vehicle._id,
      adminId: req.user._id,
      quantityAdded,
      previousStock,
      newStock: vehicle.quantity,
      reason: req.body.reason || 'Restock',
      supplier: req.body.supplier || 'N/A',
    });

    await InventoryLog.create({
      vehicleId: vehicle._id,
      action: 'restock',
      quantity: quantityAdded,
      performedBy: req.user._id,
      remarks: `Stock increased from ${previousStock} to ${vehicle.quantity}`,
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle restocked successfully',
      restock,
      newStock: vehicle.quantity,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { purchaseVehicle, restockVehicle };
