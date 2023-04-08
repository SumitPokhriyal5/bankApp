const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:String,
    gender:String,
    dob:String,
    email:String,
    mobile:Number,
    address:String,
    initialBalance:Number,
    adharNo:String,
    panNo:String,
    kycStutus:Boolean
})

const UserModel=mongoose.model('user',userSchema);

module.exports={
    UserModel
}