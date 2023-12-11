const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});


app.use(bodyParser.json());
app.use(cors());

const AppModel = mongoose.model('App', { name: String, url: String, image: String });

app.get('/api/apps', async (req, res) => {
  try {
    const apps = await AppModel.find();
    res.json(apps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/apps', async (req, res) => {
  const { name, url, image } = req.body;
  try {
    const app = new AppModel({ name, url, image });
    await app.save();
    res.json({ success: true, message: 'App added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/apps/:name/:url', async (req, res) => {
  const { name, url } = req.params;
  try {
    await AppModel.findOneAndDelete({ name, url });
    res.json({ success: true, message: 'App removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
