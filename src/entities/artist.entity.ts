// import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
//
// export default interface Artists extends InMemoryDBEntity {
//   name: string;
//   grammy: boolean;
// }

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Artists {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: false,
    default: false,
  })
  grammy: boolean;
}
