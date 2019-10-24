const mongoose = require("mongoose");

const InstitutionSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Institution", InstitutionSchema);
