import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

// export default interface Users extends InMemoryDBEntity {
//   login: string;
//   password: string;
//   version: number;
//   createdAt: number;
//   updatedAt: number;
// }
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  login: string;

  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @Column({
    nullable: false,
    default: 1,
  })
  version: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  createdAt: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  updatedAt: number;
}
