const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{13}$/, 'ID must be exactly 13 digits'],
      // index: true  <-- removed to avoid duplicate index
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      set: v => (v || '').trim().toUpperCase(),
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      set: v => (v || '').trim().toUpperCase(),
    },
    dob: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'INFORMATION', // ✅ forces INFORMATION collection
  }
);

// Ensure unique on id
UserSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
