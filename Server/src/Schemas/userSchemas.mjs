import joi from "joi";


export const updatingUserSchema = joi.object({
    username : joi.string().trim().alphanum().min(7).max(30),
    email : joi.string().email(),
}).unknown(false).min(1);