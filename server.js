const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

db.select('*').from('users').then();

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

app.post('/signIn', (req,res)=>{
    const { email, password } = req.body;
    db.select('email','hash').from('login')
    .where('email',email)
    .then(data => {
        const isValid = data[0].email === email && bcrypt.compareSync(password,data[0].hash);
        if (isValid){
            db.select('*').from('users')
            .where('email',email)
            .then(user => {
                res.send(user[0]);
            })
            .catch(err => res.status(400).json("Unable to get user"))
        }
        else {
            res.status(403).json("Wrong password");
        }
    })
    .catch(err => res.status(400).json("User not found"))
})

app.post('/register', (req,res) => {
    const { name, email, password} = req.body;
    const hash = bcrypt.hashSync(password);
    
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0].email,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })  

        })
        .then(trx.commit)
        .catch(trx.rollback) 
    })
    .catch(err => res.send("Error"))
})

app.get('/profile/:id', (req,res)=>{
    const {id} = req.params;
    db.select('*').from('users').where({ id: id })
    .then( user => {
        if (user.length){
            res.json(user[0]);
        }     
        else {
            res.status(404).json("Not found")
        } 
    })
    
})

app.put('/image', (req,res) => {
    
    const {id} = req.body;
    db('users').where({ id: id }).returning('entries').increment({entries: 1})
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('Unable to get entries'));
})



// Load hash from your password DB.


app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})