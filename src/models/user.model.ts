import { v4 as uuidv4 } from 'uuid';

export default class User {
  constructor(
    public id: string = uuidv4(),
    public login: string,
    public password: string,
    public version: number = 0,
    public createdAt: number = Date.now(),
    public updatedAt: number = Date.now(),
  ) {}
}
