import { Expose } from "class-transformer";

export class AuthSerializer {
    @Expose()
    id: string;
}