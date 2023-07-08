import { randomUUID } from "crypto";

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
  createRoom(name: string) {
    this.rooms.push(
      new Room(this.rooms.length, {
        name,
        index: 0,
      })
    );
  }
  addUserToRoom(indexRoom: number, name: string) {}
}

export default new Rooms();
