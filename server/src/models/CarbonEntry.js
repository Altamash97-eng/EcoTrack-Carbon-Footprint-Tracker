
const mongoose = require("mongoose");

const carbonEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Transport", "Electricity", "Food", "Shopping"]
  },
  activity: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  co2e: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CarbonEntry", carbonEntrySchema);
