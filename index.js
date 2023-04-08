const express=require('express');
const cors=require('cors');
const {connection}=require('./configs/db');
const { userRouter } = require('./routes/User.route');
require('dotenv').config();
const app=express();

app.use(cors());
app.use(express.json());

app.use('/user',userRouter);

const port=process.env.PORT;

app.listen(port,async()=>{
    try{
        await connection;
        console.log(`Connected to DB`)
    }catch(err){
        console.log(`Cannot connect to DB: ${err}`)
    }
    console.log(`Server is running on http://localhost:${port}`)
})