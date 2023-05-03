const { default: mongoose } = require("mongoose")
const { Schema } = mongoose;
const OrdersSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    billingDetails: {
        type: Object,
        required: true,
    },
    shippingDetails: {
        type: Object,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    products: {
        type: Array,
        required: true
    },
    orderAmount: {
        type: Number,
    },
    paymentOption: {
        type: String,
        required: true,
        enum: ['COD', 'Receipt']
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    shippingPrice: {
        type: String,
        required: true
    },
    shippingStatus: {
        type: Boolean,
        default: false
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Delivered', 'Shipped', 'Returned'],
        default: 'Pending'
    },
    profitAmount: {
        type: Number,
    },
    profitStatus: {
        type: String,
        default: 'Not Paid'
    },
    orderType: {
        type: String,
    }
})
const Orders = mongoose.model("Orders", OrdersSchema);
module.exports = Orders;