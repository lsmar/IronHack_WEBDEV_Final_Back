const mongoose = require("mongoose");

const recordBookSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    students: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    description: String,
    tags: [
      {
        type: String,
        //TODO: definir as tags padronizadas
        enum: ["opcaoA", "opcaoB"],
        required: true
      }
    ],

    image: {
      type: String,
      //TODO: definir imagem default
      default: "url_bonequinho"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("RecordBook", recordBookSchema);
