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
        required : true,
        unique : true
    },
    password : {
        type : String, 
        required : true
    },
    role : {
        type : String, 
        required : true,
        enum : ['user', 'admin', 'super admin']
    }
}, {timestamps: true});


userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.pre('findOneAndUpdate', async function(next) {
    console.log(this._update);
    if (this._update.password){
        const salt = await bcrypt.genSalt();
        this._update.password = await bcrypt.hash(this._update.password, salt);
    }
    next();
});


userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}

const User = mongoose.model('User', userSchema);

module.exports = User;