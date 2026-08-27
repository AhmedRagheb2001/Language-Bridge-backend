import joi from "joi";

export const registerSchema = joi.object({
    username : joi.string().trim().alphanum().min(7).max(30).required(),
    email : joi.string().email().required(),
    password : joi.string().min(8).max(50).required(),
    displayName : joi.string().trim().alphanum().min(7).max(30).required(),
    bio : joi.string().trim().max(500),
    nativeLanguage : joi.string().valid("ENGLISH","SPANISH","FRENCH","ARABIC","TURKISH").required(),
    learningLanguage : joi.string().valid("ENGLISH","SPANISH","FRENCH","ARABIC","TURKISH").required()
}).unknown(false);


export const loginSchema = joi.object({
    email : joi.string().trim().email().required(),
    password : joi.string().min(8).max(50).required()
}).unknown(false);

