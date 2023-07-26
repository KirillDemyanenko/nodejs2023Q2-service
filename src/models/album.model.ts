import { v4 as uuidv4 } from 'uuid';

export default class Album {
  constructor(
    public id: string = uuidv4(),
    public name: string,
    public year: string,
    public artistId: string | null,
  ) {}
}
