import { Draft } from "../types/types";
import { objectStore } from "./indexedDB/objectStore";
import IndexedDB from "./indexedDB/indexedDb";
import DraftService from "../services/firestore/draftService";


export default class DraftDao {

    static shared = new DraftDao()
    private keyPath = objectStore.draftsObjectStore.replace("bible-", "")

    async addDraft(draft: Draft): Promise<void> {
		await IndexedDB.shared.addDraftInIndexedBD(draft, this.keyPath)
		DraftService.shared.addDraft(draft)
	}

    getAllWithDrafts(): Promise<Draft[]> {
       return IndexedDB.shared.loadData<Draft>(this.keyPath)
    }

    async deleteDraft(draftId: string) {
		await IndexedDB.shared.removeItem(draftId, this.keyPath)
		DraftDao.shared.deleteDraft(draftId)
	}
}