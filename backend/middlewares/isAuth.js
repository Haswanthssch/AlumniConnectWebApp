import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuth=async(req,res,next)=>{
    try{
        // Prefer the cookie, but fall back to the Bearer header so auth still
        // works when cross-site cookies are blocked by the browser.
        let token=req.cookies.token;
        if(!token && req.headers.authorization?.startsWith("Bearer "))
        {
            token=req.headers.authorization.split(" ")[1];
        }
        if(!token)
        {
            return res.status(400).json({
                message:"Please Login"
            });
        }
        const decodedData=jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedData)
            return res.status(400).json({
            message:"Token expired"
        });
        req.user=await User.findById(decodedData.id).select("-password");
        next();
    }
    catch(err)
    {
        res.status(400).json({
            message:"Please Login"
        });
    }
}
