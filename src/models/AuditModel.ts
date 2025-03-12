import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    action: { type: String, required: true },
    table_name: { type: String, required: true },
    record_id: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("AuditLog", AuditSchema);
