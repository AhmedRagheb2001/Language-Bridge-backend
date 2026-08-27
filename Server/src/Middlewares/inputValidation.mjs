export const  inputValidationRegister = (req,res,next)=>{
    const {username,email,password,displayName,nativeLanguage,learningLanguage} = req.body;
    if(!username || !email || !password || !displayName || !nativeLanguage || !learningLanguage)
    {
        res.status(400);
        return next(new Error("All Fields are mandatory"));
    }
    next();
}