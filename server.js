const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const port = process.env.PORT;

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


app.get('/', (req,res)=> {res.json("Wow! I just deployed my first app to an Azure Environment! Super cool!")})

app.post('/signIn', (req, res) => { signIn.handleSignIn(req, res, db, bcrypt)} )

app.post('/register', (req,res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfile(req,res,db)})

app.put('/image', (req, res) => {image.handleImageCount(req, res, db)})

app.post('/imageurl', (req,res) => {image.handleAPICall(req,res)})

// Start App
app.listen(port, ()=> {
    console.log(`App is running on port: ${port}`);
})