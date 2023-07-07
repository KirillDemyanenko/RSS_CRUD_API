import { describe, test, expect } from "@jest/globals";
import http from "http";

describe("API", () => {
  test("should return all users", async () => {
    try {
        http.get("http://localhost:9000/api/users", (res) => {
            let rawData = "";
            res.on("data", (chunk) => {
                rawData += chunk;
            });
            res.on("end", () => {
                const parsedData = JSON.parse(rawData);
                expect(parsedData).toEqual([]);
            });
            res.on('error', err => {
                console.error(err)
            })
        });
    } catch (err) {
        console.error(err)
    }
  });

  test("should create user", () => {
    const req = http.request(
      "http://localhost:9000/api/users",
      { method: "POST" },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", async () => {
          const parsedData = JSON.parse(rawData);
          await expect(parsedData.username).toBe('man')
        });
      }
    );
    req.write(
      JSON.stringify({
        username: "man",
        age: 15,
        hobbies: ["ddd", "ddds", "cccc"],
      })
    );
    req.end()
  });

  test("should create user and get it by id", () => {
    const req = http.request(
        "http://localhost:9000/api/users",
        { method: "POST" },
        (res) => {
          let rawData = "";
          res.on("data", (chunk) => {
            rawData += chunk;
          });
          res.on("end", async () => {
            const parsed = JSON.parse(rawData);
            try {
                await http.get(`http://localhost:9000/api/users/${parsed.id}`, (res1) => {
                    let rawData1 = "";
                    res1.on("data", (chunk) => {
                        rawData1 += chunk;
                    });
                    res1.on("end", async () => {
                        const parsed = JSON.parse(rawData1);
                        await expect(parsed.at(0).username).toBe("man");
                    });
                });
            } catch (err) {
                console.error(err)
            }

          });
        }
    );
    req.write(
        JSON.stringify({
          username: "man",
          age: 15,
          hobbies: ["ddd", "ddds", "cccc"],
        })
    );
    req.end()
  });
});
