const express = require('express');
const { getMyPurchases, getAllPurchases, getAdminStats } = require('../controllers/purchaseController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, getMyPurchases);
router.get('/', protect, adminOnly, getAllPurchases);
router.get('/admin/stats', protect, adminOnly, getAdminStats);

module.exports = router;
