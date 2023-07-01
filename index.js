import "dotenv/config";
import * as uuid from "uuid";
import * as http from "http";
import { colors, mockUsers, routes } from "./constants.js";

const PORT = process.env.PORT || 9000;
const server = http.createServer();
export const users = [];

function generateUser(name, age, hobby) {
  return { id: uuid.v4(), username: name, age: age, hobbies: hobby };
}

function findUser(id) {
  return users.filter((value) => value.id === id);
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

mockUsers.forEach((val) => users.push(generateUser(...val)));

server.on("request", (request, response) => {
  switch (request.method) {
    case "GET":
      if (request.url === routes.favicon) {
        response.statusCode = 204;
        response.end();
        break;
      }
      const urlParams = request.url.split("/");
      if (
        request.url.includes(routes.allUsersRecords) &&
        urlParams.length <= 4
      ) {
        switch (urlParams.length) {
          case 3: {
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.write(JSON.stringify(users));
            response.end();
            break;
          }
          case 4: {
            const id = urlParams.at(3);
            if (!uuid.validate(id)) {
              response.statusCode = 400;
              response.setHeader("Content-Type", "application/json");
              response.write(`User id «${id}» is not valid UUID!`);
              response.end();
              break;
            }
            const user = findUser(id);
            if (user.length > 0) {
              response.statusCode = 200;
              response.setHeader("Content-Type", "application/json");
              response.write(JSON.stringify(user));
              response.end();
            } else {
              response.statusCode = 404;
              response.setHeader("Content-Type", "application/json");
              response.write(`User with id «${id}» does not exist!`);
              response.end();
            }
            break;
          }
          default:
            response.statusCode = 400;
            response.write(`CANNOT GET ${request.url}`);
            response.end();
        }
      } else {
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
