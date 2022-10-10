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

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors()); // FOR CORS ERROR, you need this middle ware

app.post('/signin', signin.handleSignin(knex, bcrypt)) 
app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) }) // This is called dependency injection
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, knex) })
app.put('/image', (req, res) => { image.handleImage(req, res, knex) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(3000, () => {
    console.log("App is running on port 3000")
}) 