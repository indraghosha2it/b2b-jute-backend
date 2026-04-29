// const mongoose = require('mongoose');

// const intervalSchema = new mongoose.Schema({
//   delay: {
//     type: Number,
//     required: true,
//     min: 0
//   }
// }, { _id: false });

// const promotionalProductSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   tag: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   order: {
//     type: Number,
//     default: 0
//   }
// }, { _id: false });

// const promotionalSettingSchema = new mongoose.Schema({
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   products: [promotionalProductSchema],
//   intervals: {
//     type: [intervalSchema],
//     default: [{ delay: 5 }, { delay: 15 }, { delay: 15 }]
//   },
//   maxShows: {
//     type: Number,
//     default: 3,
//     min: 1,
//     max: 10
//   }
// }, {
//   timestamps: true
// });

// // Add an index for better query performance
// promotionalSettingSchema.index({ isActive: 1 });

// module.exports = mongoose.model('PromotionalSetting', promotionalSettingSchema);

const mongoose = require('mongoose');

const promotionalSettingSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  tag: {
    type: String,
    required: true,
    trim: true
  },
  intervals: {
    type: [{
      delay: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    default: [{ delay: 5 }, { delay: 15 }, { delay: 15 }]
  },
  maxShows: {
    type: Number,
    default: 3,
    min: 1,
    max: 10
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for better query performance
promotionalSettingSchema.index({ isActive: 1 });
promotionalSettingSchema.index({ order: 1 });

module.exports = mongoose.model('PromotionalSetting', promotionalSettingSchema);