const mongoose = require('mongoose');

const recordBookSchema = new mongoose.Schema({
      project: {
        type: Schema.Types.ObjectId,
        required: true
      },
      students: {
        type: Schema.Types.ObjectId,
        required: true
      },
      description: String,
      tags: {
        type: [String],
        //TODO: definir as tags padronizadas
        enum: ['opcaoA', 'opcaoB'],
        required: true
      }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RecordBook', recordBookSchema);