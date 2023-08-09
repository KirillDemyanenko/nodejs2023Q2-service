// import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Albums {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: false,
    default: '',
  })
  year: string;

  @Column({
    nullable: true,
    default: null,
  })
  artistId: string | null;
}

// export default interface Albums extends InMemoryDBEntity {
//   name: string;
//   year: string;
//   artistId: string | null;
// }
