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

app.post('/signin', (req, res) => {
    db.select('*').from('login')
    .where('email', req.body.email)
    .then(storedCredentials => {
        const isValid = req.body.password === storedCredentials[0].hash;
        if (isValid) {
            return db.select('*').from('users')
                .where('email', storedCredentials[0].email)
                .then(user => {
                    res.json(user[0]);
                })
                .catch(err => res.status(400).json('failed to get credentials'))
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db.transaction(trx => {
        trx('login')
        .insert({
            hash: password,
            email: email
        })
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => res.json(user[0]))
                .then(trx.commit)
                .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('something went wrong registering'))
    })
})

app.get('/profile/:id', (req, res) => {
    const  { id } = req.params;
    db.select('*').from('users').where('id', id)
    .then(user => user.length ? res.json(user[0]) : res.status(400).json('this user does not exist'))
    .catch(err => res.status(400).json('error finding the user'))
})

app.put('/image', (req, res) => {
    const  { id } = req.body;
    db('users').where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json("this entry got lost"))
})

// Applistener on Port 3000

app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})