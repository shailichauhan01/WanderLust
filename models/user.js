const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

//Here Local Name and Password will automatical created by passport(username,hashing,salting)
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);