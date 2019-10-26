const mongoose = require('mongoose');

const recordBookSchema = new mongoose.Schema({
      project: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      students: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      description: String,
      tags: {
        type: [String],
        //TODO: definir as tags padronizadas
        enum: ['opcaoA', 'opcaoB'],
        image: {
          type: String,
          //TODO: definir imagem default
          default: url_bonequinho
        },
        required: true
      }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RecordBook', recordBookSchema);