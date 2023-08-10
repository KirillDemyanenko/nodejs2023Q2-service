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
    default: 1971,
  })
  year: number;

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
