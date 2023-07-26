import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface ArtistEntity extends InMemoryDBEntity {
  id: string;
  name: string;
  grammy: boolean;
}
