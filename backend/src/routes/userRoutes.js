const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getCampusStats,
  createClaim,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/stats/campus', getCampusStats);
router.post('/claims', protect, createClaim);

module.exports = router;
