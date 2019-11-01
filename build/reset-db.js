// @flow
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './tmp/db.sqlite';

try {
  fs.unlinkSync(DB_PATH);
} catch {}

const db = new sqlite3.Database(DB_PATH);
db.exec(
  `
    CREATE TABLE pickups (
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT,
      price_in_cents INTEGER
    );
    INSERT INTO pickups (id, name, price_in_cents) VALUES (1, 'Dude', 10000);
    INSERT INTO pickups (id, name, price_in_cents) VALUES (2, 'Yo', 20000);

    CREATE TABLE items (
      id INTEGER NOT NULL PRIMARY KEY,
      pickup_id INTERGER,
      title TEXT,
      unit_price_in_cents INTEGER,
      quantity INTEGER,
      sold INTEGER
    );
    INSERT INTO items (id, pickup_id, title, unit_price_in_cents, quantity, sold)
      VALUES (1, 1, 'Table', 10000, 1, 1);
    INSERT INTO items (id, pickup_id, title, unit_price_in_cents, quantity, sold)
      VALUES (2, 1, 'Chair', 5000, 4, 1);
    INSERT INTO items (id, pickup_id, title, unit_price_in_cents, quantity, sold)
      VALUES (3, 2, 'Sofa', 10000, 2, 0);
    INSERT INTO items (id, pickup_id, title, unit_price_in_cents, quantity, sold)
      VALUES (4, 2, 'Lamp', 1000, 3, 1);

    CREATE TABLE tags (
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT
    );
    INSERT INTO tags (id, name) VALUES (1, 'aaa');
    INSERT INTO tags (id, name) VALUES (2, 'bbb');
    INSERT INTO tags (id, name) VALUES (3, 'ccc');
    INSERT INTO tags (id, name) VALUES (4, 'ddd');

    CREATE TABLE pickups_tags (
      pickup_id INTEGER,
      tag_id INTEGER
    );
    INSERT INTO pickups_tags (pickup_id, tag_id) VALUES (1, 1);
    INSERT INTO pickups_tags (pickup_id, tag_id) VALUES (1, 2);
    INSERT INTO pickups_tags (pickup_id, tag_id) VALUES (1, 3);
    INSERT INTO pickups_tags (pickup_id, tag_id) VALUES (2, 2);
    INSERT INTO pickups_tags (pickup_id, tag_id) VALUES (2, 3);
    INSERT INTO pickups_tags (pickup_id, tag_id) VALUES (2, 4);
  `,
  (err, count) => {
    err && console.log(err);
    db.close();
  },
);
