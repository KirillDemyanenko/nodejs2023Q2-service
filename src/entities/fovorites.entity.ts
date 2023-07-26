import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface Favorites extends InMemoryDBEntity {
  artists: string[];
  albums: string[];
  tracks: string[];
}
