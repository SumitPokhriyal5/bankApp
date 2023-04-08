const express = require("express");
const { UserModel } = require("../models/User.model");
const { LedgerModel } = require("../models/Ledger.model");

const userRouter = express.Router();

/* GET ACCOUNT DETAILS */
userRouter.get('/getAccountDetails',async(req,res)=>{
    try {
        let user=await UserModel.findOne({email:req.body.email});
        res.send({user})
      } catch (err) {
        res.send({ msg: "Something went wrong", error: err });
      }
})

/* OPEN ACCOUNT ROUTE */
userRouter.post("/openAcount", async (req, res) => {
  try {
    let isUserExist =await UserModel.findOne({ email: req.body.email });

    if (isUserExist) {
      res.send({ msg: "User already Exist", user: isUserExist });
    } else {
      let user = new UserModel(req.body);
      user.kycStutus = false;
      await user.save();
      res.send({ msg: "Account has been created", user });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err });
  }
});

/* UPDATE KYC ROUTE */
userRouter.post("/updateKYC", async (req, res) => {
  try {
    let isUserExist =await UserModel.findOne({ email: req.body.email });

    if (isUserExist) {
      isUserExist.kycStutus = true;
      await isUserExist.save();
      res.send({
        msg: `KYC of ${isUserExist.name} has done`,
        user: isUserExist,
      });
    } else {
      res.send({ msg: `User of Email: ${req.body.name} does not exist` });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err });
  }
});

/* DEPOSIT MONEY ROUTE */
userRouter.post("/depositMoney", async (req, res) => {
  try {
    let user =await UserModel.findOne({ email: req.body.email });
    user.initialBalance += req.body.amount;
    await user.save();

    // ledger
    let ledger = new LedgerModel({
      userID: user._id,
      transaction: "deposit",
      amount: req.body.amount,
    });
    await ledger.save();

    res.send({
      msg: `Amount: ${req.body.amount} has been deposited to your account`,
      "current balance": user.initialBalance,
    });
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err });
  }
});

/* WITHDRAW MONEY ROUTE */
userRouter.post("/withdrawMoney", async (req, res) => {
  try {
    let user =await UserModel.findOne({ email: req.body.email });
    if (user.initialBalance < req.body.amount) {
      res.send({
        msg: `Insufficient balance`,
        "current balance": user.initialBalance,
      });
    } else {
      user.initialBalance -= req.body.amount;
      await user.save();

      // ledger
      let ledger = new LedgerModel({
        userID: user._id,
        transaction: "withdraw",
        amount: req.body.amount,
      });
      await ledger.save();

      res.send({
        msg: `Amount: ${req.body.amount} has been deposited to your account`,
        "current balance": user.initialBalance,
      });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err });
  }
});


/* TRANSFER MONEY ROUTE */
userRouter.post("/transferMoney", async (req, res) => {
    try {
      let user =await UserModel.findOne({ email: req.body.email });
      if (user.initialBalance < req.body.amount) {
        res.send({
          msg: `Insufficient balance`,
          "current balance": user.initialBalance,
        });
      } else {
        let toUser=await UserModel.findOne({email:req.body.toEmail});
        if(toUser){
            user.initialBalance -= req.body.amount;
            await user.save();

            toUser.initialBalance+=req.body.amount;
            await toUser.save();
      
            // ledger
            let ledger = new LedgerModel({
              userID: user._id,
              transaction: `Amount: ${req.body.amount} transfered to ${toUser.name}'s account`,
              amount: req.body.amount,
            });
            let ledger2=new LedgerModel({
                userID:toUser._id,
                transaction:`${user.name} sent you Amount: ${req.body.amount}`
            })
            await ledger.save();
            await ledger2.save();

            res.send({
                msg: `Amount: ${req.body.amount} has been transfered to ${toUser.name}'s account`,
                "current balance": user.initialBalance,
              });
        }
        else{
            res.send({
                msg:`Account with Email:${req.body.toEmail} doesn't exist`
            });
        }
        
      }
    } catch (err) {
      res.send({ msg: "Something went wrong", error: err });
    }
  });


  /* PRINT STATEMENT ROUTE */
  userRouter.get('/printStatement',async(req,res)=>{
    try{
        let user=await UserModel.findOne({email:req.body.email});

        let ledgers=LedgerModel.find({userID:user._id});

        res.send({
            user,
            ledgers
          });

    }catch(err){
        res.send({ msg: "Something went wrong", error: err });
    }
  });
  

   /* CLOSE ACCOUNT ROUTE */
   userRouter.post('/closeAccount',async(req,res)=>{
    try{
        let user=await UserModel.findOne({email:req.body.email});

        await UserModel.findByIdAndDelete(user._id)

        res.send({
            msg:`Your account has been Closed`
          });

    }catch(err){
        res.send({ msg: "Something went wrong", error: err });
    }
  });

  module.exports={
    userRouter
  }