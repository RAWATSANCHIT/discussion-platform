const mongoose = require('mongoose');
const path = require('path');


// MongoDB connection URI
const mongoURI = 'mongodb://mongo:27017/user-service';  // Use 'mongo' as the hostname since it's the name of the service in Docker Compose

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Your additional setup code here
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process on error
  });

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Import routes
const discussionRoutes = require('./routes/discussionRoutes');

// Use routes
app.use('/discussions', discussionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
