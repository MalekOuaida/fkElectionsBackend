import { Request, Response, RequestHandler } from "express";
import VoterService from "../services/VoterService";
import { voterSchema } from "../validators/VoterValidator";

export default class VoterController {
    static register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = voterSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }

            const voter = await VoterService.registerVoter(req.body);
            res.status(201).json(voter);
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error", details: err });
        }
    };

    static getVoter: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const voter = await VoterService.getVoter(Number(req.params.id));
            if (!voter) {
                res.status(404).json({ error: "Voter not found" });
                return;
            }
            res.json(voter);
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error", details: err });
        }
    };

    static updateVoter: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const voter = await VoterService.updateVoter(Number(req.params.id), req.body);
            res.json(voter);
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error", details: err });
        }
    };
}
