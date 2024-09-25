

import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp } from "firebase/firestore";
import { Draft } from "../../types/types";
import { dbFirestore } from "../../config/firebaseConfig";
import { COLLECTIONS } from "../../utils/constants";




export default class DraftService {

    static shared = new DraftService()

    addDraft(draft: Draft): Promise<Draft> {
        return new Promise( async (resolve, reject) => {
          try {
            const collectionRef = collection(dbFirestore, COLLECTIONS.COLLECTION_DRAFTS)
          let docRef =  await addDoc(collectionRef, draft)

            const draftWithId = { ...draft, id: docRef.id };
      
            resolve(draftWithId)
          } catch (error) {
            reject(new Error(`Erro ao adicionar o draft: ${error}`));
          }
        })
    }

    getAllWithDrafts(): Promise<Draft[]> {
        return new Promise((resolve, reject) => {
            const docRef = collection(dbFirestore, COLLECTIONS.COLLECTION_DRAFTS)

            getDocs(docRef)
            .then(snapshot => {

                const darfts: Draft[] = []

                if (snapshot.empty) {
                    resolve([])
                } else {
                    snapshot.forEach(doc => {
                        const data = doc.data() as Draft 
                        if (data.createdAt && data.createdAt instanceof Timestamp) {
                            data.createdAt = data.createdAt.toDate();
                        }
                        data.id = doc.id
                        darfts.push(data)
                    })

                    resolve(darfts)
                }
            })
            .catch(reject)
        })
    }

    async  deleteDraft(draftId: string) {
        try {
            const draftDocRef = doc(dbFirestore, COLLECTIONS.COLLECTION_DRAFTS, draftId)
            await deleteDoc(draftDocRef)
        } catch (error) {
            console.error(new Error(`Erro ao deletar o courier: ${error}`))
            throw error
        }
    }
}