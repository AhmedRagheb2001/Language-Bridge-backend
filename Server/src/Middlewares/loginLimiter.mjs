import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    limit : 5,
    windowMs : 15*60*1000,
    message : "Too many login attempts.Please try again later."
})

export default loginLimiter;
