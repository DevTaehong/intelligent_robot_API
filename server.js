const express = require("express");
const bcrypt = require("bcrypt-nodejs")
const app = express();
const cors = require("cors");
const knex = require("knex")({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        port : 5432,
        user : 'taehong',
        password : '',
        database : 'intelligent_robot'
    }
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

app.post('/signin', (req, res) => {
    //     // Load hash from your password DB.
    // bcrypt.compare("apples", '$2a$10$N1SUUrEcWWVRCZjWlZX3mOF5KYVW6wN0OxHXdZ3glgFy2NDi9LO7e', function(err, res) {
    //     // res == true
    //     console.log('first guess',res);
    // });
    // bcrypt.compare("veggies", '$2a$10$N1SUUrEcWWVRCZjWlZX3mOF5KYVW6wN0OxHXdZ3glgFy2NDi9LO7e', function(err, res) {
    //     // res = falses
    //     console.log('second guess',res);
    // });
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password){
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in');
        }
})

// .insert({
    // If you are using Knex.js version 1.0.0 or higher this 
    // now returns an array of objects. Therefore, the code goes from:
    // loginEmail[0] --> this used to return the email
    // TO
    // loginEmail[0].email --> this now returns the email
//        email: loginEmail[0].email, // <-- this is the only change!
//        name: name,
//        joined: new Date()
//   })

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
knex('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'));
})

app.get('/profile/:id', (req, res) => { // This route will be useful and want to update user's name or email in the future
    const { id } = req.params; // if you have the route /student/:id, then the “id” property is available as req.params.id
knex.select('*').from('users').where({id}) // .where({id: id}) can be too but with ES6 if it's the same name then just use .where({id})
    .then(user => { 
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('Not found');
        }
    })
})

app.put('/image', (req, res) => { // To update, use put
    const { id } = req.body; 
knex('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);  
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
    console.log("App is running on port 3000")
})

// .then(entries => {
    // If you are using knex.js version 1.0.0 or higher this now 
    // returns an array of objects. Therefore, the code goes from:
    // entries[0] --> this used to return the entries
    // TO
    // entries[0].entries --> this now returns the entries
//     res.json(entries[0].entries);
//   })


