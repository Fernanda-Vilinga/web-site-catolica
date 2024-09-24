import { collection, getDocs, Timestamp } from "firebase/firestore";
import { Draft } from "../types/types";
import { dbFirestore } from "../config/firebaseConfig";
import { COLLECTIONS } from "../utils/constants";


export default class DraftDao {

    static shared = new DraftDao()

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
}