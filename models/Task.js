const { Schema, model, SchemaTypes } = require("mongoose");

const Task = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      required: true,
    },
    details: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      minlength: 2,
    },
    date: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },    
    isCompleted: {
      type: Boolean,
      required: false,
      default: false
    }
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

module.exports = model("task", Task);