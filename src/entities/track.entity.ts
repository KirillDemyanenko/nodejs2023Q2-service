import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface Track extends InMemoryDBEntity {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}
