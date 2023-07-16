import { CommandType } from "types";
import { httpServer } from "./src/http_server";
import * as ws from "ws";
import { logHandler } from "./src/handlers/logHandler";
import { createRoom } from "./src/handlers/roomHandler";
import { addUserToRoom } from "./src/handlers/addToRoom";
import { messTypes } from "./src/_constants";

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
    const { type } = JSON.parse(mess) as { type: string };
    console.log("-> " + type);
  });
};

const wss = new ws.Server({ port: WSS_PORT });

wss.on("connection", (ws: WsWithId, req) => {
  clients.push(ws);
  console.log(`Ws connected in ${req.headers.host}`);
  ws.on("message", function (mess) {
    const command = JSON.parse(mess.toString()) as CommandType;
    console.log("<- " + command.type);
    switch (command.type) {
      case messTypes.REG:
        logHandler(command.data, ws);
        break;
      case messTypes.CREATE_ROOM:
        createRoom(ws);
        break;
      case messTypes.ADD_TO_ROOM:
        addUserToRoom(ws, command.data, clients);
        break;
    }
  });
});
wss.on("error", (error) => {
  console.log(error.message);
});

process.on("SIGINT", () => {
  wss.close();
  process.exit();
});
