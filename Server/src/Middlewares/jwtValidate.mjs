import jwt from 'jsonwebtoken';

const jwtValidate = (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader || !authHeader.startsWith("Bearer "))
    {
        res.status(401);
        return next(new Error("An empty or invalid token"));
    }
    const accessToken = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(accessToken , process.env.JWT_ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch(err)
    {
        res.status(401);
        throw new Error("Invalid or malformed access Token");
    }
}

export default jwtValidate ;

