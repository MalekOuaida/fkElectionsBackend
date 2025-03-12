import ServiceModel from "../models/ServiceModel";

export default class ServiceService {
    static async addService(serviceData: any) {
        return await ServiceModel.createService(serviceData);
    }

    static async getServicesForVoter(voter_id: number) {
        return await ServiceModel.getServicesByVoter(voter_id);
    }
}
