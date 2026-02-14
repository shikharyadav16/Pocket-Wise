const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    trim: true,
  },
  date: {
    type: String, // Storing as YYYY-MM-DD string as per frontend usage
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Expense', expenseSchema);
