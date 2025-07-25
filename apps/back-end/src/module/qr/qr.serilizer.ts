import { Expose } from "class-transformer";

export class AuthSerializer {
    @Expose()
    id: string;

    @Expose()
    isNumberVerified: boolean;

    @Expose()
    isEmailVerified: boolean;

    constructor(partial: Partial<AuthSerializer>) {
        Object.assign(this, partial);
    }
}