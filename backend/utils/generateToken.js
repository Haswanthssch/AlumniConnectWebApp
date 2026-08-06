import jwt from 'jsonwebtoken';

const generateToken=(id,res)=>{
    const token=jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"15d"
    });
    // Cross-site cookies (Vercel <-> Render) require SameSite=None + Secure.
    const isProd=process.env.NODE_ENV==="production";
    res.cookie("token",token,{
        maxAge:15*24*60*60*1000,
        httpOnly:true,
        sameSite:isProd?"none":"strict",
        secure:isProd
    });
    return token;
}

export default generateToken;