import jwt from 'jsonwebtoken';

export const generateAccessToken =  (user) =>
{
    const {id , role , username, email} = user;

    return jwt.sign({id,role,username,email},process.env.JWT_ACCESS_TOKEN_SECRET,{expiresIn : "15m"});
}

export const generateRefreshToken = (user) =>{
    const {id} = user;
    return jwt.sign({id},process.env.JWT_REFRESH_TOKEN_SECRET,{expiresIn : "7d"})
} 