import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import * as http from "http";
import {colors, mockUsers, routes} from "./constants.js";

const PORT = process.env.PORT || 9000;
const server = http.createServer();
export const users = [];

function generateUser(name, age, hobby) {
  return { id: uuidv4(), username: name, age: age, hobbies: hobby };
}

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

mockUsers.forEach(val => users.push(generateUser(...val)))

server.on("request", (request, response) => {
  switch (request.method) {
    case "GET":
      switch (request.url) {
        case routes.allUsersRecords: {
          console.log('ok')
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.write(JSON.stringify(users));
          response.end();
          break;
        }
        default:
          response.statusCode = 400;
          response.write(`CANNOT GET ${request.url}`);
          response.end();
      }
      break;
    case "POST":
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
    default:
      response.statusCode = 400;
      response.write("No Response");
      response.end();
  }
});

server.listen(PORT, (err) => {
  err
    ? console.error(err)
    : showMessage(
        `Server successfully starts and listening on port ${PORT}`,
        colors.blue
      );
});
