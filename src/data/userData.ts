import { randomUUID } from "crypto";

export interface UserType {
  name: string;
  password: string;
  id: string;
}

class UsersData {
  users: UserType[] = [];
  addUser(user: UserType) {
    do {
      user.id = randomUUID();
    } while (this.users.find((u) => u.id === user.id));
    this.users.push(user);
    return user;
  }
}

export default new UsersData();
