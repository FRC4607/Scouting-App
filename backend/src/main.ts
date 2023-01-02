import fs from 'fs';
import https from "https";
import path from 'path';
import { fileURLToPath } from 'url';

import mysql from 'mysql';

import { TableLayouts } from './TableSchemes.js'
import { DataType, Filters } from "./DataType.js";

const options: https.ServerOptions = {
    key: fs.readFileSync('keys/server.key'),
    cert: fs.readFileSync('keys/server.crt'),

};


/* ------ FILE: mysql-config.json ------
{
    "host": "localhost",
    "username": "username",
    "password": "password",
    "database": "database"
}
*/
const connection = mysql.createConnection(JSON.parse(fs.readFileSync("keys/mysql-config.json").toString()));

interface SavedData {
    title: string;
    header: string[]; // Each element is a value in the CSV header
    values: string[][]; // Each element is a CSV record, each element in a record is a widget value
}

/*
// TODO: table checking/creation

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    connection.query("", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});

*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename);
console.log(__dirname);

https.createServer(options, (req, res) => {

    try {

        if (req.method === "GET") {
            let url = path.normalize(`${__dirname}/static${req.url}`)
            if (req.url == "/") url += "index.html";
            // Path Filtering
            if (path.parse(url).dir.match(__dirname) == null) {
                res.writeHead(403);
                res.end();
                return;
            }
            let file;
            try {
                file = fs.readFileSync(url);
            } catch (error) {
                res.writeHead(404);
                res.end("File not found");
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

            res.writeHead(200);
            res.write(file);
            res.end();
            return;
        }

        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }

        if (req.method === 'POST' && req.url === "/api") {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string
            });
            req.on('end', () => {
                let data: SavedData;
                try {
                    data = JSON.parse(body);

                    if (typeof data.title != "string") throw new Error("Bad Title")
                    if (!Array.isArray(data.header)) throw new Error("Bad Header")
                    if (!Array.isArray(data.values[0])) throw new Error("Bad Values")
                } catch (error: any) {
                    res.writeHead(400);
                    res.end("Bad data");
                    return;
                }

                let rawHeaders: string[] = data.header;
                let rawValues: string[][] = data.values;

                let table = TableLayouts.get(data.title);
                if (table == null) {
                    res.writeHead(400);
                    res.end("Bad data");
                    console.warn(`The table "${data.title}" was submitted but not found.`);
                    return;
                }

                let copyOfHeaders = [...rawHeaders];
                for (const key of table.keys()) {
                    let index = copyOfHeaders.findIndex((value) => value === key);
                    if (index == -1) {
                        res.writeHead(400);
                        res.end("Bad data");
                        console.warn(`The key "${key}" was not found in the submitted data.`);
                        return;
                    }
                    copyOfHeaders.splice(index, 1);
                }
                if (copyOfHeaders.length > 0) {
                    res.writeHead(400);
                    res.end("Bad data");
                    console.warn(`The extra header(s) were submitted: ${copyOfHeaders}`);
                    return;
                }

                let cleanValues: Map<string, string>[] = []

                for (const row of rawValues) {
                    let rowMap: Map<string, string> = new Map();
                    for (let i = 0; i < row.length; i++) {
                        let rawEntry = row[i];
                        let rawHeader = rawHeaders[i];
                        if (rawEntry == null) {
                            res.writeHead(400);
                            res.end("Bad data");
                            console.warn(`Index "${i}" was not found in ${row}`);
                            return;
                        }
                        if (rawHeader == null) {
                            res.writeHead(400);
                            res.end("Bad data");
                            console.warn(`Index "${i}" was not found in ${rawHeaders}`);
                            return;
                        }
                        let dataType = table.get(rawHeader);
                        if (dataType == null) {
                            res.writeHead(400);
                            res.end("Bad data");
                            console.warn(`The header "${rawHeader}" was not found in ${table}`);
                            return;
                        }
                        rowMap.set(rawHeader, Filters.filter(rawEntry, dataType));
                    }
                    cleanValues.push(rowMap);
                }

                let headers = ""
                let stringValues: string[] = new Array(cleanValues.length);
                stringValues.fill("");

                for (const header of table.keys()) {
                    headers += `${header}, `
                    for (let i = 0; i < stringValues.length; i++) {
                        if (table.get(header) == DataType.Points) {
                            stringValues[i] += `ST_MPointFromText("${cleanValues[i]?.get(header)}"), `
                        } else {
                            stringValues[i] += `"${cleanValues[i]?.get(header)}", `
                        }
                    }
                }

                headers = headers.replace(/, $/, "");
                for (let i = 0; i < stringValues.length; i++) {
                    let row = stringValues[i];
                    if (row) stringValues[i] = row.replace(/, $/, "");
                }

                let query = `INSERT INTO ${data.title} (${headers}) VALUES (${stringValues.join("), (")})`
                
                console.log(query);
                // connection.connect(function (err) {
                //     if (err) throw err;
                //     console.log("Connected!");
                //     connection.query(query, function (err, result) {
                //         if (err) throw err;
                //         console.log(result);
                //         res.statusCode = 200;
                //         res.end("Data Submitted");
                //         return;
                //     });
                // });

                res.setHeader("content-type", "plaintext");
                res.writeHead(200);
                res.end("Data Submitted");
                return;

            });
        }
    } catch (error) {
        res.writeHead(500);
        res.end("Server Error");
        console.error(error);
        return;
    }
}).listen(4173, () => {
    console.log("Server started on port 4173");
});