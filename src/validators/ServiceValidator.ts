import Joi from "joi";

export const serviceSchema = Joi.object({
    voter_id: Joi.number().integer().required(),
    service_type: Joi.string().max(100).required(),
    provided_at: Joi.date().iso(),
    created_by: Joi.number().integer().required(),
});
