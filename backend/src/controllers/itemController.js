const Item = require('../models/Item');
const User = require('../models/User');

// @desc    Get all items with search, filters, pagination
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res, next) => {
  try {
    const {
      type,
      category,
      location,
      status,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by type ('lost' or 'found')
    if (type) {
      query.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by location
    if (location && location !== 'All') {
      query.location = location;
    }

    // Filter by status ('active', 'resolved')
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search keyword query
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { specificLocation: searchRegex },
        { brand: searchRegex },
        { color: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'date_lost_desc') {
      sortOptions = { date: -1 };
    } else if (sort === 'date_lost_asc') {
      sortOptions = { date: 1 };
    } else if (sort === 'views') {
      sortOptions = { viewsCount: -1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('postedBy', 'name email phone avatar studentId department')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'postedBy',
      'name email phone whatsapp avatar studentId department'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Increment views count
    item.viewsCount = (item.viewsCount || 0) + 1;
    await item.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new item post
// @route   POST /api/items
// @access  Private
exports.createItem = async (req, res, next) => {
  try {
    const {
      title,
      type,
      category,
      location,
      specificLocation,
      date,
      description,
      brand,
      color,
      tags,
      contactPreference,
      contactPhone,
      contactEmail,
      reward,
    } = req.body;

    // Process uploaded images
    const images = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        // If Cloudinary is used, file.path contains Cloudinary URL
        // If local storage is used, construct relative URL
        const imageUrl = file.path.startsWith('http')
          ? file.path
          : `/uploads/${file.filename}`;

        images.push({
          url: imageUrl,
          public_id: file.filename || '',
        });
      });
    } else if (req.body.imageUrl) {
      // Fallback if an image URL was passed directly
      images.push({
        url: req.body.imageUrl,
        public_id: '',
      });
    } else {
      // Default placeholder according to category
      const placeholderImg = `https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80`;
      images.push({
        url: placeholderImg,
        public_id: '',
      });
    }

    // Parse tags if string
    let parsedTags = [];
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    const item = await Item.create({
      title,
      type: type || 'lost',
      category,
      location,
      specificLocation: specificLocation || '',
      date: date ? new Date(date) : new Date(),
      description,
      brand: brand || '',
      color: color || '',
      tags: parsedTags,
      images,
      postedBy: req.user._id,
      contactPreference: contactPreference || 'in_app',
      contactPhone: contactPhone || req.user.phone || '',
      contactEmail: contactEmail || req.user.email || '',
      reward: reward || '',
      status: 'active',
    });

    // Update user stats
    const updateField =
      item.type === 'lost' ? 'itemsLostCount' : 'itemsFoundCount';
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { [updateField]: 1 },
    });

    const populatedItem = await Item.findById(item._id).populate(
      'postedBy',
      'name email phone avatar studentId department'
    );

    res.status(201).json({
      success: true,
      message: `${item.type === 'lost' ? 'Lost' : 'Found'} item posted successfully`,
      item: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an item post
// @route   PUT /api/items/:id
// @access  Private (Owner only)
exports.updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Ensure user is the item owner or admin
    if (
      item.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this item',
      });
    }

    const updates = { ...req.body };

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path.startsWith('http') ? file.path : `/uploads/${file.filename}`,
        public_id: file.filename || '',
      }));
      updates.images = [...(item.images || []), ...newImages];
    }

    // Parse tags if provided
    if (typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    item = await Item.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('postedBy', 'name email phone avatar studentId department');

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an item post
// @route   DELETE /api/items/:id
// @access  Private (Owner only)
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Ensure user is item owner or admin
    if (
      item.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this item',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item status (resolved / active)
// @route   PATCH /api/items/:id/status
// @access  Private (Owner only)
exports.markResolved = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (
      item.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this item',
      });
    }

    const { status, resolvedWithItemId } = req.body;
    const newStatus = status || (item.status === 'resolved' ? 'active' : 'resolved');

    item.status = newStatus;
    item.resolvedAt = newStatus === 'resolved' ? new Date() : null;

    if (resolvedWithItemId) {
      item.resolvedWithItem = resolvedWithItemId;
    }

    await item.save();

    // Increment user resolved count if marked resolved
    if (newStatus === 'resolved') {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { itemsResolvedCount: 1 },
      });
    }

    res.status(200).json({
      success: true,
      message: `Item marked as ${newStatus}`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's posted items
// @route   GET /api/items/user/me
// @access  Private
exports.getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ postedBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent lost & found items for landing page / ticker
// @route   GET /api/items/feed/recent
// @access  Public
exports.getRecentItems = async (req, res, next) => {
  try {
    const recentLost = await Item.find({ type: 'lost', status: 'active' })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('postedBy', 'name avatar');

    const recentFound = await Item.find({ type: 'found', status: 'active' })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('postedBy', 'name avatar');

    res.status(200).json({
      success: true,
      recentLost,
      recentFound,
    });
  } catch (error) {
    next(error);
  }
};
