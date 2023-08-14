import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FavoritesArtists {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    nullable: false,
    type: 'uuid',
    unique: true,
  })
  artistID: string;
}

@Entity()
export class FavoritesAlbums {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    nullable: false,
    type: 'uuid',
    unique: true,
  })
  albumID: string;
}

@Entity()
export class FavoritesTracks {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    nullable: false,
    type: 'uuid',
    unique: true,
  })
  trackID: string;
}
