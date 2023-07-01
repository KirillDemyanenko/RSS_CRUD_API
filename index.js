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

server.on("request", (request, response) => {
  function setResponse(status, header = null, sendData = null) {
    response.statusCode = status;
    if (header) response.setHeader("Content-Type", "application/json");
    if (sendData) response.write(sendData);
    response.end();
  }
  switch (request.method) {
    case "GET":
      if (request.url === routes.favicon) {
        setResponse(204);
        break;
      }
      if (request.url === routes.mock) {
        mockUsers.forEach((value) => users.push(generateUser(...value)));
        setResponse(200, true, JSON.stringify(users));
        break;
      }
      const urlParams = request.url.split("/");
      if (
        request.url.includes(routes.allUsersRecords) &&
        urlParams.length <= 4
      ) {
        switch (urlParams.length) {
          case 3: {
            setResponse(200, true, JSON.stringify(users));
            break;
          }
          case 4: {
            const id = urlParams.at(3);
            if (!uuid.validate(id)) {
              setResponse(400, true, `User id «${id}» is not valid UUID!`);
              break;
            }
            const user = findUser(id);
            if (user.length > 0) {
              setResponse(200, true, JSON.stringify(user));
            } else {
              setResponse(404, true, `User with id «${id}» does not exist!`);
            }
            break;
          }
          default:
            setResponse(400, true, `CANNOT GET ${request.url}`);
        }
      } else {
        setResponse(400, true, `CANNOT GET ${request.url}`);
      }
      break;
    case "POST":
      let body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        const search = new URLSearchParams(JSON.parse(body.toString()));
        if (
          search.has("username") &&
          search.has("age") &&
          search.has("hobbies")
        ) {
          const newUser = generateUser(
            search.get("username"),
            search.get("age"),
            search.get("hobbies").split(",")
          );
          users.push(newUser);
          setResponse(200, true, JSON.stringify(newUser));
        } else {
          setResponse(400, true, `Body does not contain required fields`);
        }
      });
      break;
    case "PUT":
      const urlParamsPUT = request.url.split("/");
      if (
        request.url.includes(routes.allUsersRecords) &&
        urlParamsPUT.length === 4
      ) {
        const idPUT = urlParamsPUT.at(3);
        if (!uuid.validate(idPUT)) {
          setResponse(400, true, `User id «${idPUT}» is not valid UUID!`);
          break;
        }
        const userForUpdate = findUser(idPUT);
        if (userForUpdate.length > 0) {
          let bodyPUT = "";
          request.on("data", (data) => {
            bodyPUT += data;
          });
          request.on("end", () => {
            const searchPUT = new URLSearchParams(
              JSON.parse(bodyPUT.toString())
            );
            for (let i = 0; i < users.length; i++) {
              if (users[i].id === userForUpdate.at(0).id) {
                if (searchPUT.has("username")) {
                  users[i].username = searchPUT.get("username");
                }
                if (searchPUT.has("age")) {
                  users[i].age = searchPUT.get("age");
                }
                if (searchPUT.has("hobbies")) {
                  users[i].hobbies = [...searchPUT.get("hobbies").split(",")];
                }
                break;
              }
            }
            setResponse(200, true, JSON.stringify(findUser(idPUT)));
          });
        } else {
          setResponse(404, true, `User with id «${idPUT}» does not exist!`);
          break;
        }
      } else {
        setResponse(400, true, `CANNOT GET ${request.url}`);
      }
      break;
    case "DELETE":
      const urlParamsDEL = request.url.split("/");
      if (
        request.url.includes(routes.allUsersRecords) &&
        urlParamsDEL.length === 4
      ) {
        const idDEL = urlParamsDEL.at(3);
        if (!uuid.validate(idDEL)) {
          setResponse(400, true, `User id «${idDEL}» is not valid UUID!`);
          break;
        }
        const userForDelete = findUser(idDEL);
        if (userForDelete.length > 0) {
          const indexForDelete = users.findIndex(
            (value) => value.id === userForDelete.at(0).id
          );
          users.splice(indexForDelete, 1);
          setResponse(204);
        } else {
          setResponse(404, true, `User with id «${idDEL}» does not exist!`);
          break;
        }
      } else {
        setResponse(400, true, `CANNOT GET ${request.url}`);
      }
      break;
    default:
      setResponse(400, true, "No Response");
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
