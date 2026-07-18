const Purchase = require('../models/Purchase');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

/**
 * GET /api/purchases/my
 * Returns the authenticated user's own purchase history.
 */
const getMyPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find({ userId: req.user._id })
      .populate('vehicleId', 'make model image')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: purchases.length, purchases });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/purchases (admin)
 * Returns all purchases across the platform.
 */
const getAllPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find()
      .populate('vehicleId', 'make model image')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: purchases.length, purchases });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/stats (admin)
 * Aggregate dashboard numbers: total vehicles, total sales, revenue, customers.
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [totalVehicles, availableVehicles, totalCustomers, purchases] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ quantity: { $gt: 0 } }),
      User.countDocuments({ role: 'user' }),
      Purchase.find(),
    ]);

    const totalSales = purchases.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + p.totalPrice, 0);

    const inventoryValueAgg = await Vehicle.aggregate([
      { $group: { _id: null, value: { $sum: { $multiply: ['$price', '$quantity'] } } } },
    ]);
    const inventoryValue = inventoryValueAgg[0]?.value || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalVehicles,
        availableVehicles,
        totalSales,
        totalRevenue,
        totalCustomers,
        inventoryValue,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyPurchases, getAllPurchases, getAdminStats };
