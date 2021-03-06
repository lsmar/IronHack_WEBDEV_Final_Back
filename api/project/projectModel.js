const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }
    ],
    description: String,
    subjects: [
      {
        type: String,
        //Linguagens Matemática Ciências da Natureza Ciências Humanas e Sociais Aplicadas
        enum: ["linguagens", "math", "natureza", "humanas"],
        required: true
      }
    ],
    image: {
      type: String,
      //TODO: definir imagem default
      default: "https://res.cloudinary.com/lsm/image/upload/v1572397545/lynx-project/project-default-icon.png.png"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);
