const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    title : {
        type : String, 
        required : true
    },
    items : {
        type : Number, 
        required : true
    },
    description : {
        type : String
    },
    status: {
        type : String,
        default : 'pending',
        enum : ['pending']
    }
}, {timestamps: true});

// orderSchema.pre('save', (next) => {
//     this.status = 'pending';
//     next();
// });


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;