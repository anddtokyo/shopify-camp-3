import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("./database.sqlite");

export const initDb = () => {
  return db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS tracking (id INTEGER PRIMARY KEY, custom_text TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    );
  });
};
