/* eslint-disable no-console */
import fs from "fs";
import fsAsync from "fs/promises";
import http from "http";
import path from "path";
import Knex from "knex";
import { Model } from "objection";
import config from "../knexfile";
import { validate } from "jsonschema";
import { env } from "process";
import { ApiRequest } from "../schemas/ApiRequest";
import { MatchScoutEntry, PitScoutEntry, RankingEntry } from "./models";
import { convertMatchScout, convertPitScout, convertRanking } from "./conversions";

const knex = Knex(config[env["NODE_ENV"] ? env["NODE_ENV"] : "development"]);
console.log("Starting Knex using " + env["NODE_ENV"] ? env["NODE_ENV"] : "development" + " environment");
Model.knex(knex);

const prefix = env["NODE_ENV"] == "production" ? "../" : "";
const apiSchema = JSON.parse(fs.readFileSync(prefix + "schemas/api_request.schema.json").toString());

const app: http.RequestListener = async (req, res) => {
  try {
    if (req.method === "GET") {
      let url = path.normalize(path.join(__dirname, "..", `/static${req.url}`));
      console.log(url);
      if (req.url == "/") url += "index.html";
      // Path Filtering
      if (path.parse(url).dir.match(path.join(__dirname, "..")) == null) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(403);
        res.end();
        return;
      }
      let file;
      try {
        file = await fsAsync.readFile(url);
      } catch (error) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(404);
        res.end("File Not Found");
        return;
      }

      switch (path.parse(url).ext) {
        case ".html":
          res.setHeader("content-type", "text/html");
          break;

        case ".js":
          res.setHeader("content-type", "text/javascript");
          break;

        case ".css":
          res.setHeader("content-type", "text/css");
          break;

        default:
          break;
      }
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.writeHead(200);
      res.write(file);
      res.end();
      return;
    }

    if (req.method === "POST" && req.url === "/error") {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
      req.on("end", () => {
        try {
          console.error("Error Reported:\n" + body);
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.writeHead(200);
          res.end();
        }
        catch (e) {
          console.error("Internal error: " + e);
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.writeHead(500);
          res.end("Server Error");
        }
      });
    }

    if (req.method === "POST" && req.url === "/api") {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
      req.on("end", async () => {
        try {
          const bodyObj: ApiRequest = JSON.parse(body);
          const result = validate(bodyObj, apiSchema);
          if (result.valid) {
            switch (bodyObj.title) {
              case "pits": {
                const records = convertPitScout(bodyObj);
                for await (const record of records) {
                  console.log("Adding pit scouting entry by " + record["scouter_name"] + " of team " + record["team_number"]);
                  await PitScoutEntry.query().insert(record);
                }
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.writeHead(200);
                res.end();
                break;
              }
              case "matches": {
                const records = convertMatchScout(bodyObj);
                for await (const record of records) {
                  console.log("Adding match scouting entry by " + record["scouter_name"] + " of team " + record["team_number"]);
                  await MatchScoutEntry.query().insert(record);
                }
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.writeHead(200);
                res.end();
                break;
              }
              case "ranking": {
                const records = convertRanking(bodyObj);
                for await (const record of records) {
                  console.log("Adding comparison: " + record.better + " beats " + record.worse + " by " + record.diff + " in match " + record.match + ".");
                  await RankingEntry.query().insert(record);
                }
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.writeHead(200);
                res.end();
                break;
              }
              default: {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.writeHead(400);
                res.end("Invalid Table");
                break;
              }
            }
          }
          else {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(400);
            let msg = "JSON did not pass validation:";
            result.errors.forEach(error => {
              msg += "\n" + error;
            });
            res.end(msg);
          }
        }
        catch (e) {
          console.error("Internal error: " + e);
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.writeHead(500);
          res.end("Server Error");
        }
      });
    }

    if (req.method === "OPTIONS" && req.url === "/api") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST");
      res.setHeader("Access-Control-Max-Age", 3600);
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.writeHead(204);
      res.end();
    }
  } catch (error) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(500);
    res.end("Server Error");
    console.error(error);
    return;
  }
};

http.createServer(app).listen(4173, () => {
  console.log("Server started on port 4173");
});
