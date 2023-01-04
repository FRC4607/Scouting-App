import fs from 'fs';
import http from "http";
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql';
import { TableLayouts, TableLayoutQueries } from './TableSchemes.js'
import { DataType, Filters, getUTCDateTime, stringToDataType } from "./DataType.js";
interface SavedData {
    title: string;
    header: string[]; // Each element is a value in the CSV header
    values: string[][]; // Each element is a CSV record, each element in a record is a widget value
}


/* ------ FILE: mysql-config.json ------
{
    "host": "localhost",
    "user": "username",
    "password": "password",
    "database": "database"
}
*/
const mysqlConfig: mysql.ConnectionConfig = JSON.parse(fs.readFileSync("mysql-config.json").toString());
// add in ssl
// mysqlConfig.ssl = {
//   ca: fs.readFileSync("../ca-certificate.crt")
// };
const connectionPool = mysql.createPool(mysqlConfig);
let connection: mysql.Connection; // gets set in the pool getConnection() call on startup down below


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let app: http.RequestListener = (req, res) => {
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
                            stringValues[i] += `ST_MPointFromText('${cleanValues[i]?.get(header)}'), `
                        } else {
                            stringValues[i] += `'${cleanValues[i]?.get(header)}', `
                        }
                    }
                }

                headers = headers.replace(/, $/, "");
                for (let i = 0; i < stringValues.length; i++) {
                    let row = stringValues[i];
                    if (row) stringValues[i] = row.replace(/, $/, "");
                }

                let query = `INSERT INTO ${data.title} (${headers}) VALUES (${stringValues.join("), (")})`

                // console.log(query);

                connection.query(query, function (err, result) {
                    if (err) {
                        res.setHeader("content-type", "plaintext");
                        res.writeHead(500);
                        res.end("Database Error");
                        console.error(err);
                    }

                    res.setHeader("content-type", "plaintext");
                    res.writeHead(200);
                    res.end("Data Submitted");

                    console.log("Data Added");
                    return;
                });
            });
        }
    } catch (error) {
        res.writeHead(500);
        res.end("Server Error");
        console.error(error);
        return;
    }
}


function validateTables() {
    connection.query("SHOW TABLES", function (err, result, fields) {
        if (err)
            throw err;
        let tables: string[] = [];
        for (const dataPacket of result) {
            tables.push(dataPacket[`Tables_in_${mysqlConfig.database}`]);
        }


        for (const Table of TableLayouts) {
            if (tables.includes(Table[0])) {
                connection.query(`DESCRIBE ${Table[0]}`, function (err, result, fields) {
                    if (err)
                        throw err;

                    let keyTypes: Map<string, DataType> = new Map();
                    for (const column of result) {
                        let type = stringToDataType(column.Type);
                        if (type == null) throw Error(`The datatype "${column.Type}" is undetermined`);
                        keyTypes.set(column.Field, type);
                    }

                    let tablesMatch: boolean = true;
                    for (const column of Table[1]) {
                        let databaseType = keyTypes.get(column[0]);
                        if (databaseType == null)
                            tablesMatch = false;
                        else {
                            if (databaseType.valueOf() !== column[1].valueOf())
                                tablesMatch = false;
                        }
                    }
                    if (!tablesMatch)
                        archiveAndReplaceTable(Table);

                });
            } else {
                createTable(Table);
            }
        }
    });

    function createTable(Table: [string, Map<string, DataType>]) {
        console.log(`Creating Table "${Table[0]}"`);

        let query = TableLayoutQueries.get(Table[0]);
        if (query == null)
            throw new Error("TableLayouts and TableLayoutQueries have mismatching entries");

        connection.query(query, function (err, result, fields) {
            if (err)
                throw err;
        });
    }

    function archiveAndReplaceTable(Table: [string, Map<string, DataType>]) {
        console.log(`The table "${Table[0]}" is deferent from the config: Archiving Table`);

        connection.query(`RENAME TABLE ${Table[0]} TO ${Table[0]}_archive_${getUTCDateTime().replaceAll(" ", "")
            .replaceAll("-", "").replaceAll(":", "")}`, function (err, result, fields) {
                if (err)
                    throw err;

                createTable(Table);
            });
    }
    console.log("DB Tables Validated");
}

// open the MySQL connection, assign event handlers, and start the server
connectionPool.getConnection(function (err) {
  if (err) {
    console.error(err);
    return;
  }
});
connectionPool.on("connection", (newConnection) => {
  connection = newConnection;
  console.log("Connected to DB");
  validateTables();
  http.createServer(app).listen(4173, () => {
    console.log("Server started on port 4173");
  });
  newConnection.on("error", (err: any) => {
    console.error(err);
  });
  newConnection.on("close", function (err: any) {
    console.error(new Date(), "DB connection closed", err);
  });
});
