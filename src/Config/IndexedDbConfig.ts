import { openDB, DBSchema } from 'idb';

interface MyDB extends DBSchema {
  drafts: {
    key: number;
    value: {
      id: number;
      text: string;
      image: string | null;
      book: string;
      chapter: number;
      verse: number;
      passage: string;
    };
  };
}

const DB_NAME = 'draftsDB';
const DB_VERSION = 1;

export const dbPromise = openDB<MyDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore('drafts', { keyPath: 'id', autoIncrement: true });
  },
});
