const express = require("express");
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Poem = require("./models/poems.js");

const app = express();
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Route to home page
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Route for the "Start Fire" page
app.get('/fire', (req, res) => {
    res.render('fire/fire.ejs');
});

// Route to "New Poem" page
app.get('/poems/new', (req, res) => {
    res.render('poems/new.ejs');
});

// Route to view all poems
app.get('/poems/all', async (req, res) => {
    try {
        const allPoems = await Poem.find();
        res.render('poems/show.ejs', { poems: allPoems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to create a new poem
app.post('/poems', async (req, res) => {
    try {
        const { poem } = req.body;
        const createdPoem = await Poem.create({ poem });
        res.redirect('/poems/all');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to edit a specific poem
app.get('/poems/:id/edit', async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);
        const poems = await Poem.find(); // Fetching all poems
        if (!poem) {
            return res.status(404).json({ message: 'Poem not found' });
        }
        res.render('poems/edit.ejs', { poem, poems }); // Passing 'poems' to the template
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to update a specific poem
app.put('/poems/:id', async (req, res) => {
    try {
        const { poem } = req.body;
        const updatedPoem = await Poem.findByIdAndUpdate(req.params.id, { poem }, { new: true });
        if (!updatedPoem) {
            return res.status(404).json({ message: 'Poem not found' });
        }
        res.redirect('/poems/all');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to delete a specific poem
app.delete('/poems/:id', async (req, res) => {
    try {
        const deletedPoem = await Poem.findByIdAndDelete(req.params.id);
        if (!deletedPoem) {
            return res.status(404).json({ message: 'Poem not found' });
        }
        res.redirect('/poems/all');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to view all poems
app.get('/poems', async (req, res) => {
    try {
        const poems = await Poem.find();
        res.render('poems/index.ejs', { poems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to view all poems for editing
app.get('/poems/edit', async (req, res) => {
    try {
        const poems = await Poem.find();
        res.render('poems/edit.ejs', { poems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});














