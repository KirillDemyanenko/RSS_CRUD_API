import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import * as http from "http";
import {colors} from "./constants.js";

const PORT = process.env.PORT || 9000;
const server = http.createServer();

function showMessage(mes, col) {
  let color;
  switch (col) {
    case "green":
      color = 32;
      break;
    case "red":
      color = 31;
      break;
    case "yellow":
      color = 33;
      break;
    case "blue":
      color = 34;
      break;
    default:
      color = 37;
      break;
  }
    console.log(`\x1b[${color}m >>> ${mes} <<< \x1b[0m`);
}

server.listen(PORT, (err) => {
  err ? console.error(err) : showMessage(`Server successfully starts and listening on port ${PORT}`, colors.blue);
});
