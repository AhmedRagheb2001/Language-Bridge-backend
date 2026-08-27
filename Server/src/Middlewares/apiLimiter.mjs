import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    limit : 25, //Number of requests
    windowMs : 15 *60*1000, // period of time,
    message : "Too many requests.Please try again later."
});

export default apiLimiter;