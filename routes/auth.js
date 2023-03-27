const router=require('express').Router();
const User=require('../models/user');
const bcrypt=require('bcrypt');


router.post('/register',async(req,res)=>{
    
    
    try{
        //hashed the password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        
        // creating a user
        const newUser=await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
         
        //saving user and respond
      const user=await newUser.save();
       res.status(200).json("user has been registered");
     
    }
    catch(err){
        res.status(500).json(err);
    }
    
})

router.use('/login',async(req,res)=>{
   
    try{
         const user=await User.findOne({email:req.body.email});
        console.log(user);
         !user && res.status(404).send("user not found!");
          
           const validPassword=await bcrypt.compare(req.body.password,user.password);
           !validPassword && res.status(400).send("wrong password");
            
           res.send("user found "+user);
          }catch(err){
           res.status(500).json(err);
        }
 })
module.exports=router;