interface UserInRoom {
  name: string;
  index: number;
}

class Room {
  constructor(id: number, user: UserInRoom) {
    this.roomId = id;
    this.roomUsers.push(user);
  }
  roomId: number;
  roomUsers: UserInRoom[] = [];
}

class Rooms {
  rooms: Room[] = [];
  createRoom(name: string, userIdx: number) {
    let _id: number;
    do {
      _id = Math.round(Math.random() * 100);
    } while (this.rooms.some(({ roomId }) => roomId === _id));
    this.rooms.push(
      new Room(_id, {
        name,
        index: userIdx,
      })
    );
  }
  deletePlayersRoom(playerId: number) {
    this.rooms = this.rooms.filter((room) =>
      room.roomUsers.some((user) => user.index !== playerId)
    );
  }
}

export default new Rooms();
