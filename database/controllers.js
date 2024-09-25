import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'db.db');
const db = new Database(dbPath);

export function createList(listName) {
    const verifyTableQuery = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Lists'");
    const verifyTableReturn = verifyTableQuery.get();

    if (!verifyTableReturn) {
        const createListsTableQuery = db.prepare(`CREATE TABLE "Lists" (
            "id"	INTEGER NOT NULL UNIQUE,
            "Name"	TEXT NOT NULL,
            "Creation_date"	TEXT NOT NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`);
        const createListsTable = createListsTableQuery.run();
    }

    const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

    const listCreationQuery = db.prepare(`
        INSERT INTO Lists (Name, Creation_date) 
        VALUES (?, ?);
    `);
    const listCreation = listCreationQuery.run(listName, now);
}

export function getLists() {
    const getListsTableQuery = db.prepare("SELECT * FROM Lists");
    const getListsTable = getListsTableQuery.all();

    return getListsTable;
}