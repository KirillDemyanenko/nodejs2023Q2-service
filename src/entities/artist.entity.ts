import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface ArtistEntity extends InMemoryDBEntity {
  name: string;
  grammy: boolean;
}
