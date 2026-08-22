const Item = require('../models/Item');
const { evaluateItemMatch, findMatches } = require('../utils/matchingEngine');

// @desc    Get smart match recommendations for a specific item
// @route   GET /api/matches/:itemId
// @access  Public
exports.getItemMatches = async (req, res, next) => {
  try {
    const targetItem = await Item.findById(req.params.itemId).populate(
      'postedBy',
      'name email phone avatar studentId department'
    );

    if (!targetItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Find candidate items of opposite type (e.g. if target is lost, find found items)
    const oppositeType = targetItem.type === 'lost' ? 'found' : 'lost';
    const candidates = await Item.find({
      type: oppositeType,
      status: 'active',
      _id: { $ne: targetItem._id },
    }).populate('postedBy', 'name email phone avatar studentId department');

    const matches = findMatches(targetItem, candidates, 20, 10);

    // Format matches with "Possible Match: XX%"
    const formattedMatches = matches.map((match) => ({
      item: match.candidateItem,
      matchScore: match.matchScore,
      matchLabel: `Possible Match: ${match.matchScore}%`,
      confidence: match.confidence,
      breakdown: match.breakdown,
    }));

    res.status(200).json({
      success: true,
      targetItem: {
        _id: targetItem._id,
        title: targetItem.title,
        type: targetItem.type,
        category: targetItem.category,
        location: targetItem.location,
        date: targetItem.date,
      },
      count: formattedMatches.length,
      matches: formattedMatches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get matches for all of the logged-in user's active posts
// @route   GET /api/matches/user/dashboard
// @access  Private
exports.getUserDashboardMatches = async (req, res, next) => {
  try {
    const userItems = await Item.find({
      postedBy: req.user._id,
      status: 'active',
    });

    if (!userItems.length) {
      return res.status(200).json({
        success: true,
        matches: [],
      });
    }

    // Fetch all active items of other users
    const otherItems = await Item.find({
      postedBy: { $ne: req.user._id },
      status: 'active',
    }).populate('postedBy', 'name email phone avatar studentId department');

    const dashboardMatches = [];

    userItems.forEach((userItem) => {
      const oppositeCandidates = otherItems.filter(
        (other) => other.type !== userItem.type
      );

      const itemMatches = findMatches(userItem, oppositeCandidates, 45, 3);

      itemMatches.forEach((match) => {
        dashboardMatches.push({
          myPost: {
            _id: userItem._id,
            title: userItem.title,
            type: userItem.type,
            category: userItem.category,
            location: userItem.location,
            date: userItem.date,
            images: userItem.images,
          },
          matchedItem: match.candidateItem,
          matchScore: match.matchScore,
          matchLabel: `Possible Match: ${match.matchScore}%`,
          confidence: match.confidence,
          breakdown: match.breakdown,
        });
      });
    });

    // Sort by highest match score
    dashboardMatches.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: dashboardMatches.length,
      matches: dashboardMatches.slice(0, 8),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare two specific items directly
// @route   POST /api/matches/compare
// @access  Public
exports.compareTwoItems = async (req, res, next) => {
  try {
    const { itemAId, itemBId } = req.body;

    const itemA = await Item.findById(itemAId).populate(
      'postedBy',
      'name email phone avatar'
    );
    const itemB = await Item.findById(itemBId).populate(
      'postedBy',
      'name email phone avatar'
    );

    if (!itemA || !itemB) {
      return res.status(404).json({
        success: false,
        message: 'One or both items not found',
      });
    }

    const evaluation = evaluateItemMatch(itemA, itemB);

    res.status(200).json({
      success: true,
      itemA,
      itemB,
      matchScore: evaluation.matchScore,
      matchLabel: `Possible Match: ${evaluation.matchScore}%`,
      confidence: evaluation.confidence,
      breakdown: evaluation.breakdown,
    });
  } catch (error) {
    next(error);
  }
};
