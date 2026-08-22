const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Please specify if the item is lost or found'],
      enum: ['lost', 'found'],
      default: 'lost',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Electronics',
        'Identity & Cards',
        'Keys',
        'Books & Stationery',
        'Bags & Wallets',
        'Clothing & Footwear',
        'Accessories & Jewelry',
        'Sports & Fitness',
        'Bottles & Flasks',
        'Other',
      ],
    },
    location: {
      type: String,
      required: [true, 'Please select a campus location/zone'],
      enum: [
        'Central Library',
        'Main Cafeteria & Food Court',
        'Engineering Block (Block A)',
        'Science & Tech Block (Block B)',
        'Business & Arts Wing (Block C)',
        'Student Activity Center (SAC)',
        'Main Auditorium',
        'Sports Complex & Gym',
        'Hostel Zone (North/South)',
        'Campus Shuttle / Bus Bay',
        'Computer Labs & Server Hub',
        'Administrative Block',
        'Other Campus Area',
      ],
    },
    specificLocation: {
      type: String,
      trim: true,
      maxlength: [150, 'Specific location description too long'],
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Please provide the date when the item was lost/found'],
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description of the item'],
      maxlength: [1500, 'Description cannot exceed 1500 characters'],
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      trim: true,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          default: '',
        },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'resolved', 'claimed'],
      default: 'active',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactPreference: {
      type: String,
      enum: ['email', 'phone', 'whatsapp', 'in_app'],
      default: 'in_app',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      trim: true,
      default: '',
    },
    reward: {
      type: String,
      trim: true,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
    resolvedWithItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for fast keyword lookup
itemSchema.index({
  title: 'text',
  description: 'text',
  specificLocation: 'text',
  brand: 'text',
  color: 'text',
  tags: 'text',
});

// Normal index for queries
itemSchema.index({ type: 1, category: 1, location: 1, status: 1, date: -1 });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
