import { CommandType } from "types";
import { httpServer } from "./src/http_server";
import * as ws from "ws";
import { logHandler } from "./src/handlers/logHandler";
import { createRoom } from "./src/handlers/roomHandler";
import { addUserToRoom } from "./src/handlers/addToRoom";
import { messTypes } from "./src/_constants";
import { shipsAdd } from "./src/handlers/shipsAdd";

const HTTP_PORT = 8181;
const WSS_PORT = 3000;

export interface WsWithId extends ws {
  id: number;
}

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const clients: WsWithId[] = [];
export const sendToAll = (mess: string) => {
  clients.forEach((ws) => {
    ws.send(mess);
  });
};

const wss = new ws.Server({ port: WSS_PORT });

wss.on("connection", (ws: WsWithId, req) => {
  clients.push(ws);
  console.log(`Ws connected in ${req.headers.host}`);
  // console.log("clients: ", wss.clients);
  // ws.id=''
  ws.on("message", function (mess) {
    const command = JSON.parse(mess.toString()) as CommandType;
    console.log(command);
    // console.log("state: ", ws.readyState);
    switch (command.type) {
      case "reg":
        logHandler(command.data, ws);
        break;
      case "create_room":
        createRoom(ws);
        break;
      case "add_user_to_room":
        addUserToRoom(ws, command.data, clients);
        break;
      case messTypes.SHIPS_ADD:
        shipsAdd(ws, command.data);
        break;
    }
  });
});
