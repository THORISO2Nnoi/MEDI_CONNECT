// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{13}$/, 'ID must be exactly 13 digits'],
      index: true,
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
    // store DOB as ISO date; accepts "YYYY-MM-DD"
    dob: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, collection: 'INFORMATION' }
);

// Ensure unique on id
UserSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
