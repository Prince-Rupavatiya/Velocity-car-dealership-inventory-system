const express = require('express');
const {
  createVehicle,
  getVehicles,
  searchVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { purchaseVehicle, restockVehicle } = require('../controllers/inventoryController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// NOTE: /search must be declared before the /:id route, otherwise
// Express would try to treat "search" as an :id value.
router.get('/search', protect, searchVehicles);

router.route('/')
  .get(protect, getVehicles)
  .post(protect, adminOnly, createVehicle);

router.route('/:id')
  .get(protect, getVehicleById)
  .put(protect, adminOnly, updateVehicle)
  .delete(protect, adminOnly, deleteVehicle);

router.post('/:id/purchase', protect, purchaseVehicle);
router.post('/:id/restock', protect, adminOnly, restockVehicle);

module.exports = router;
