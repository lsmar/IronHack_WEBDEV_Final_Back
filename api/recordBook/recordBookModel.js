const mongoose = require("mongoose");

const recordBookSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true
    },
    date: { type: Date, required: true },
    observation: String,
    presence: { type: Boolean, required: true },
    tags: [
      {
        type: String,
        enum: ["opcaoA", "opcaoB"],
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

recordBookSchema.index({ project: 1, date: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("RecordBook", recordBookSchema);
