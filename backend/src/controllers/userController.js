const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');

// @desc    Get user profile & activity stats
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const totalLost = await Item.countDocuments({ postedBy: user._id, type: 'lost' });
    const totalFound = await Item.countDocuments({ postedBy: user._id, type: 'found' });
    const totalResolved = await Item.countDocuments({
      postedBy: user._id,
      status: 'resolved',
    });

    res.status(200).json({
      success: true,
      user,
      stats: {
        totalLost,
        totalFound,
        totalResolved,
        totalPosts: totalLost + totalFound,
        recoveryRate: totalLost + totalFound > 0 ? Math.round((totalResolved / (totalLost + totalFound)) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, whatsapp, studentId, department, avatar } = req.body;

    user.name = name || user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    user.whatsapp = whatsapp !== undefined ? whatsapp : user.whatsapp;
    user.studentId = studentId !== undefined ? studentId : user.studentId;
    user.department = department || user.department;
    user.avatar = avatar || user.avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        whatsapp: updatedUser.whatsapp,
        studentId: updatedUser.studentId,
        department: updatedUser.department,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Campus-wide Dashboard statistics
// @route   GET /api/users/stats/campus
// @access  Public
exports.getCampusStats = async (req, res, next) => {
  try {
    const totalItems = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ type: 'lost', status: 'active' });
    const foundItems = await Item.countDocuments({ type: 'found', status: 'active' });
    const resolvedItems = await Item.countDocuments({ status: 'resolved' });
    const totalUsers = await User.countDocuments();

    const recoveryRate =
      totalItems > 0 ? Math.round((resolvedItems / totalItems) * 100) : 84;

    res.status(200).json({
      success: true,
      stats: {
        totalItems,
        lostItems,
        foundItems,
        resolvedItems,
        totalUsers,
        recoveryRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit claim / contact message for an item
// @route   POST /api/users/claims
// @access  Private
exports.createClaim = async (req, res, next) => {
  try {
    const { itemId, message, contactPhone, proofDetails } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit a claim on your own post',
      });
    }

    const claim = await Claim.create({
      item: itemId,
      sender: req.user._id,
      recipient: item.postedBy,
      message,
      contactPhone: contactPhone || req.user.phone || '',
      proofDetails: proofDetails || '',
    });

    res.status(201).json({
      success: true,
      message: 'Claim inquiry sent successfully to the poster',
      claim,
    });
  } catch (error) {
    next(error);
  }
};
