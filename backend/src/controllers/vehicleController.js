const Vehicle = require('../models/Vehicle');
const InventoryLog = require('../models/InventoryLog');

/**
 * POST /api/vehicles
 * Adds a new vehicle to inventory. Admin only.
 */
const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, createdBy: req.user._id });

    await InventoryLog.create({
      vehicleId: vehicle._id,
      action: 'create',
      quantity: vehicle.quantity,
      performedBy: req.user._id,
      remarks: `Vehicle ${vehicle.make} ${vehicle.model} added to inventory`,
    });

    res.status(201).json({ success: true, message: 'Vehicle added successfully', vehicle });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vehicles
 * Lists all vehicles, with optional pagination via ?page=&limit=
 */
const getVehicles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const [vehicles, total] = await Promise.all([
      Vehicle.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Vehicle.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vehicles/search
 * Filters vehicles by make, model, category, or price range.
 * Query params: make, model, category, minPrice, maxPrice, fuelType, transmission, q
 */
const searchVehicles = async (req, res, next) => {
  try {
    const { make, model, category, minPrice, maxPrice, fuelType, transmission, q } = req.query;
    const filter = {};

    if (make) filter.make = new RegExp(make, 'i');
    if (model) filter.model = new RegExp(model, 'i');
    if (category) filter.category = category;
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (q) {
      filter.$or = [
        { make: new RegExp(q, 'i') },
        { model: new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') },
      ];
    }

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: vehicles.length, vehicles });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vehicles/:id
 * Fetches a single vehicle by id.
 */
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, vehicle });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/vehicles/:id
 * Updates a vehicle's details. Admin only.
 */
const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await InventoryLog.create({
      vehicleId: vehicle._id,
      action: 'update',
      performedBy: req.user._id,
      remarks: `Vehicle ${vehicle.make} ${vehicle.model} updated`,
    });

    res.status(200).json({ success: true, message: 'Vehicle updated successfully', vehicle });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/vehicles/:id
 * Removes a vehicle from inventory. Admin only.
 */
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await InventoryLog.create({
      vehicleId: vehicle._id,
      action: 'delete',
      performedBy: req.user._id,
      remarks: `Vehicle ${vehicle.make} ${vehicle.model} removed from inventory`,
    });

    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  searchVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
