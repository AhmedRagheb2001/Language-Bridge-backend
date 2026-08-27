import joi from "joi";

export const createMessageSchema = joi.object({
    content : joi.string().min(1).max(200).required()
}).unknown(false);

export const updateMessageSchema =joi.object({
    content : joi.string().min(1).max(200).required()
}).unknown(false);