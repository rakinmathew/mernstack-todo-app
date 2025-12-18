import express from "express";
import Todo from "../models/todo.model.js";

//! Create a new router instance
const router = express.Router();

//! Router to get all todos (Get all todos from database)
router.get("/", async (req, res) => {
  try {
    // Find all todos from the database collection
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    // Handle any error that occurs during the database operations
    res.status(500).json({ message: error.message });
  }
});

//! Router to create a new todo (Add a new todo to the database)
router.post("/", async (req, res) => {
  // Create a new todo instance using the Todo model
  const todo = new Todo({
    text: req.body.text,
  });
  try {
    // save the new todo to the database
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//! Router to update a todo (update a  todo text/completed status by id)
router.patch("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
    }

if(req.body.text !== undefined){
    todo.text = req.body.text;
}

if(req.body.completed !== undefined){
    todo.completed = req.body.completed;
}

const updatedTodo = await todo.save();
res.json(updatedTodo);


  } catch (error) {
    console.log(error.message);
    res.status(400).json({message: error.message});
  }
});



//! Router for Delete a todo 
router.delete("/:id", async (req,res)=>{
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({message:"Todo Deleted" });

    } catch (error) {
        res.status(500).json({message:error.message});
    }
})



export default router;
