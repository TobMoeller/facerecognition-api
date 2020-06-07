const express = require('express');
const cors = require('cors');
const db = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '55tZweHG0o8C8KkYkLzF',
      database : 'facerecognitiondb'
    }
});
const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const profile = require('./controllers/profile');
const imageSubmit = require('./controllers/imageSubmit');

const app = express();

// ------ Middleware ------

app.use(express.json());
app.use(cors());

// ------ RESTful API ------

app.get('/', (req, res) => {
    db.select('*').from('users')
    .then(users => res.json(users))
    .catch(err => res.status(400).json('couldnt get the users'));
})

app.post('/signin', (req, res) => signIn.handleSignIn(req, res, db))

app.post('/register', (req, res) => register.handleRegister(req, res, db))

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db))
//alternate way of calling the function (fktn gets run twice, once with (db), then with (req, res))
app.put('/image', imageSubmit.handleImageSubmit(db))

// Applistener on Port 3000

app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})