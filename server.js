const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {MongoClient} = require('mongodb');
const dbConfig = require("./app/config/db.config");
const { CoursesearchController } = require("./app/Searching/course-search-controller");
const { getFields } = require("./app/Searching/get-Field");
const passport = require('passport');
const app = express();
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const e = require("express");
require('./app/config/passport-setup');

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(bodyParser.json());

app.use(cookieSession({
    name: 'UCDScheduler-session',
    keys: ['key1', 'key2']

}));

mongoose.connect(dbConfig.client.url,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    },() => {
        console.log('connected to mongodb using mongoose')
    }
);

const isLoggedIn = (req, res, next) => {
    if (req.user){
        next();
    } else{
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}));

app.get("/api", (req, res)=>{
    res.send("Welcome to UCDScheduleSaver Api");
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server is Running on Port ${PORT}...`)
})

const client = new MongoClient(dbConfig.course.url, { useUnifiedTopology: true });

app.get('/api/auth/failed', (req, res) => res.send('Failed to login'));

app.get('/api/auth/successful', isLoggedIn, (req, res) => res.send('successful to login'));


app.get('/api/auth/google', function(req,res,next){
    req._clientDB = "hello"; // reference: https://www.coder.work/article/107043
    passport.authenticate(
        'google', { scope: ['profile', 'email'] }
    )(req, res, next);
})
  

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/auth/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/api/auth/successful');
  });

app.get('/api/auth/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/api')
})

app.get("/api/course/:field/:course/:CRN/:instructor", cors(),(req, res)=>{
    CoursesearchController(client, req.params.field, req.params.course ,req.params.CRN, req.params.instructor)
    .then(result=>{
        if (result.length < 1){
            res.status(404).send('No Course')
        }else{
            res.send(result);
        }
    });
})


app.get("/api/fields", cors(), (req, res)=>{
    getFields(client)
    .then(result=>{
        let collectionNames = ["-"];
        for(let i = 0; i < result.length; i++){
            collectionNames.push(collectionList[i].name);
        }
        return collectionNames;
    })
    .then(result=>{
        if (result.length < 1){
            res.status(404).send('Cannot get Fields from Database...');
        }else{
            res.send(result.sort());
        }
    });
})

