const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'markus',
      password : '',
      database : 'smart-brain'
    }
  });

const app = express();
app.use(cors())
app.use(bodyParser.json()) 


app.get('/', (req,res)=> {
    db.select('*').from('users')
    .then( users => {
        res.send(users);
    })
    .catch(err => res.status(400).json("Unable to get users"))
})

app.post('/signIn', (req, res) => { signIn.handleSignIn(req, res, db, bcrypt)} )

app.post('/register', (req,res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfile(req,res,db)})

app.put('/image', (req, res) => {image.handleImageCount(req, res, db)})

app.post('/imageurl', (req,res) => {image.handleAPICall(req,res)})

// Start App
app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})