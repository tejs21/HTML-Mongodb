const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ash')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Create a schema for user data
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Create a model for user
const User = mongoose.model('User', UserSchema);

// Route to handle GET request for login form
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Route to handle POST request for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Create a new user document
    const newUser = new User({
        username,
        password
    });

    // Save the user data to MongoDB
    newUser.save()
        .then(user => {
            console.log(`${user.username} saved to database`);
            // Redirect user to index.html after successful login
            res.redirect('/index.html');
        })
        .catch(err => res.status(400).send("Unable to save data"));
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
