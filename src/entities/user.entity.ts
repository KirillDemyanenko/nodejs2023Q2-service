import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface User extends InMemoryDBEntity {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
