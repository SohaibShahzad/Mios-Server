const { default: mongoose } = require("mongoose")
const { Schema } = mongoose;
const BankDetailsSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    bankName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    accountHolderName: {
        type: String,
        required: true
    },
    iban: {
        type: String,
        required: true
    },
});

const BankDetails = mongoose.model("BankDetails", BankDetailsSchema);
module.exports = BankDetails;