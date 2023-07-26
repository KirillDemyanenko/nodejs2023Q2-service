import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface Album extends InMemoryDBEntity {
  id: string;
  name: string;
  year: string;
  artistId: string | null;
}
