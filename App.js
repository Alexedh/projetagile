const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// MongoDB Atlas connection
const mongoUri = 'mongodb+srv://SAAD:Saasaa221@cluster1.sdnjl.mongodb.net/';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Story = mongoose.model('Story', taskSchema);

// Routes
app.get('/', async (req, res) => {
  const tasks = await Story.find();
  res.render('index', { tasks });
});

app.post('/add', async (req, res) => {
  const { title, description } = req.body;
  await Story.create({ title, description });
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const task = await Story.findById(req.params.id);
  res.render('edit', { task });
});

app.post('/update/:id', async (req, res) => {
  const { title, description } = req.body;
  await Story.findByIdAndUpdate(req.params.id, { title, description });
  res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
  await Story.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));