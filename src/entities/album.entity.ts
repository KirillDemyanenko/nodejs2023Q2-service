import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface AlbumEntity extends InMemoryDBEntity {
  name: string;
  year: string;
  artistId: string | null;
}
