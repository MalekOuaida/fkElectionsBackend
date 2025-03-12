import { Request, Response, RequestHandler } from "express";
import ServiceService from "../services/ServiceService";
import { serviceSchema } from "../validators/ServiceValidator";

export default class ServiceController {
    static addService: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = serviceSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }

            const service = await ServiceService.addService(req.body);
            res.status(201).json(service);
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error", details: err });
        }
    };
}
