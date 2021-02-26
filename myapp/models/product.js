const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title : {
        type : String, 
        required : true
    },
    price : {
        type : Number, 
        required : true
    },
    category : {
        type : String
    },
    description : {
        type : String
    },
    image : {
        type : String
    }
}, {timestamps: true});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;