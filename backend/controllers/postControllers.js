import { Post } from "../models/postModel.js";
import User from "../models/userModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from 'cloudinary';

export const createPost=TryCatch(async(req,res)=>{
    const {post}=req.body;
    const file=req.file;
    let image;
    if(file){
        const fileUrl=getDataUrl(file);
        const cloud=await cloudinary.v2.uploader.upload(fileUrl.content);
        image={
            id:cloud.public_id,
            url:cloud.secure_url
        };
    }
    const newPost=await Post.create({
        post,
        image,
        owner:req.user._id,
    });
    await newPost.populate("owner","-password");
    res.json({
        message:"Post Created",
        post:newPost
    });
});

export const getAllPosts=TryCatch(async(req,res)=>{
    const posts=await Post.find().sort({createdAt:-1}).populate("owner","-password");
    res.json(posts);
});

export const getSinglePost=TryCatch(async(req,res)=>{
    const post=await Post.findById(req.params.id).populate("owner","-password");
    res.json(post);
});

export const deletePost=TryCatch(async(req,res)=>{
    const post=await Post.findById(req.params.id);
    if(!post)
    {
        return res.status(404).json({
            message:"No pin with this id"
        });
    }
    if(post.owner.toString()!==req.user._id.toString())
    {
        return res.status(403).json({
            message:"Unauthorised User",
        });
    }
    if(post.image?.id)
    {
        await cloudinary.v2.uploader.destroy(post.image.id);
    }
    await post.deleteOne();
    res.json({
        message:"Post Deleted",
    });
});

export const likeUnlikePost=TryCatch(async(req,res)=>{
    const post=await Post.findById(req.params.id);
    if(!post)
    {
        return res.status(404).json({
            message:"Post cannot be found"
        });
    }
    const alreadyLiked=post.likes.includes(req.user._id);
    if(alreadyLiked)
    {
        post.likes=post.likes.filter((id)=>id.toString()!==req.user._id.toString());
    }
    else
    {
        post.likes.push(req.user._id);
    }
    await post.save();
    res.json({
        message:alreadyLiked?"Post Unliked":"Post Liked",
        likes:post.likes
    });
});

export const savePost=TryCatch(async(req,res)=>{
    const post=await Post.findById(req.params.id);
    if(!post)
    {
        return res.status(404).json({
            message:"Post cannot be found"
        });
    }
    const user=await User.findById(req.user._id);
    const alreadySaved=user.savedPosts.includes(post._id);
    if(alreadySaved)
    {
        user.savedPosts=user.savedPosts.filter((id)=>id.toString()!==post._id.toString());
    }
    else
    {
        user.savedPosts.push(post._id);
    }
    await user.save();
    res.json({
        message:alreadySaved?"Post Unsaved":"Post Saved",
        savedPosts:user.savedPosts
    });
});

export const getSavedPosts=TryCatch(async(req,res)=>{
    const user=await User.findById(req.user._id).populate({
        path:"savedPosts",
        populate:{path:"owner",select:"-password"}
    });
    res.json(user.savedPosts);
});

export const commentOnPost=TryCatch(async(req,res)=>{
    const post=await Post.findById(req.params.id);
    if(!post)
    {
        return res.status(400).json({
            message:"Post cannot be found"
        });
    }
    const {comment}=req.body;
    post.comments.push({
        user:req.user._id,
        comment
    });
    await post.save();
    res.json({
       message:"Commented Successfully"}
    );
});

export const deleteCommentOnPost=TryCatch(async(req,res)=>{
    const post=await Post.findById(req.params.id);
    if(!post)
    {
        return res.status(404).json({
            message:"Post cannot be found"
        });
    }
    if(!req.query.commentId)
    {
        return res.status(400).json({
            message:'Please enter a commentId'
        });
    }
    const commentIndex=post.comments.findIndex((item)=>item._id.toString()===req.query.commentId.toString());
    if(commentIndex===-1)
    {
        return res.status(404).json({
            message:"Comment cannot be found"
        });
    }
    const comment=post.comments[commentIndex];
    if(comment.user.toString()===req.user._id.toString())
    {
        post.comments.splice(commentIndex,1);
        await post.save();
        return res.json({
            message:"Comment deleted Successfully"
        });
    }
    else
    {
        return res.status(403).json({
            message:"You are not the owner of this comment"
        });
    }
});

export const updatePost=TryCatch(async(req,res)=>{
    const post=await Post.findById(req.params.id);
    if(!post)
    {
        return res.status(400).json({
            message:"No post with this id"
        });
    }
    if(post.owner.toString()!==req.user._id.toString())
    {
        return res.status(403).json({
            message:"Unauthorised"
        });
    }
    post.post=req.body.post;
    await post.save();
    res.json({
        message:"Post Updated"
    });
});



