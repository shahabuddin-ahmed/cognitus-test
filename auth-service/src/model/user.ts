export interface UserInterface {
    id: string;
    email: string;
    name: string;
    password?: string;
    isVerified: boolean;
    accessToken?: string;
}

export class UserModel implements UserInterface {
    id: string;
    email: string;
    name: string;
    password: string;
    isVerified: boolean;

    constructor(user: UserInterface) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.password = user.password!;
        this.isVerified = user.isVerified || false;
    }
}

export const newUserModel = async (user: UserInterface) => {
    return new UserModel(user);
};