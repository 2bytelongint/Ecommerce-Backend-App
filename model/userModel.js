const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt")

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true,
    },
    role : {
        type : String,
        default : "user"
    },
    cart : {
        type : Array,
        default : []
    },
    address : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address"
    }],

    wishList : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
    },

    isBlocked : {
        type : Boolean,
        default : false
    },

    refreshToken : {
        type : String
    }
},{
    timestamps : true
});

userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.isPasswordMatched = async function(plainPassword){
    return await bcrypt.compare(plainPassword,this.password)
}

//Export the model
module.exports = mongoose.model('User', userSchema);