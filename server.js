const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.mongoURL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Create a new Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Define a schema for todo items
const todoSchema = new mongoose.Schema({
    text: String
});

// Create a model based on the schema
const Todo = mongoose.model('Todo', todoSchema);

// Route to add a new todo item
app.post('/api/todos', async (req, res) => {
    try{
    const todo = new Todo({
        text: req.body.text
    });
    await todo.save();
    res.status(201).send(todo);
    }
    catch(err){
        res.status(500).json({error:'Internal server error'})
    }
});

// Route to get all todo items
app.get('/api/todos', async (req, res) => {
    try{
    const todos = await Todo.find();
    res.send(todos);
    }
    catch(err){
        res.status(500).json({error:'Internal server error'})
    }
});

// Route to delete a todo item
app.delete('/api/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
