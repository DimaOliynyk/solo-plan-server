const { Schema, model, SchemaTypes } = require("mongoose");
const bcrypt = require("bcryptjs");

const User = new Schema(
  {
    username: {
      type: String,
      minlength: 2,
      required: true,
      unique: true
    },
    password: {
      type: String,
      minlength: 6,
      required: false,
    },
    email: {
      type: String,
    },
    avatarUrl: {
      type: String,
      required: false,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
    },
    tasks: [{
      type: Schema.Types.ObjectId,
      ref: 'task'
    }]
  },
  
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

User.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("user", User);