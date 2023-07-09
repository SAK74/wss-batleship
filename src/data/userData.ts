// import { randomUUID } from "crypto";

export interface UserType {
  name: string;
  password: string;
  id: number;
}

class UsersData {
  users: UserType[] = [];
  addUser(user: UserType) {
    do {
      user.id = Math.round(Math.random() * 100);
    } while (this.users.find((u) => u.id === user.id));
    this.users.push(user);
    return user;
  }
}

export default new UsersData();
