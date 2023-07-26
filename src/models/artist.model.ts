import { v4 as uuidv4 } from 'uuid';

export default class Artist {
  constructor(
    public id: string = uuidv4(),
    public name: string,
    public grammy: boolean,
  ) {}
}
