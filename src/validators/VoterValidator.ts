import Joi from "joi";

export const voterSchema = Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    father_name: Joi.string().max(50),
    mother_name: Joi.string().max(50),
    date_of_birth: Joi.date().iso(),
    personal_sect: Joi.string().max(50),
    gender: Joi.string().valid("Male", "Female", "Other"),
    registry_number: Joi.string().max(50),
    registry_sect: Joi.string().max(50),
    town: Joi.string().max(100),
    judiciary: Joi.string().max(100),
    governorate: Joi.string().max(100),
    electoral_district: Joi.string().max(100),
    phone_number: Joi.string().pattern(/^[0-9]{8,15}$/),
    email: Joi.string().email(),
    support_status_id: Joi.number().integer().allow(null),
});
