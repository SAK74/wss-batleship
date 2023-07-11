// import { randomUUID } from "crypto";

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
  // addUserToRoom(indexRoom: number, name: string) {}
  // deleteRoom(idx: number) {
  //   this.rooms.splice(idx, 1);
  //   // return this.rooms;
  // }
  deletePlayersRoom(playerId: number) {
    // this.rooms.findIndex(room=>room.roomUsers.)
    this.rooms = this.rooms.filter((room) =>
      room.roomUsers.some((user) => user.index !== playerId)
    );
    return this;
    // roomsWithUser.forEach(room=>{
    //   this.rooms.splice(room.roomId,1)
    // })
  }
}

export default new Rooms();
