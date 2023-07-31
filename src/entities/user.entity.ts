import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface UserEntity extends InMemoryDBEntity {
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
