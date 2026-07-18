const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Sports', 'Electric', 'Hybrid', 'Pickup', 'Van'],
    },
    year: {
      type: Number,
      required: true,
    },
    color: String,
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      default: 'Petrol',
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic'],
      default: 'Automatic',
    },
    engine: String,
    mileage: String,
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 0,
      default: 0,
    },
    description: String,
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    },
    gallery: [String],
    status: {
      type: String,
      enum: ['Available', 'Out of Stock', 'Discontinued'],
      default: 'Available',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Keep status in sync with quantity automatically
vehicleSchema.pre('save', function syncStatus(next) {
  if (this.quantity <= 0) {
    this.status = 'Out of Stock';
  } else if (this.status === 'Out of Stock') {
    this.status = 'Available';
  }
  next();
});

vehicleSchema.index({ make: 'text', model: 'text', category: 'text' });

module.exports = mongoose.model('Vehicle', vehicleSchema);
