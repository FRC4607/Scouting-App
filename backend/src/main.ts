/* eslint-disable no-console */
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql";
import { TableLayouts, TableLayoutQueries } from "./TableSchemes.js"
import { DataType, Parsers, getUTCDateTime } from "./DataType.js";
interface SavedData {
    title: string;
    header: string[]; // Each element is a value in the CSV header
    values: string[][]; // Each element is a CSV record, each element in a record is a widget value
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------ FILE: mysql-config.json ------
{
    "host": "localhost",
    "user": "username",
    "password": "password",
    "database": "database",
    "charset" : "utf8mb4"
}
*/

const mysqlConfig: mysql.ConnectionConfig = JSON.parse(fs.readFileSync("/usr/src/app/backend/mysql-config.json").toString());

function queryServer(query: string, connection?: mysql.Connection) {
    return new Promise<{ results: any, fields: mysql.FieldInfo[] | undefined }>((resolve, reject) => {
        const currentConnection = connection ?? mysql.createConnection(mysqlConfig);

        if (currentConnection.listeners("end").length == 0) {
            currentConnection.on("end", () => {
                console.log("\x1b[2m%s\x1b[0m", "Database Connection Closed");
            })
        }

        if (currentConnection.listeners("connect").length == 0) {
            currentConnection.on("connect", () => {
                console.log("\x1b[2m%s\x1b[0m", "Database Connection Opened");
            })
        }

        currentConnection.query(query, (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                if (connection == null) {
                    currentConnection.end((err) => {
                        if (err) {
                            reject(err)
                        }
                    });
                }
                resolve({ results, fields });
            }
        });

    })
}

async function validateTables() {
    const connection = mysql.createConnection(mysqlConfig);

    function createTable(Table: [string, Map<string, DataType>]) {
        return new Promise(async (resolve, reject) => {
            console.log(`Creating Table "${Table[0]}"`);

            const query = TableLayoutQueries.get(Table[0]);
            if (query == null) {
                reject("TableLayouts and TableLayoutQueries have mismatching entries");
                return;
            }

            await queryServer(query, connection);

            resolve(null);
        });
    }
    function archiveAndReplaceTable(Table: [string, Map<string, DataType>]) {
        return new Promise(async (resolve) => {
            console.log(`The table "${Table[0]}" is different from the config: Archiving Table`);

            await queryServer(`RENAME TABLE ${Table[0]} TO ${Table[0]}_archive_${getUTCDateTime().replaceAll(" ", "")
                .replaceAll("-", "").replaceAll(":", "")}`, connection);

            await createTable(Table);

            resolve(null);
        });
    }

    const { results } = await queryServer("SHOW TABLES", connection)

    const tables: string[] = [];
    for (const dataPacket of results) {
        tables.push(dataPacket[`Tables_in_${mysqlConfig.database}`]);
    }

    for (const Table of TableLayouts) {
        if (tables.includes(Table[0])) {
            const { results } = await queryServer(`DESCRIBE ${Table[0]}`, connection)

            const keyTypes: Map<string, DataType> = new Map();
            for (const column of results) {
                const type = Parsers.parseDataType(column.Type);
                if (type == null) throw Error(`The datatype "${column.Type}" is undetermined`);
                keyTypes.set(column.Field, type);
            }

            let tablesMatch = true;
            for (const column of Table[1]) {
                const databaseType = keyTypes.get(column[0]);
                if (databaseType == null)
                    tablesMatch = false;
                else {
                    if (databaseType.valueOf() !== column[1].valueOf())
                        tablesMatch = false;
                }
            }

            if (!tablesMatch) await archiveAndReplaceTable(Table);

        } else {
            await createTable(Table);
        }
    }

    connection.end((err) => {
        if (err) throw console.error(err);
    });
    console.log("DB Tables Validated");
}
const app: http.RequestListener = (req, res) => {
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

        if (req.method === "POST" && req.url === "/error") {
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string
            });
            req.on("end", () => {
                console.error("Error Reported:\n" + body);
                res.writeHead(200);
                res.end();
            });
        }

        if (req.method === "POST" && req.url === "/api") {
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string
            });
            req.on("end", () => {
                let data: SavedData;
                try {
                    data = JSON.parse(body);

                    if (typeof data.title != "string") throw new Error("Bad Title");
                    if (!Array.isArray(data.header)) throw new Error("Bad Header");
                    if (!Array.isArray(data.values[0])) throw new Error("Bad Values");
                } catch (error) {
                    res.writeHead(400);
                    res.end("Bad data");
                    return;
                }

                const rawHeaders: string[] = data.header;
                const rawValues: string[][] = data.values;

                const table = TableLayouts.get(data.title);

                if (table == null) {
                    res.writeHead(400);
                    res.end("Bad data");
                    console.warn(`The table "${data.title}" was submitted but not found.`);
                    return;
                }

                const copyOfHeaders = [...rawHeaders];
                for (const key of table.keys()) {
                    // trim potential whitespace
                    const trimmedKey = key.trim();
                    const index = copyOfHeaders.findIndex((value) => value === trimmedKey);
                    if (index == -1) {
                        res.writeHead(400);
                        res.end("Bad data");
                        console.warn(`The key "${trimmedKey}" was not found in the submitted data.`);
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

                const cleanValues: Map<string, string>[] = []

                for (const row of rawValues) {
                    const rowMap: Map<string, string> = new Map();
                    for (let i = 0; i < row.length; i++) {
                        const rawEntry = row[i];
                        const rawHeader = rawHeaders[i];
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
                        const dataType = table.get(rawHeader);
                        if (dataType == null) {
                            res.writeHead(400);
                            res.end("Bad data");
                            console.warn(`The header "${rawHeader}" was not found in ${table}`);
                            return;
                        }
                        rowMap.set(rawHeader, Parsers.parse(rawEntry, dataType));
                    }
                    cleanValues.push(rowMap);
                }

                let headers = ""
                const stringValues: string[] = new Array(cleanValues.length);
                stringValues.fill("");

                for (const header of table.keys()) {
                    headers += `${header}, `
                    for (let i = 0; i < stringValues.length; i++) {
                        if (table.get(header) == DataType.Points || table.get(header) == DataType.Point) {
                            stringValues[i] += `${cleanValues[i]?.get(header)}, `
                        } else {
                            stringValues[i] += `"${cleanValues[i]?.get(header)}", `
                        }
                    }
                }

                headers = headers.replace(/, $/, "");
                for (let i = 0; i < stringValues.length; i++) {
                    const row = stringValues[i];
                    if (row) stringValues[i] = row.replace(/, $/, "");
                }

                const query = `INSERT INTO ${data.title} (${headers}) VALUES (${stringValues.join("), (")})`

                // console.log(query);

                queryServer(query).then(() => {
                    res.setHeader("content-type", "plaintext");
                    res.writeHead(200);
                    res.end("Data Submitted");
                    console.log("\x1b[2m%s\x1b[0m", "Data Added");
                    return;
                }).catch((err) => {
                  res.setHeader("content-type", "plaintext");
                  res.writeHead(500);
                  res.end("Database Error");
                  console.error(err);
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



await validateTables();
http.createServer(app).listen(4173, () => {
    console.log("Server started on port 4173");
});
