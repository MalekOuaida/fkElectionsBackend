import AuditModel from "../models/AuditModel";

export default class AuditService {
    static async logAction(user_id: number, action: string, table_name: string, record_id: number) {
        try {
            return await AuditModel.create({ user_id, action, table_name, record_id });
        } catch (err) {
            console.error("❌ Failed to log audit action", err);
        }
    }
}
