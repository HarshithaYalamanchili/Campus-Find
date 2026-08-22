/**
 * CampusFind Intelligent Multi-Factor Matching Algorithm
 * Evaluates candidate items against target item using weighted factors:
 * - Category Match (35%)
 * - Semantic / Keyword Similarity (30%)
 * - Campus Location Proximity (20%)
 * - Date Proximity (15%)
 *
 * Generates an accurate normalized match score (0 - 100%).
 */

// Common English and campus stop words to filter out for clean tokenization
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn', 'it', 'its', 'itself', 'just', 'lost', 'found',
  'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would',
  'you', 'your', 'yours', 'yourself', 'yourselves', 'item', 'please', 'help', 'contact', 'yesterday',
  'today', 'near', 'around', 'floor', 'desk', 'room', 'block', 'campus', 'college'
]);

// Category correlation groups
const CATEGORY_GROUPS = [
  ['Electronics', 'Accessories & Jewelry'],
  ['Bags & Wallets', 'Accessories & Jewelry'],
  ['Books & Stationery', 'Identity & Cards'],
  ['Clothing & Footwear', 'Sports & Fitness'],
];

/**
 * Tokenize and normalize text into unique meaningful words
 */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Calculate Jaccard text similarity coefficient between two token lists
 */
function calculateJaccardSimilarity(tokens1, tokens2) {
  if (!tokens1.length || !tokens2.length) return { score: 0, shared: [] };

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  const shared = [];
  set1.forEach(token => {
    if (set2.has(token)) {
      shared.push(token);
    }
  });

  const unionSize = new Set([...tokens1, ...tokens2]).size;
  const jaccard = unionSize > 0 ? shared.length / unionSize : 0;

  return { score: jaccard, shared };
}

/**
 * 1. Category Score (Max 35 points)
 */
function calculateCategoryScore(cat1, cat2) {
  if (!cat1 || !cat2) return 0;
  if (cat1.toLowerCase() === cat2.toLowerCase()) {
    return 35;
  }

  // Check if categories belong to related groups
  const isRelated = CATEGORY_GROUPS.some(
    group => group.includes(cat1) && group.includes(cat2)
  );

  return isRelated ? 15 : 0;
}

/**
 * 2. Keyword & Text Similarity Score (Max 30 points)
 */
function calculateKeywordScore(itemA, itemB) {
  // Title tokens (heaviest weight)
  const titleTokensA = tokenize(itemA.title);
  const titleTokensB = tokenize(itemB.title);
  const titleMatch = calculateJaccardSimilarity(titleTokensA, titleTokensB);

  // Description and tag tokens
  const fullTextA = [
    itemA.title,
    itemA.description,
    itemA.brand,
    itemA.color,
    ...(itemA.tags || [])
  ].join(' ');

  const fullTextB = [
    itemB.title,
    itemB.description,
    itemB.brand,
    itemB.color,
    ...(itemB.tags || [])
  ].join(' ');

  const fullTokensA = tokenize(fullTextA);
  const fullTokensB = tokenize(fullTextB);
  const fullMatch = calculateJaccardSimilarity(fullTokensA, fullTokensB);

  // Specific brand / color exact bonuses
  let bonus = 0;
  if (itemA.brand && itemB.brand && itemA.brand.toLowerCase() === itemB.brand.toLowerCase()) {
    bonus += 8;
  }
  if (itemA.color && itemB.color && itemA.color.toLowerCase() === itemB.color.toLowerCase()) {
    bonus += 5;
  }

  // Combined score out of 30
  // Title match is weighted 60%, full text match 40% + bonus
  const baseKeywordScore = (titleMatch.score * 18) + (fullMatch.score * 12);
  const rawScore = baseKeywordScore + bonus;

  return {
    score: Math.min(30, Math.round(rawScore)),
    sharedKeywords: Array.from(new Set([...titleMatch.shared, ...fullMatch.shared]))
  };
}

/**
 * 3. Location Proximity Score (Max 20 points)
 */
function calculateLocationScore(itemA, itemB) {
  if (!itemA.location || !itemB.location) return { score: 0, isMatch: false };

  // Exact primary campus location
  if (itemA.location.toLowerCase() === itemB.location.toLowerCase()) {
    let score = 20;

    // Extra bonus if specific locations also match or share tokens
    if (itemA.specificLocation && itemB.specificLocation) {
      const locTokensA = tokenize(itemA.specificLocation);
      const locTokensB = tokenize(itemB.specificLocation);
      const specMatch = calculateJaccardSimilarity(locTokensA, locTokensB);
      if (specMatch.shared.length > 0) {
        score = 20; // Maximum location score
      }
    }
    return { score, isMatch: true };
  }

  // Check specific location text overlap even if primary dropdown differed slightly
  if (itemA.specificLocation && itemB.specificLocation) {
    const locTokensA = tokenize(itemA.specificLocation);
    const locTokensB = tokenize(itemB.specificLocation);
    const specMatch = calculateJaccardSimilarity(locTokensA, locTokensB);
    if (specMatch.shared.length > 0) {
      return { score: Math.round(specMatch.score * 12), isMatch: false };
    }
  }

  return { score: 0, isMatch: false };
}

/**
 * 4. Date Proximity Score (Max 15 points)
 */
function calculateDateScore(dateA, dateB, typeA, typeB) {
  if (!dateA || !dateB) return { score: 5, daysDiff: 0 };

  const dA = new Date(dateA);
  const dB = new Date(dateB);

  // Difference in calendar days
  const diffTime = Math.abs(dB.getTime() - dA.getTime());
  const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let score = 0;

  if (daysDiff === 0) {
    score = 15; // Same day match
  } else if (daysDiff <= 2) {
    score = 13;
  } else if (daysDiff <= 5) {
    score = 10;
  } else if (daysDiff <= 10) {
    score = 7;
  } else if (daysDiff <= 20) {
    score = 4;
  } else {
    score = 1;
  }

  // If lost item date is strictly WAY after found item date (> 3 days), penalize slightly
  if (typeA === 'lost' && typeB === 'found' && dA > dB && daysDiff > 3) {
    score = Math.max(0, score - 5);
  }

  return { score, daysDiff };
}

/**
 * Compute Match Score between a target item and a candidate item
 */
function evaluateItemMatch(targetItem, candidateItem) {
  // Ensure we compare opposite types: lost <-> found
  // (or compare two items regardless if type is not strictly opposite)
  const categoryScore = calculateCategoryScore(targetItem.category, candidateItem.category);
  const { score: keywordScore, sharedKeywords } = calculateKeywordScore(targetItem, candidateItem);
  const { score: locationScore, isMatch: locationMatch } = calculateLocationScore(targetItem, candidateItem);
  const { score: dateScore, daysDiff } = calculateDateScore(
    targetItem.date,
    candidateItem.date,
    targetItem.type,
    candidateItem.type
  );

  const totalScore = categoryScore + keywordScore + locationScore + dateScore;
  const matchScore = Math.min(100, Math.max(0, Math.round(totalScore)));

  let confidence = 'Low';
  if (matchScore >= 75) {
    confidence = 'High';
  } else if (matchScore >= 50) {
    confidence = 'Medium';
  }

  return {
    matchScore,
    confidence,
    breakdown: {
      categoryScore,
      keywordScore,
      locationScore,
      dateScore,
      sharedKeywords,
      locationMatch,
      daysDiff,
    },
    candidateItem,
  };
}

/**
 * Find and rank matches for a target item among a list of candidates
 */
function findMatches(targetItem, candidates, minScore = 30, limit = 10) {
  // Default opposite type: if target is 'lost', search 'found', and vice-versa
  const targetOppositeType = targetItem.type === 'lost' ? 'found' : 'lost';

  const scoredList = candidates
    .filter(candidate => {
      // Don't compare with self
      if (candidate._id && targetItem._id && candidate._id.toString() === targetItem._id.toString()) {
        return false;
      }
      // Prefer opposite types, or active status
      return candidate.type === targetOppositeType && candidate.status !== 'resolved';
    })
    .map(candidate => evaluateItemMatch(targetItem, candidate))
    .filter(result => result.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return scoredList;
}

module.exports = {
  evaluateItemMatch,
  findMatches,
  tokenize,
};
