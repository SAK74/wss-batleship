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
    this.rooms.push(
      new Room(this.rooms.length, {
        name,
        index: userIdx,
      })
    );
  }
  deletePlayersRoom(playerId: number) {
    this.rooms = this.rooms.filter((room) =>
      room.roomUsers.some((user) => user.index !== playerId)
    );
    return this;
  }
}

export default new Rooms();
