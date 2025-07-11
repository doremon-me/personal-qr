import { Expose } from "class-transformer";

export class AuthSerializer {
    @Expose()
    id: string;

    constructor(partial: Partial<AuthSerializer>) {
        Object.assign(this, partial);
    }
}