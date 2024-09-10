
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

export async function getDrafts() {
  const db = await dbPromise;
  return db.getAll('drafts');
}

export async function addDraft(draft: {
  text: string;
  image: string | null;
  book: string;
  chapter: number;
  verse: number;
  passage: string;
}) {
  const db = await dbPromise;
  return db.add('drafts', draft);
}

export async function updateDraft(id: number, draft: {
  text: string;
  image: string | null;
  book: string;
  chapter: number;
  verse: number;
  passage: string;
}) {
  const db = await dbPromise;
  return db.put('drafts', { id, ...draft });
}

export async function deleteDraft(id: number) {
  const db = await dbPromise;
  return db.delete('drafts', id);
}
