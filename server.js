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
const keys = require("./app/config/keys");
const authRoutes = require("./app/routes/auth-routes");
require('./app/config/passport-setup');

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(bodyParser.json());

app.use(cookieSession({
    maxAge: 60 * 60 * 1000,
    name: 'UCDScheduler-session',
    keys: keys.login.cookieSessionKey
}));

mongoose.connect(dbConfig.client.url,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    },() => {
        console.log('connected to mongodb using mongoose')
    }
);

const isLoggedIn = (req, res, next) => {
    if (req.user){
        next();
    } else{
        res.redirect("/api");
    }
}

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}));

app.use("/api/auth",authRoutes);

app.get('/api/successful', isLoggedIn, (req, res) => {
    res.send("you have logged in " + req.user.username);
});

app.get("/api", (req, res)=>{
    res.send("Welcome to UCDScheduleSaver Api");
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server is Running on Port ${PORT}...`)
})

const client = new MongoClient(dbConfig.course.url, { useUnifiedTopology: true });

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

