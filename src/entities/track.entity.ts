// import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
//
// export default interface Tracks extends InMemoryDBEntity {
//   name: string;
//   artistId: string | null;
//   albumId: string | null;
//   duration: number;
// }

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Tracks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: true,
    default: '',
  })
  artistId: string;

  @Column({
    nullable: true,
    default: null,
  })
  albumId: string;

  @Column({
    nullable: false,
    default: 0,
  })
  duration: number;
}
