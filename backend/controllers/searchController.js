import User from '../models/userModel.js'


export const globalSearch= async(req,res)=>{
    try{
        const {q}=req.query;
        if(!q||!q.trim())
        {
            return res.status(400).json({
                message:"Search query is required for search"
            });
        }
        const searchTerm=q.trim();
        const users=await User.find({
            $or:[
                {name:{ $regex:searchTerm,$options:"i"}},
                {email:{ $regex:searchTerm,$options:"i"}}
            ]
        });
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}