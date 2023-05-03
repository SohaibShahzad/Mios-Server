const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    skuNumber: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    wholesalePrice: {
        type: Number,
        required: true
    },
    dropshipperPrice: {
        type: Number,
        required: true
    },
    discountedPriceW: {
        type: Number,
    },
    discountedPriceD: {
        type: Number,
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    onSale: {
        type: Boolean,
        default: false
    },
    photo: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    description: {
        type: String
    }

});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;