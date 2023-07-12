import { messTypes } from "../_constants";
import { sendToAll } from "../..";

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
    } while (this.users.find((u) => u.id === user.id));
    this.users.push(user);
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
        // }
      } else {
        winner.wins += 1;
      }
      sendToAll(
        JSON.stringify({
          type: messTypes.WINNERS_UPDATE,
          data: JSON.stringify(this.winners),
        })
      );
    }
  }
}

export default new UsersData();
