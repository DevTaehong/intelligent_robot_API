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

app.post('/signin', (req, res) => {
    knex.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return knex.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    const hash = bcrypt.hashSync(password);
    knex.transaction(trx => {
        trx
        .insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
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