const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  }
});

const Todo = mongoose.model("Todo", todoSchema, "todoList");

module.exports = Todo;