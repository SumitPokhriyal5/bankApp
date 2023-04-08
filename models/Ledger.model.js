const mongoose=require('mongoose')

const ledgerSchema=mongoose.Schema({
    userID:String,
    transaction:String,
    amount:Number
})

const LedgerModel=mongoose.model('ledger',ledgerSchema);

module.exports={
    LedgerModel
}