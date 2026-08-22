const express = require('express');
const router = express.Router();
const {
  getItemMatches,
  getUserDashboardMatches,
  compareTwoItems,
} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

// Get matches for specific item (Public/Auth)
router.get('/:itemId', getItemMatches);

// Get matches for logged in user's active posts (Private)
router.get('/user/dashboard', protect, getUserDashboardMatches);

// Compare two specific items directly (Public)
router.post('/compare', compareTwoItems);

module.exports = router;
