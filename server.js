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

// Middleware
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

app.get('/poems/all', async (req, res) => {
    const allPoems = await Poem.find();
    console.log('allPoems', allPoems)
    res.render('poems/show.ejs', {poems: allPoems})
})

app.post('/poems', async (req, res) => {
    try {
        const { poem } = req.body;
        const createdPoem = await Poem.create({ poem });
        res.redirect('/poems');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/poems/:id/edit', async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);
        if (!poem) {
            return res.status(404).json({ message: 'Poem not found' });
        }
        res.render('poems/edit.ejs', { poem });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/poems/:id', async (req, res) => {
    try {
        const { poem } = req.body;
        const updatedPoem = await Poem.findByIdAndUpdate(req.params.id, { poem }, { new: true });
        if (!updatedPoem) {
            return res.status(404).json({ message: 'Poem not found' });
        }
        res.redirect('/poems');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/poems', async (req, res) => {
    try {
        const poems = await Poem.find();
        res.render('poems/index.ejs', { poems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




app.get('/poems/edit', async (req, res) => {
    try {
        
        const poems = await Poem.find();
        
        // Then render the edit.ejs template and pass the fetched poems to it
        res.render('poems/edit.ejs', { poems });
    } catch (err) {
        // Handle errors if any
        res.status(500).json({ error: err.message });
    }
});

app.delete('/poems/:id', async (req, res) => {
    try {
        const deletedPoem = await Poem.findByIdAndDelete(req.params.id);
        if (!deletedPoem) {
            return res.status(404).json({ message: 'Poem not found' });
        }
        res.redirect('/poems/index');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
  


















