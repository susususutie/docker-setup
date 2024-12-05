import sq3 from "sqlite3";
import fs from "node:fs";
import path from "node:path";

const sqlite3 = sq3.verbose();
const dbFilePath = path.resolve("./user.db");

let db;

export function init() {
  // if (!fs.existsSync(dbFilePath)) {
  //   fs.mkdirSync(dbFilePath, { recursive: true });
  // }

  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) return reject(err);

      if (process.env.NODE_ENV !== "test") console.log(`Using sqlite database at ${dbFilePath}`);

      db.run("CREATE TABLE IF NOT EXISTS users (id varchar(36), name varchar(255), male boolean)", (err, result) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

export function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function storeItem(item) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO users (id, name, male) VALUES (?, ?, ?)", [item.id, item.name, item.male ? 1 : 0], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export async function getItems() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map((item) => ({ ...item, male: item.male === 1 })));
    });
  });
}

/**
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/tmp/todo.db';

let db, dbAll, dbRun;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((acc, rej) => {
        db = new sqlite3.Database(location, err => {
            if (err) return rej(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            db.run(
                'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
                (err, result) => {
                    if (err) return rej(err);
                    acc();
                },
            );
        });
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems() {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM todo_items', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                ),
            );
        });
    });
}

async function getItem(id) {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                )[0],
            );
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        db.run(
            'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        db.run(
            'UPDATE todo_items SET name=?, completed=? WHERE id = ?',
            [item.name, item.completed ? 1 : 0, id],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
} 

async function removeItem(id) {
    return new Promise((acc, rej) => {
        db.run('DELETE FROM todo_items WHERE id = ?', [id], err => {
            if (err) return rej(err);
            acc();
        });
    });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};

 */