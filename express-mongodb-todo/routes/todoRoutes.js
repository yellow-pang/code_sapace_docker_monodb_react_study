const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, done } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "title은 필수 입력값입니다."
      });
    }

    const newTodo = new Todo({
      title,
      done
    });

    const savedTodo = await newTodo.save();

    res.status(201).json({
      message: "할 일이 등록되었습니다.",
      data: savedTodo
    });
  } catch (error) {
    res.status(500).json({
      message: "할 일 등록 중 오류가 발생했습니다.",
      error: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "해당 할 일을 찾을 수 없습니다."
      });
    }

    res.json({
      message: "할 일 상세 조회 성공",
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      message: "할 일 상세 조회 중 오류가 발생했습니다.",
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        message: "수정할 할 일을 찾을 수 없습니다."
      });
    }

    res.json({
      message: "할 일이 수정되었습니다.",
      data: updatedTodo
    });
  } catch (error) {
    res.status(500).json({
      message: "할 일 수정 중 오류가 발생했습니다.",
      error: error.message
    });
  }
});

module.exports = router;