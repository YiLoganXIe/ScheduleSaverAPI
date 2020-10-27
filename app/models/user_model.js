const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*
    User setup: id(incremental), email, username, photo_link, saved_course_ids, 
*/
const userSchema = new Schema({
    googleId:String,
    username:String,
    email:String,
    photo_link:String,
    saved_course_ids:String
},{
    collection:'user' // collection name
});

const User = mongoose.model("User", userSchema);

module.exports = User;