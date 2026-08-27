import joi from "joi";

export const updatingProfileSchema = joi.object({
        displayName : joi.string().trim().alphanum().min(7).max(30),
        bio : joi.string().trim().max(500),
        nativeLanguage : joi.string().valid("ENGLISH","SPANISH","FRENCH","ARABIC","TURKISH"),
        learningLanguage : joi.string().valid("ENGLISH","SPANISH","FRENCH","ARABIC","TURKISH")
}).unknown(false).min(1);