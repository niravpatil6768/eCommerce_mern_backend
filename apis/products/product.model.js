const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  brand: {
    type: String,
    enum: ["NIKE", "PUMA", "ADIDAS", "NB", "ALL"],
    required: true,
  },

  occasion: {
    type: String,
    enum: ["Party", "Daily", "Sport", "ALL"],
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  discount: {
    type: String,
    enum: ["0", "10", "20", "50", "70"],
    required: true,
  },

  productImage: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: ["ELECTRONICS", "FASHION", "SPORTS", "ALL"],
    required: true,
  },
  createdAt: { type: String, required: true },
});

module.exports = mongoose.model("Products", Schema);
