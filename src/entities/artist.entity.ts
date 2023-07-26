import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface Artist extends InMemoryDBEntity {
  id: string;
  name: string;
  grammy: boolean;
}
