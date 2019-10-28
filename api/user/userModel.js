const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const argon2 = require("argon2");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
    role: {
      type: String,
      enum: ["COORDINATOR", "TEACHER"],
      default: "TEACHER"
    },
    thumbnail: String,
    token: String
    // googleID: String,
    // facebookID: String,
  },
  {
    timestamps: true
  }
);
userSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();
  argon2
    .hash(this.password)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => next(err));
});

userSchema.methods = {
  //* Check the password on signin
  authenticate: function(password) {
    return argon2
      .verify(this.password, password)
      .then(result => result)
      .catch(err => {
        console.error(err);
        return false;
      });
  }
};

module.exports = mongoose.model("User", userSchema);
