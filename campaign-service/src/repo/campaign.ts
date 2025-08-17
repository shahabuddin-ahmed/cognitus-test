import { CampaignInterface } from "../model/campaign";
import { DBInterface } from "../infra/db";
import { ObjectId } from "mongodb";

export interface CampaignRepoInterface {
    create(campaign: CampaignInterface): Promise<CampaignInterface>;
    updateStatus(campaignID: string, status: string): Promise<any>;
    getAll(): Promise<CampaignInterface[]>;
    getById(campaignID: string): Promise<CampaignInterface | null>;
    getByName(name: string): Promise<CampaignInterface | null>;
}

export class CampaignRepo implements CampaignRepoInterface {
    constructor(public db: DBInterface, public collection: string) {
        this.db = db;
        this.collection = collection;
    }

    public async create(campaign: CampaignInterface): Promise<CampaignInterface> {
        return this.db.create(this.collection, campaign);
    }

    public async updateStatus(campaignID: string, status: string): Promise<any> {
        return this.db.update(this.collection, { _id: new ObjectId(campaignID) }, { status });
    }

    public async getAll(): Promise<CampaignInterface[]> {
        return this.db.find(this.collection, {}, {});
    }

    public async getById(campaignID: string): Promise<CampaignInterface | null> {
        return this.db.findOne(this.collection, { _id: new ObjectId(campaignID) });
    }

    public async getByName(name: string): Promise<CampaignInterface | null> {
        return this.db.findOne(this.collection, { name });
    }
}

export const newCampaignRepo = async (db: DBInterface, collection: string): Promise<CampaignRepoInterface> => {
    return new CampaignRepo(db, collection);
};

export default CampaignRepo;