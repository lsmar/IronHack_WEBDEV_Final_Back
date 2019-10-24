const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    required: true
  },
  image: {
    type: String,
    //TODO: definir imagem default
    default: url_bonequinho
  },
  class: {
    type: String, required: true
  },
  subClass: {
    type: String,
    required: true
  },
  classNumber: {
    Number
  },
  institution: {
    type: Schema.Types.ObjectId,
    required: true
  },

}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);