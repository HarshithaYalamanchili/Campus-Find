const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  markResolved,
  getMyItems,
  getRecentItems,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getItems);
router.get('/feed/recent', getRecentItems);
router.get('/:id', getItemById);

// Protected routes
router.post('/', protect, upload.array('images', 4), createItem);
router.put('/:id', protect, upload.array('images', 4), updateItem);
router.delete('/:id', protect, deleteItem);
router.patch('/:id/status', protect, markResolved);
router.get('/user/me', protect, getMyItems);

module.exports = router;
