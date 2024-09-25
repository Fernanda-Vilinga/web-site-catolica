

import { indexObjectStore, objectStore } from "./objectStore";


export const openIndexedDB = (databaseName: string, keyPath: string, option: "readonly" | "readwrite", version: number) => {
    return new Promise<IDBObjectStore>((resolve, reject) => {
        let db: IDBDatabase
        const request = window.indexedDB.open(databaseName, version);

        request.onupgradeneeded = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            onUpgradeNeeded(db)
            onUpgradeNeededIndexes(db, request)
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            try {
                // const tx = db.transaction([`bible-${keyPath}`], option);
                // const store = tx.objectStore(`bible-${keyPath}`);
                const tx = db.transaction([objectStore.draftsObjectStore], option);
                const store = tx.objectStore(objectStore.draftsObjectStore);
                resolve(store);
            } catch (error) {
                let message = 'Erro desconhecido!';
                if (error instanceof Error) message = error.message;
                reject(message);
            }
        };

        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
    });
};

export async function createDatabase(version: number) {
    let db: IDBDatabase
    const databaseName = "darfts-data"
    const request = window.indexedDB.open(databaseName, version);

    request.onupgradeneeded = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        onUpgradeNeeded(db)
        onUpgradeNeededIndexes(db, request)
    };

    request.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        onUpgradeNeeded(db)
        onUpgradeNeededIndexes(db, request)
    };

    request.onerror = (event) => {
        console.error((event.target as IDBOpenDBRequest).error);
    };
}

function onUpgradeNeeded(db: IDBDatabase) {
    if (!db.objectStoreNames.contains(objectStore.draftsObjectStore)) {
      db.createObjectStore(objectStore.draftsObjectStore, { keyPath: "id" });
    }
}
  
function onUpgradeNeededIndexes(db: IDBDatabase, request: IDBOpenDBRequest) {
    
    if (db.objectStoreNames.contains(objectStore.draftsObjectStore)) {

      const store = request.transaction?.objectStore(objectStore.draftsObjectStore);
  
      if (store && !store.indexNames.contains(indexObjectStore.draftBookIndex)) {
        store.createIndex(indexObjectStore.draftBookIndex, "book");
      }
      if (store && !store.indexNames.contains(indexObjectStore.draftTextIndex)) {
        store.createIndex(indexObjectStore.draftTextIndex, "text");
      }
      if (store && !store.indexNames.contains(indexObjectStore.draftcreatedAtIndex)) {
        store.createIndex(indexObjectStore.draftcreatedAtIndex, "createdAt");
      }
      if (store && !store.indexNames.contains(indexObjectStore.draftImageIndex)) {
        store.createIndex(indexObjectStore.draftImageIndex, "image");
      }
      if (store && !store.indexNames.contains(indexObjectStore.draftPassageIndex)) {
        store.createIndex(indexObjectStore.draftPassageIndex, "passage");
      }
      if (store && !store.indexNames.contains(indexObjectStore.draftChapterIndex)) {
        store.createIndex(indexObjectStore.draftChapterIndex, "chapter");
      }
      if (store && !store.indexNames.contains(indexObjectStore.draftVerseIndex)) {
        store.createIndex(indexObjectStore.draftVerseIndex, "verse");
      }
    }
}