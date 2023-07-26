import { v4 as uuidv4 } from 'uuid';

export default class Track {
  constructor(
    public id: string = uuidv4(),
    public name: string,
    public artistId: string | null,
    public albumId: string | null,
    public duration: number,
  ) {}
}
