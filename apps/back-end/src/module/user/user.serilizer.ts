import { Expose } from "class-transformer";

export class UserSerializer {
    @Expose()
    id: string;

    @Expose()
    profileId: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    number: string;

    @Expose()
    fatherName: string;

    @Expose()
    motherName: string;

    @Expose()
    Contacts: Array<{
        id: string;
        contactPersonName: string;
        contactPersonNumber: string;
    }>

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(partial: Partial<UserSerializer>) {
        Object.assign(this, partial);
    }
}