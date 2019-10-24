const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        unique: true
      },
      teachers: {
        type: Schema.Types.ObjectId,
        required: true
      },
      students: {
        type: Schema.Types.ObjectId,
        required: true
      },
      description: String,
      subjects: {
        type: [String],
        //TODO: colocas as áreas de conhecimento
        enum: ['opcaoA', 'opcaoB'],
        required: true
      }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', projectSchema);