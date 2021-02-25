const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String, 
        required : true
    },
    email : {
        type : String, 
        required : true
    },
    password : {
        type : String, 
        required : true
    },
    role : {
        type : String, 
        required : true
    }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;