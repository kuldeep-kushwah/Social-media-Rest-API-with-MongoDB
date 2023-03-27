const router=require('\express').Router();
const post=require('../models/post');
const User=require("../models/user");
//create post
router.post("/",async(req,res)=>{
    const newPost=new post(req.body);
    try{
        const savedPost=await newPost.save();
     
        res.status(200).send("post has been created");
    }catch(err){
         res.status(500).json(err);
    }
})

//update post

router.put("/:id",async(req,res)=>{
    try{
        const newPost= await post.findById(req.params.id);
        if(newPost.userId===req.body.userId)
        {  
            const result= await newPost.updateOne({$set:req.body});
            res.status(200).send("post has been updated");
        }else{
            res.status(403).json("You can update only your post")
        }
    }catch(err){
        res.status(500).json(err);
    }
})
//delete post

router.delete("/:id",async(req,res)=>{
    try{
        const newPost= await post.findById(req.params.id);
        if(newPost.userId===req.body.userId)
        {  
            const result= await newPost.deleteOne();
            res.status(200).send("post has been deleted");
        }else{
            res.status(403).json("You can delete only your post")
        }
    }catch(err){
        res.status(500).json(err);
    }
})


//like post

router.put("/:id/like",async(req,res)=>{
    try{
        const newPost=await post.findById(req.params.id);
        if(!newPost.likes.includes(req.body.userId)){
            await newPost.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("post has been liked")
        }
        else{
             await newPost.updateOne({$pull:{likes:req.body.userId}});
             res.status(200).json("post has been disliked");
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//get a post

router.get("/:id",async(req,res)=>{
    try{
      const newPost=await post.findById("641f2b40e0682feccbad16b4");
      res.status(200).json(newPost);
    }catch(err){
        res.status(500).json(err);
    }
    res.send("post page");
})

//get timeline  posts

router.get("/timeline/all",async(req,res)=>{
    try{
        
        const currentUser=await User.findById(req.body.userId);
        const userPosts=await post.find({userId:currentUser._id});
        const friendPosts=await Promise.all(
            currentUser.followings.map((friendId)=>{
                return post.find({userId:friendId});
            })
            )
         
        res.status(200).json(userPosts.concat(...friendPosts));
    }
    catch(err){
        res.status(500).json(err);
    }
})


module.exports=router;