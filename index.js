const express=require('express');
const mongoose=require('mongoose');
const helmet=require('helmet');
const morgan=require('morgan');
const dotenv=require('dotenv');
const userRoute=require('./routes/user');
const authRoute=require('./routes/auth');
const postRoute=require('./routes/posts');

const app=express();
dotenv.config();

mongoose.connect(process.env.mongoDb_url);


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

//Router
app.use('/api/users',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/posts',postRoute);

app.get('/',(req,res)=>{
    res.send('welcome to home page!');
})



app.listen(5000,()=>{
    console.log("server is runnning on port 5000...");
})