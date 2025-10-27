const express = require("express");
const router = express.Router();

const { auth } = require('../middlewares');
const { Task } = require('../models');
const { User } = require('../models')
const { status } = require("express/lib/response");


router.get("/ping", async (req, res, next) => {
  try {
    return res.json('pong');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/", auth, async (req, res, next) => {
  try {
    const userId = req.user._id; // assuming auth middleware sets this

    const task = (await Task.find({ author: userId }))

    return res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


router.post(
  "/",
  auth,
  async (req, res, next) => {
    try {
        const { date } = req.body
        console.log(req.body)
        if(new Date(date).getDate() < new Date().getDate()){
            return res.status(402).json({
                message: "You can't add task to previous date!"
            })
        } else {
            const new_task = await Task.create({
                ...req.body,
                author: req.user.id,
            });

            req.user.tasks.push(new_task);

            await req.user.save();
        
            return res.json({
                author: req.user,
                task: new_task,
                message: "Task created successful!"
            });
      }

    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);


router.delete("/:id", auth, async (req, res, next) => {
  const { id } = req.params;

  try {
    // 1. Find the transaction first
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 5. Delete the transaction
    await Task.findByIdAndDelete(id);

    return res.json({ 
        task: task,
        message: "Transaction deleted and balance updated successfully" 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;