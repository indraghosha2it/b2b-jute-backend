// const PromotionalSetting = require('../models/PromotionalSetting');
// const Product = require('../models/Product');

// // @desc    Get promotional settings
// // @route   GET /api/promotional-settings
// // @access  Private (Admin only)
// const getPromotionalSettings = async (req, res) => {
//   try {
//     let settings = await PromotionalSetting.findOne().populate('products.productId');
    
//     if (!settings) {
//       settings = await PromotionalSetting.create({
//         isActive: true,
//         products: [],
//         intervals: [{ delay: 5 }, { delay: 15 }, { delay: 15 }],
//         maxShows: 3
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: settings
//     });
//   } catch (error) {
//     console.error('Error fetching promotional settings:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Get public promotional data for frontend
// // @route   GET /api/promotional
// // @access  Public
// // @desc    Get public promotional data for frontend
// // @route   GET /api/promotional
// // @access  Public
// // @desc    Get public promotional data for frontend
// // @route   GET /api/promotional
// // @access  Public
// const getPublicPromotionalData = async (req, res) => {
//   try {
//     console.log('Fetching promotional settings...');
    
//     // Populate the productId field with ALL product data
//     const settings = await PromotionalSetting.findOne()
//       .populate({
//         path: 'products.productId',
//         model: 'Product',
//         // Select ALL fields needed for the modal
//         select: 'productName description instruction fabric orderUnit weightPerUnit moq pricePerUnit quantityBasedPricing sizes colors images additionalInfo customizationOptions isFeatured tags metaSettings isActive createdBy views inquiryCount'
//       });
    
//     console.log('Settings found:', settings ? 'Yes' : 'No');
    
//     if (!settings) {
//       console.log('No settings found, returning default');
//       return res.status(200).json({
//         success: true,
//         data: {
//           isActive: false,
//           products: [],
//           intervals: [{ delay: 5 }, { delay: 15 }, { delay: 15 }],
//           maxShows: 3
//         }
//       });
//     }
    
//     if (!settings.isActive) {
//       console.log('Settings are inactive');
//       return res.status(200).json({
//         success: true,
//         data: {
//           isActive: false,
//           products: [],
//           intervals: settings.intervals,
//           maxShows: settings.maxShows
//         }
//       });
//     }
    
//     if (!settings.products || settings.products.length === 0) {
//       console.log('No products in settings');
//       return res.status(200).json({
//         success: true,
//         data: {
//           isActive: settings.isActive,
//           products: [],
//           intervals: settings.intervals,
//           maxShows: settings.maxShows
//         }
//       });
//     }
    
//     // Filter out products that might have been deleted
//     const validProducts = settings.products.filter(p => p.productId !== null);
    
//     if (validProducts.length === 0) {
//       console.log('No valid products after filtering');
//       return res.status(200).json({
//         success: true,
//         data: {
//           isActive: settings.isActive,
//           products: [],
//           intervals: settings.intervals,
//           maxShows: settings.maxShows
//         }
//       });
//     }
    
//     console.log(`Found ${validProducts.length} valid products`);
    
//     // Format response for frontend - include ALL product details
//     const formattedProducts = validProducts.map(item => {
//       const product = item.productId;
//       console.log('Processing product:', product.productName);
      
//       // Format images array - ensure it's always an array of URLs
//       let formattedImages = [];
//       if (product.images && Array.isArray(product.images)) {
//         formattedImages = product.images.map(img => ({
//           url: img.url,
//           publicId: img.publicId,
//           isPrimary: img.isPrimary
//         }));
//       } else if (product.images && typeof product.images === 'object') {
//         formattedImages = [product.images];
//       }
      
//       return {
//         // Basic Info
//         productId: product._id,
//         productName: product.productName || 'Product Name',
//         description: product.description || '',
//         instruction: product.instruction || '',
        
//         // Pricing & MOQ
//         pricePerUnit: product.pricePerUnit || 0,
//         moq: product.moq || 1,
//         quantityBasedPricing: product.quantityBasedPricing || [],
        
//         // Product Details
//         fabric: product.fabric || 'Premium Quality',
//         orderUnit: product.orderUnit || 'piece',
//         weightPerUnit: product.weightPerUnit || null,
        
//         // Variants
//         sizes: product.sizes || [],
//         colors: product.colors || [],
        
//         // Images
//         images: formattedImages,
        
//         // Additional Info
//         additionalInfo: product.additionalInfo || [],
//         customizationOptions: product.customizationOptions || [],
        
//         // Tags & Featured
//         isFeatured: product.isFeatured || false,
//         tags: product.tags || [],
        
//         // Custom tag from promotional settings
//         promoTag: item.tag || 'Special Offer',
        
//         isActive: product.isActive !== undefined ? product.isActive : true
//       };
//     });
    
//     console.log('Formatted products count:', formattedProducts.length);
//     console.log('First product details:', {
//       name: formattedProducts[0]?.productName,
//       price: formattedProducts[0]?.pricePerUnit,
//       imagesCount: formattedProducts[0]?.images?.length,
//       hasSizes: formattedProducts[0]?.sizes?.length > 0,
//       hasColors: formattedProducts[0]?.colors?.length > 0
//     });
    
//     res.status(200).json({
//       success: true,
//       data: {
//         isActive: settings.isActive,
//         products: formattedProducts,
//         intervals: settings.intervals,
//         maxShows: settings.maxShows
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching public promotional data:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Create or update promotional settings
// // @route   POST /api/promotional-settings
// // @access  Private (Admin only)
// const updatePromotionalSettings = async (req, res) => {
//   try {
//     const { isActive, products, intervals, maxShows } = req.body;
    
//     // Validate intervals
//     if (!intervals || intervals.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'At least one interval is required'
//       });
//     }
    
//     // Validate intervals have valid delays
//     for (const interval of intervals) {
//       if (interval.delay === undefined || interval.delay < 0) {
//         return res.status(400).json({
//           success: false,
//           error: 'All intervals must have a valid delay (0 or greater)'
//         });
//       }
//     }
    
//     // Validate products
//     if (products && products.length > 0) {
//       for (const item of products) {
//         if (!item.productId) {
//           return res.status(400).json({
//             success: false,
//             error: 'Each product must have a valid product ID'
//           });
//         }
        
//         if (!item.tag || item.tag.trim() === '') {
//           return res.status(400).json({
//             success: false,
//             error: 'Each product must have a tag'
//           });
//         }
        
//         const productExists = await Product.findById(item.productId);
//         if (!productExists) {
//           return res.status(400).json({
//             success: false,
//             error: `Product with ID ${item.productId} not found`
//           });
//         }
//       }
//     }
    
//     let settings = await PromotionalSetting.findOne();
    
//     if (settings) {
//       settings.isActive = isActive !== undefined ? isActive : settings.isActive;
//       settings.products = products || [];
//       settings.intervals = intervals;
//       settings.maxShows = maxShows || settings.maxShows;
//       await settings.save();
//     } else {
//       settings = await PromotionalSetting.create({
//         isActive: isActive !== undefined ? isActive : true,
//         products: products || [],
//         intervals: intervals,
//         maxShows: maxShows || 3
//       });
//     }
    
//     const populatedSettings = await PromotionalSetting.findById(settings._id).populate('products.productId');
    
//     res.status(200).json({
//       success: true,
//       data: populatedSettings
//     });
//   } catch (error) {
//     console.error('Error updating promotional settings:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Delete promotional settings
// // @route   DELETE /api/promotional-settings
// // @access  Private (Admin only)
// const deletePromotionalSettings = async (req, res) => {
//   try {
//     await PromotionalSetting.deleteMany();
//     res.status(200).json({
//       success: true,
//       message: 'Promotional settings cleared successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting promotional settings:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   getPromotionalSettings,
//   updatePromotionalSettings,
//   deletePromotionalSettings,
//   getPublicPromotionalData
// };


const PromotionalSetting = require('../models/PromotionalSetting');
const Product = require('../models/Product');

// @desc    Get all promotional settings (multiple documents)
// @route   GET /api/promotional-settings
// @access  Private (Admin only)
const getAllPromotionalSettings = async (req, res) => {
  try {
    console.log('Fetching all promotional settings...');
    const settings = await PromotionalSetting.find()
      .populate('productId')
      .sort({ order: 1, createdAt: -1 });
    
    console.log(`Found ${settings.length} promotional settings`);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching promotional settings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single promotional setting by ID
// @route   GET /api/promotional-settings/:id
// @access  Private (Admin only)
const getPromotionalSettingById = async (req, res) => {
  try {
    const setting = await PromotionalSetting.findById(req.params.id).populate('productId');
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        error: 'Promotional setting not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    console.error('Error fetching promotional setting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create a new promotional setting
// @route   POST /api/promotional-settings
// @access  Private (Admin only)
const createPromotionalSetting = async (req, res) => {
  try {
    const { productId, tag, intervals, maxShows, isActive } = req.body;
    
    console.log('Creating promotional setting for product:', productId);
    
    // Validate product
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }
    
    // Check if product already has a promotional setting
    const existingSetting = await PromotionalSetting.findOne({ productId });
    if (existingSetting) {
      return res.status(400).json({
        success: false,
        error: 'This product already has a promotional setting'
      });
    }
    
    // Verify product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(400).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Validate intervals
    if (!intervals || intervals.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one interval is required'
      });
    }
    
    // Get count for order
    const count = await PromotionalSetting.countDocuments();
    
    const setting = await PromotionalSetting.create({
      productId,
      tag: tag || 'Special Offer',
      intervals: intervals || [{ delay: 5 }, { delay: 15 }, { delay: 15 }],
      maxShows: maxShows || 3,
      isActive: isActive !== undefined ? isActive : true,
      order: count
    });
    
    console.log('Promotional setting created:', setting._id);
    
    const populatedSetting = await PromotionalSetting.findById(setting._id).populate('productId');
    
    res.status(201).json({
      success: true,
      data: populatedSetting
    });
  } catch (error) {
    console.error('Error creating promotional setting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update a promotional setting
// @route   PUT /api/promotional-settings/:id
// @access  Private (Admin only)
const updatePromotionalSetting = async (req, res) => {
  try {
    const { tag, intervals, maxShows, isActive, order } = req.body;
    
    const setting = await PromotionalSetting.findById(req.params.id);
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        error: 'Promotional setting not found'
      });
    }
    
    // Update fields
    if (tag !== undefined) setting.tag = tag;
    if (intervals !== undefined) setting.intervals = intervals;
    if (maxShows !== undefined) setting.maxShows = maxShows;
    if (isActive !== undefined) setting.isActive = isActive;
    if (order !== undefined) setting.order = order;
    
    await setting.save();
    
    const populatedSetting = await PromotionalSetting.findById(setting._id).populate('productId');
    
    res.status(200).json({
      success: true,
      data: populatedSetting
    });
  } catch (error) {
    console.error('Error updating promotional setting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete a promotional setting
// @route   DELETE /api/promotional-settings/:id
// @access  Private (Admin only)
const deletePromotionalSetting = async (req, res) => {
  try {
    const setting = await PromotionalSetting.findById(req.params.id);
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        error: 'Promotional setting not found'
      });
    }
    
    await setting.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Promotional setting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting promotional setting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get public promotional data for frontend (returns all active settings)
// @route   GET /api/promotional
// @access  Public
// const getPublicPromotionalData = async (req, res) => {
//   try {
//     console.log('Fetching promotional settings for public...');
    
//     const settings = await PromotionalSetting.find({ isActive: true })
//       .populate('productId')
//       .sort({ order: 1 });
    
//     console.log(`Found ${settings.length} active promotional settings`);
    
//     if (!settings || settings.length === 0) {
//       return res.status(200).json({
//         success: true,
//         data: {
//           isActive: false,
//           products: [],
//           intervals: [],
//           maxShows: 0
//         }
//       });
//     }
    
//     // Format response for frontend - show ALL active promotions
//     const formattedProducts = settings.map(setting => {
//       const product = setting.productId;
//       if (!product) return null;
      
//       return {
//         productId: product._id,
//         productName: product.productName || 'Product Name',
//         pricePerUnit: product.pricePerUnit || 0,
//         images: product.images || [],
//         fabric: product.fabric || 'Premium Quality',
//         moq: product.moq || 1,
//         orderUnit: product.orderUnit || 'piece',
//         tag: setting.tag || 'Special Offer',
//         colors: product.colors || [],
//         sizes: product.sizes || [],
//         quantityBasedPricing: product.quantityBasedPricing || [],
//         additionalInfo: product.additionalInfo || [],
//         // Use the intervals and maxShows from the first setting (or each product can have its own)
//         intervals: setting.intervals,
//         maxShows: setting.maxShows
//       };
//     }).filter(p => p !== null);
    
//     // Use intervals and maxShows from the first active setting
//     const firstSetting = settings[0];
    
//     res.status(200).json({
//       success: true,
//       data: {
//         isActive: true,
//         products: formattedProducts,
//         intervals: firstSetting?.intervals || [{ delay: 5 }, { delay: 15 }, { delay: 15 }],
//         maxShows: firstSetting?.maxShows || 3
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching public promotional data:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };


// @desc    Get public promotional data for frontend (returns ALL active settings sorted by latest)
// @route   GET /api/promotional
// @access  Public
const getPublicPromotionalData = async (req, res) => {
  try {
    console.log('Fetching promotional settings for public...');
    
    // Sort by createdAt in DESCENDING order (latest first)
    const settings = await PromotionalSetting.find({ isActive: true })
      .populate('productId')
      .sort({ createdAt: -1 }); // ← IMPORTANT: -1 means newest first
    
    console.log(`Found ${settings.length} active promotional settings`);
    
    if (!settings || settings.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          isActive: false,
          products: [],
          intervals: [],
          maxShows: 0
        }
      });
    }
    
    // Format response for frontend
    const formattedProducts = settings.map(setting => {
      const product = setting.productId;
      if (!product) return null;
      
      return {
        productId: product._id,
        productName: product.productName || 'Product Name',
        pricePerUnit: product.pricePerUnit || 0,
        images: product.images || [],
        fabric: product.fabric || 'Premium Quality',
        moq: product.moq || 1,
        orderUnit: product.orderUnit || 'piece',
        tag: setting.tag || 'Special Offer',
        colors: product.colors || [],
        sizes: product.sizes || [],
        quantityBasedPricing: product.quantityBasedPricing || [],
        additionalInfo: product.additionalInfo || [],
        intervals: setting.intervals,
        maxShows: setting.maxShows,
        createdAt: setting.createdAt // ← ADD createdAt field
      };
    }).filter(p => p !== null);
    
    const firstSetting = settings[0];
    
    res.status(200).json({
      success: true,
      data: {
        isActive: true,
        products: formattedProducts,
        intervals: firstSetting?.intervals || [{ delay: 5 }, { delay: 15 }, { delay: 15 }],
        maxShows: firstSetting?.maxShows || 3
      }
    });
  } catch (error) {
    console.error('Error fetching public promotional data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllPromotionalSettings,
  getPromotionalSettingById,
  createPromotionalSetting,
  updatePromotionalSetting,
  deletePromotionalSetting,
  getPublicPromotionalData
};