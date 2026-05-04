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
      type: String,
      required: true,
    },
    time: {
      type: String,
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
    },
    onRepeat: {
      type: Boolean,
      require: false, 
      default: false
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user'
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