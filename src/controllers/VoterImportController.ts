import { Request, Response, RequestHandler } from "express";
import { parseCSV, parseExcel } from "../utils/fileParser";
import VoterService from "../services/VoterService";
import AuditService from "../services/AuditService";

// ✅ Define a custom type for authenticated requests
interface AuthRequest extends Request {
    user?: { user_id: number };
}

// ✅ Ensure uploadVoters is a proper RequestHandler
export default class VoterImportController {
    static uploadVoters: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No file uploaded" });
                return;
            }

            const fileBuffer = req.file.buffer;
            const fileType = req.file.mimetype;

            let voters;
            if (fileType === "text/csv") {
                voters = await parseCSV(fileBuffer);
            } else if (
                fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                fileType === "application/vnd.ms-excel"
            ) {
                voters = parseExcel(fileBuffer);
            } else {
                res.status(400).json({ error: "Invalid file format. Only CSV or Excel allowed." });
                return;
            }

            const insertedVoters = [];
            for (const voter of voters) {
                if (!voter.first_name || !voter.last_name || !voter.registry_number) continue;

                const newVoter = await VoterService.registerVoter({
                    first_name: voter.first_name,
                    last_name: voter.last_name,
                    father_name: voter.father_name || null,
                    mother_name: voter.mother_name || null,
                    date_of_birth: voter.date_of_birth || null,
                    personal_sect: voter.personal_sect || null,
                    gender: voter.gender || null,
                    registry_number: voter.registry_number,
                    registry_sect: voter.registry_sect || null,
                    town: voter.town || null,
                    judiciary: voter.judiciary || null,
                    governorate: voter.governorate || null,
                    electoral_district: voter.electoral_district || null,
                    phone_number: voter.phone_number || null,
                    email: voter.email || null,
                    support_status_id: null,
                });

                insertedVoters.push(newVoter);

                if (req.user) {
                    await AuditService.logAction(req.user.user_id, "IMPORT", "voters", newVoter.voter_id);
                }
            }

            res.status(201).json({
                message: `Successfully imported ${insertedVoters.length} voters.`,
                data: insertedVoters,
            });
        } catch (err: any) {
            console.error("Error during voter import:", err);
            res.status(500).json({ error: err instanceof Error ? err.message : "Internal Server Error" });
        }
    };
}
