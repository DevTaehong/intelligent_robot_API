const express = require("express");
const bcrypt = require("bcrypt-nodejs")
const app = express();
const cors = require("cors");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 
const knex = require("knex")({
    client: 'pg',
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl: true
    }
});

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors()); // FOR CORS ERROR, you need this middle ware

app.get('/', (req, res) => { res.send("It's working"); })
app.post('/signin', signin.handleSignin(knex, bcrypt)) 
app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) }) // This is called dependency injection
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, knex) })
app.put('/image', (req, res) => { image.handleImage(req, res, knex) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT}`)
}) 