import VoterModel from "../models/VoterModel";

export default class VoterService {
    static async registerVoter(voterData: any) {
        return await VoterModel.createVoter(voterData);
    }

    static async getVoter(voter_id: number) {
        return await VoterModel.getVoterById(voter_id);
    }

    static async updateVoter(voter_id: number, updates: any) {
        return await VoterModel.updateVoter(voter_id, updates);
    }
}
