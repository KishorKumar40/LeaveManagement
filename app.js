const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const url = process.env.MONGODBURL;
const path = require('path');


app.use(cors({ credentials: true, origin: 'http://127.0.0.1:5173' }));

mongoose.connect(url)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(express.json());
app.use('/api', userRoutes);
app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.listen(3000, () => console.log('Server listening on port 3000'));
