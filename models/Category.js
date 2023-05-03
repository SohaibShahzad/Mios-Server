const { default: mongoose } = require("mongoose")
const { Schema } = mongoose;
const CategorySchema = new Schema({
  user: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return v.length >= 3;
      },
      message: props => `must have a minimum length of 3.`
    }
  },
})
const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;