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
        tagName: { type: String, required: true },
        value: { type: Boolean, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);
/*
Tags:
conversation
goodParticipation
creativity
comprehension
teamWork
ideasConnection
noEngagement
*/

recordBookSchema.index({ project: 1, date: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("RecordBook", recordBookSchema);
