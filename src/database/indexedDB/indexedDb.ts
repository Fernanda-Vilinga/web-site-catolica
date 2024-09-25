
import { Draft } from "../../types/types";
import { databaseVersion } from "../../utils/database_version"

import { openIndexedDB } from "./indexedDBStore"
import { v4 as uuidv4 } from 'uuid';


export default class IndexedDB {

    public databaseName: string = "drafts-data"
    public version: number = databaseVersion
    static shared = new IndexedDB()

    private accumulatedResults: any[] = []

    async addDraftInIndexedBD(draft: Draft, keyPath: string) {
        try {

            const store = await openIndexedDB(this.databaseName, keyPath, "readwrite", this.version);
    
                if (!draft.id) {
                    draft.id = uuidv4(); 
                }

                store.add(draft);

        } catch (error) {
            console.error("Erro ao adicionar dados:", error);
        }
    }

    getData<T>(id: string, keyPath: string): Promise<T> {
        return new Promise(async (resolve, reject) => {
            try {
                const store = await (openIndexedDB(this.databaseName, keyPath, "readonly", this.version))
                const request = store.get(id)

                request.onsuccess = (event) => {
                    const rawData = (
                        event.target as IDBRequest<T>
                    ).result
                    resolve(rawData)
                }

                request.onerror = (event) => {
                    reject((event.target as IDBRequest).error)
                }

            } catch (error) {
                console.error("Erro ao abrir o banco de dados:", error)
                reject(error)
            }
        })
    }

    loadDataWithCursor<T>(keyPath: string, indexName: string, offset: number, limit: number, idbKey: IDBValidKey): Promise<[T[], IDBCursorWithValue | null]> {
        return new Promise(async (resolve, reject) => {
            try {
                let count = 0
                let request: IDBRequest
                let indexData: IDBIndex
                const store = await (openIndexedDB(this.databaseName, keyPath, "readonly", this.version))

                indexData = store.index(indexName)
                request = indexData.openCursor(idbKey, 'next')

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result

                    if (cursor && count < limit + offset) {
                        if (count >= offset) {
                            this.accumulatedResults.push(cursor.value)
                        }
                        count++
                        cursor.continue()
                    } else {
                        resolve([this.accumulatedResults, cursor])
                    }
                }

                request.onerror = (event) => {
                    reject((event.target as IDBRequest).error)
                }

            } catch (error) {
                console.error("Erro ao abrir o banco de dados:", error)
                reject(error)
            }
        })
    }

    loadData<T>(keyPath: string): Promise<T[]> {
        return new Promise(async (resolve, reject) => {
            try {

                const store = await (openIndexedDB(this.databaseName, keyPath, "readonly", this.version))
                const request = store.getAll()

                request.onsuccess = (event) => {
                    const rawData = (event.target as IDBRequest<T[]>).result
                    resolve(rawData)
                }

                request.onerror = (event) => {
                    reject((event.target as IDBRequest).error)
                }

            } catch (error) {
                console.error("Erro ao abrir o banco de dados:", error)
                reject(error)
            }
        })
    }

    async editItem<T>(updatedItem: T, keyPath: string) {
        try {
            const store = await (openIndexedDB(this.databaseName, keyPath, "readwrite", this.version))
            return store.put(updatedItem)
        } catch (error) {
            console.error("Erro ao editar dados:", error)
        }
    }

    async removeItem(id: string, keyPath: string) {
        try {
            const store = await (openIndexedDB(this.databaseName, keyPath, "readwrite", this.version))
            return await store.delete(id)
        } catch (error) {
            console.error("Erro ao excluir dados:", error)
        }
    }

    async clearData(keyPath: string) {
        try {
            const store = await (openIndexedDB(this.databaseName, keyPath, "readwrite", this.version))
            await store.clear()
        } catch (error) {
            console.error("Erro ao limpar dados:", error)
        }
    }

    resetAccumulatedResults() {
        this.accumulatedResults = []
    }
}
