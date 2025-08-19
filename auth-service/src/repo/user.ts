import { UserInterface } from "../model/user";
import { DBInterface } from "../infra/db";

export interface UserRepoInterface {
    create(user: UserInterface): Promise<UserInterface>;
    getById(userId: string): Promise<UserInterface | null>;
    getByEmail(email: string): Promise<UserInterface | null>;
    getUsers(predicate: Record<string, any>, limit: number, offset: number): Promise<UserInterface[]>;
    countUsers(predicate: Record<string, any>): Promise<number>;
}

export class UserRepo implements UserRepoInterface {
    constructor(private db: DBInterface, private collection: string) {
        this.db = db;
        this.collection = collection;
    }

    public async create(user: UserInterface): Promise<UserInterface> {
        return this.db.create(this.collection, user);
    }

    public async getById(userId: string): Promise<UserInterface | null> {
        return this.db.findOne(this.collection, { _id: userId });
    }

    public async getByEmail(email: string): Promise<UserInterface | null> {
        return this.db.findOne(this.collection, { email });
    }

    public async getUsers(predicate: Record<string, any>, limit: number, offset: number): Promise<UserInterface[]> {
        return this.db.find(this.collection, predicate, { limit, skip: offset }, { password: 0 });
    }

    public async countUsers(predicate: Record<string, any>): Promise<number> {
        return this.db.count(this.collection, predicate);
    }
}

export const newUserRepo = async (db: DBInterface, collection: string): Promise<UserRepoInterface> => {
    return new UserRepo(db, collection);
};