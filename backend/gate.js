import fs from 'fs';
import mysql from 'mysql';

const mysqlConfig = JSON.parse(fs.readFileSync("mysql-config.json").toString());
const connectionPool = mysql.createPool(mysqlConfig);
const start = Date.now();

function restart() {
    connectionPool.getConnection(function (err) {
        if (err) {
          console.error("Waiting for database init. Time elapsed: " + ((Date.now() - start) / 1000).toString() + " seconds.");
          setTimeout(restart, 3000);
        }
    });
}

connectionPool.on("connection", (newConnection) => {
    process.exit(0);
});

restart();