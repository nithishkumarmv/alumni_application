// app.js
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
//signup and signin
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const MONGODB_URI = 'mongodb://localhost:27017/alumini';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Define usersCollection globally
let usersCollection;

// Connect to MongoDB
MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        const db = client.db('alumini');
        usersCollection = db.collection('login'); // Assign usersCollection here
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });


// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('student', path.join(__dirname, './views/student'));
app.set('admin', path.join(__dirname, './views/admin'));
app.set('faculty', path.join(__dirname, './views/faculty'));
app.set('alumni', path.join(__dirname, './views/alumni'));
app.set('pages', path.join(__dirname, './views/pages'));



// Define routes
//Signin Page route
app.get('/', (req, res) => {
    res.render('signin');
});
                // Route to handle login or singin form submission
                app.post('/signin', async (req, res) => {
                    try {
                        const { username, password } = req.body;
        
                        // Find the user by username
                        const user = await usersCollection.findOne({ username });
        
                        if (!user) {
                            return res.status(404).send('User not found');
                        }
        
                        // Verify the password
                        const isPasswordValid = await bcrypt.compare(password, user.password);
        
                        if (isPasswordValid) {
                            res.send('Login successful!');
                        } else {
                            res.status(401).send('Invalid password');
                        }
                    } catch (err) {
                        console.error('Error logging in:', err);
                        res.status(500).send('Internal server error');
                    }
                });

//Forget Password Page route
app.get('/forget', (req, res) => {
    res.render('forget');
});

//Signup Page route
app.get('/signup', (req, res) => {
    res.render('signup');
});
        // routes (signup) go here...
        app.post('/signup', async (req, res) => {
            try {
                // Extract username and password from request body
                const { username, password } = req.body;

                // Check if user already exists
                const existingUser = await usersCollection.findOne({ username });
                if (existingUser) {
                    // User already exists, return error
                    return res.status(400).send('User already exists');
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Save user details to the database
                await usersCollection.insertOne({
                    username,
                    password: hashedPassword
                });

                // Signup successful, send success response
                res.send('User signed up successfully!');
            } catch (error) {
                // Handle errors
                console.error('Error signing up:', error);
                res.status(500).send('Internal server error');
            }
        });

//DevOps Page route
app.get('/devops', (req, res) => {
    res.render('pages/devops');
});

// Student Homepage Page route
app.get('/student', (req, res) => {
    res.render('student/student');
});

// Admin Homepage Page route
app.get('/admin', (req, res) => {
    res.render('admin/admin');
});

// Faculty Homepage Page route
app.get('/faculty', (req, res) => {
    res.render('faculty/faculty');
});

// Alumni Homepage Page route
app.get('/alumni', (req, res) => {
    res.render('alumni/alumni');
});

//Events Page route
app.get('/events', (req, res) => {
    res.render('pages/events');
});

//Gallery Page route
app.get('/gallery', (req, res) => {
    res.render('pages/gallery');
});

//Scholarship Page route
app.get('/scholarship', (req, res) => {
    res.render('student/scholarship');
});

//Jobs/Internships Page route
app.get('/jobs', (req, res) => {
    res.render('pages/jobs');
});

//About Page route
app.get('/about', (req, res) => {
    res.render('pages/about');
});

//Contact Us Page route
app.get('/contact', (req, res) => {
    res.render('pages/contact');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
