// Connection to the SQLite databse
const sqlite3 = require('sqlite3').verbose();
const data = require('./seed.json');

const db = new sqlite3.Database('./database/shop.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the shop database.');

    // Check if table `item` exists in databse
    db.get("SELECT * FROM sqlite_master WHERE type = 'table' AND name = ?", ['item'], (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        // If not, create table `item`
        if (!row) {
            let sql = `CREATE TABLE item (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                image TEXT NOT NULL,
                price FLOAT NOT NULL
            );`;
            db.run(sql, (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Table `item` created.');
                seed();
            });
        }
      });
});

// Inserting data into SQLite
function seed() {
    data.items.forEach(({id, title, description, price, image}) => {
        let sql = `INSERT INTO item(id, title, description, image, price) VALUES(?, ?, ?, ?, ?)`;
        db.run(sql, [id, title, description, image, price], function(err) {
            if (err) {
              return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    });
}

// Get all items
function getItems(callback) {
    let sql = `SELECT * FROM item`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.log(err.message);
        }
        callback(rows);
    });
}

module.exports.getItems = getItems;