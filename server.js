const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

const dataBase = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'pw12345',
            entries: 0,
            joined: new Date()
        },
        {
            id: '456',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'pw67890',
            entries: 0,
            joined: new Date()
        },
    ],
    login: [
        {
            id: "789",
            email: 'john@gmail.com',
            hash: ''
        }
    ]
}

app.use(cors())
app.use(bodyParser.json())


app.get('/', (req,res)=> {
    res.json(dataBase.users)
})

app.post('/signIn', (req,res)=>{
    console.log(req.body)
    if(req.body.email === dataBase.users[0].email){
        if(req.body.password === dataBase.users[0].password){
            res.json(dataBase.users[0])
            return true;
        }
        else res.status(403).json("Wrong password! Please try again")

    } else {
        res.status(403).json("Wrong user! Please try again")
    }
})

app.post('/register', (req,res) => {
    const { name, email, password} = req.body

    dataBase.users.push({
        id: '667',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(dataBase.users[dataBase.users.length-1]);
})

app.get('/profile/:id', (req,res)=>{
    const {id} = req.params;
    let found = false;
    dataBase.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.json(user)
        }

    })
    
    if (!found){
        res.status(404).json("user id not found")
    }
    })

app.put('/image', (req,res) => {
    
    const {id} = req.body;
    let found = false;
    dataBase.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++
            console.log(user.entries)
            return res.json(user.entries);    
        }
    })
    if (!found){
        res.status(404).json("user id not found")
    }
})



// Load hash from your password DB.


app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})

/*

--> Res = this is working
/signIn - POST - success/fail
/register - POST - user
/profile/:userId - GET - user
/image - PUT - user profile update
*/