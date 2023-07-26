import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface TrackEntity extends InMemoryDBEntity {
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}
