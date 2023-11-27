import { db } from "../db.js";

export const saveLog = (customText) => {
  const insertLog = db.prepare("INSERT INTO tracking (custom_text) VALUES (?)");
  insertLog.run(customText);
  insertLog.finalize();
};
export const getLogs = (callback) => {
  db.all("SELECT * FROM tracking", (err, rows) => {
    if (err) {
      throw err;
    }
    console.log({ rows });
    callback(rows);
  });
};
