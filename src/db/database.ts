import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const initDb = async () => {
  const db = await open({
    filename: 'bingo.db',
    driver: sqlite3.Database
  });

  await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          bingo_grid TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS bingo_content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item TEXT NOT NULL
        );
    `);

  return db;
};
