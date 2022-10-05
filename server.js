const express = require("express");
const bcrypt = require("bcrypt-nodejs")
const app = express();
const cors = require("cors");
const knex = require("knex");

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        port : 5432,
        user : 'taehong',
        password : '',
        database : 'intelligent_robot'
    }
});


db.select('*').from('users').then(data => {
    console.log(data);
});


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors()); // FOR CORS ERROR, you need this middle ware


const database = {
    users: [
        {
            id: '123', 
            name: 'John', 
            password: 'cookies',
            email: 'john@gmail.com', 
            entries: 0, 
            joined: new Date()
        },
        {
            id: '124', 
            name: 'Taehong', 
            password: 'bananas',
            email: 'Taehong@gmail.com', 
            entries: 0, 
            joined: new Date()
        },
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@example.com'
        }
    ]
}

app.get("/", (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    //     // Load hash from your password DB.
    // bcrypt.compare("apples", '$2a$10$N1SUUrEcWWVRCZjWlZX3mOF5KYVW6wN0OxHXdZ3glgFy2NDi9LO7e', function(err, res) {
    //     // res == true
    //     console.log('first guess',res);
    // });
    // bcrypt.compare("veggies", '$2a$10$N1SUUrEcWWVRCZjWlZX3mOF5KYVW6wN0OxHXdZ3glgFy2NDi9LO7e', function(err, res) {
    //     // res = false
    //     console.log('second guess',res);
    // });
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password){
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    db('users').insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(console.log)
    res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => { // This route will be useful and want to update user's name or email in the future
    const { id } = req.params; // if you have the route /student/:id, then the “id” property is available as req.params.id
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => { // To update, use put
    const { id } = req.body; 
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.listen(3000, () => {
    console.log("App is running on port 3000")
})