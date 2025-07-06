import { Expose } from 'class-transformer';

export class UserSerializer {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  password: string;
  @Expose()
  wpNumber: string;
  @Expose()
  profileIds: string[];
  @Expose()
  isDeleted: string;
  @Expose()
  createdAt: Date;
  @Expose()
  deletedAt: Date;
  constructor(partial: Partial<UserSerializer>) {
    Object.assign(this, partial);
  }
}
