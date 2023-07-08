import { CommandType } from "types";
import { httpServer } from "./src/http_server";
import * as ws from "ws";
import { logHandler } from "./src/handlers/logHandler";
import { createRoom } from "./src/handlers/roomHandler";

const HTTP_PORT = 8181;
const WSS_PORT = 3000;

export interface WsWithName extends ws {
  name: string;
}

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new ws.Server({ port: WSS_PORT });
export const sendToAll = (mess: string) => {
  wss.clients.forEach((ws) => {
    ws.send(mess);
  });
};

wss.on("connection", (ws: WsWithName, req) => {
  console.log(`Ws connected in ${req.headers.host}`);
  console.log("clients: ", wss.clients);
  // ws.id=''
  ws.on("message", function (mess) {
    const command = JSON.parse(mess.toString()) as CommandType;
    // console.log(command);
    console.log("state: ", ws.readyState);
    switch (command.type) {
      case "reg":
        logHandler(command.data, ws);
        break;
      case "create_room":
        createRoom(ws);
        break;
      case "add_user_to_room":
    }
  });
});
