// export default interface FavoritesEntity {
//   artists: string[];
//   albums: string[];
//   tracks: string[];
// }

import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FavoritesArtists {
  @PrimaryColumn({
    nullable: false,
    type: 'uuid',
  })
  artists: string;
}

@Entity()
export class FavoritesAlbums {
  @PrimaryColumn({
    nullable: false,
    type: 'uuid',
  })
  albums: string;
}

@Entity()
export class FavoritesTracks {
  @PrimaryColumn({
    nullable: false,
    type: 'uuid',
  })
  tracks: string;
}
