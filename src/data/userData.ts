import { sendToAll } from "../..";
import { createWinnersUpdateMess } from "../services/messages";

export interface UserType {
  name: string;
  password: string;
  id: number;
  wins: number;
}
type WinnerType = Pick<UserType, "name" | "wins">;

class UsersData {
  users: UserType[] = [];
  winners: WinnerType[] = [];
  addUser(user: UserType) {
    do {
      user.id = Math.round(Math.random() * 100);
    } while (this.users.some((u) => u.id === user.id));
    this.users.push({ ...user, wins: 0 });
    return user;
  }
  getUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }
  updateWinner(_id: number) {
    let user: UserType | undefined;
    if ((user = this.getUserById(_id))) {
      let winner: WinnerType | undefined;
      if (
        !(winner = this.winners.find((winner) => winner.name === user?.name))
      ) {
        this.winners.push({ name: user.name, wins: 1 });
      } else {
        winner.wins += 1;
      }
      sendToAll(createWinnersUpdateMess());
    }
  }
}

export default new UsersData();
