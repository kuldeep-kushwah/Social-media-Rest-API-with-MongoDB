const User=require('../models/user');
const router=require('express').Router();
const bcrypt=require('bcrypt');


// updating Account
router.put('/:id',async(req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        if(req.body.password)
        {
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);
                {  res.send("hey")
            }
        }catch(err){
            res.status(500).json(err);
        }
    }
    
    try{
        const user=await User.findByIdAndUpdate(req.params.id,{$set:req.body});
        res.status(200).json("Account has been updated");
        
        }catch(err){
            res.status(500).json(err);
        }
        //res.send('id correct');
}       
    
    else
    {
        res.status(403).json('you can update only your account')
    }
})


// deleting Account
router.delete('/:id',async(req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
 
    try{
        const user=await User.deleteOne({_id:req.params.id});
        res.status(200).json("Account has been deleted");
        
        }catch(err){
            res.status(500).json(err);
        }
        
     }       
    
    else
    {
        res.status(403).json('you can delete only your account')
    }
})

//Read User

router.get('/:id',async(req,res)=>{
    try{
         const user=await User.findById(req.params.id);
         const {password,updatedAt,...others}=user._doc;
         res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }
})


//follow router

router.put('/:id/follow',async(req,res)=>{
       
    if(req.body.userId!=req.params.id)
    {
        try{
           const user=await User.findById(req.params.id);
           const currentUser=await User.findById(req.body.userId);
           if(!currentUser.followings.includes(req.params.id))
           {
             await user.updateOne({$push:{followers:req.body.userId}});
             await currentUser.updateOne({$push:{followings:req.params.id}});
             res.status(200).json("user has been followed");
           }else{
               res.status(403).json("You already follow this user");
           }

        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can not follow Yourself!");
    }

})

//unfollow user
router.put('/:id/unfollow',async(req,res)=>{
       
    if(req.body.userId!=req.params.id)
    {
        try{
           const user=await User.findById(req.params.id);
           const currentUser=await User.findById(req.body.userId);
           if(currentUser.followings.includes(req.params.id))
           {
             await user.updateOne({$pull:{followers:req.body.userId}});
             await currentUser.updateOne({$pull:{followings:req.params.id}});
             res.status(200).json("user has been unfollowed");
           }else{
               res.status(403).json("You don not follow this user");
           }

        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can not unfollow Yourself!");
    }

})



router.get('/',(req,res)=>{
    res.send('hey this is user route');
})

module.exports=router;