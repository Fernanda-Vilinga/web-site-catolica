import { collection, deleteDoc, doc, getDocs, Timestamp } from "firebase/firestore";
import { Post } from "../types/types";
import { dbFirestore } from "../config/firebaseConfig";
import { COLLECTIONS } from "../utils/constants";


export default class PostDao {

    static shared = new PostDao()

    getAllWithPosts(): Promise<Post[]> {
        return new Promise((resolve, reject) => {
            const docRef = collection(dbFirestore, COLLECTIONS.COLLECTION_POSTS)

            getDocs(docRef)
            .then(snapshot => {

                const darfts: Post[] = []

                if (snapshot.empty) {
                    resolve([])
                } else {
                    snapshot.forEach(doc => {
                        const data = doc.data() as Post 
                         
                         if (data.createdAt && data.createdAt instanceof Timestamp) {
                            data.createdAt = data.createdAt.toDate();
                        }
                        console.log("data post", data.createdAt)
                        data.id = doc.id
                        darfts.push(data)
                    })

                    resolve(darfts)
                }
            })
            .catch(reject)
        })
    }

    async  deletePost(postId: string) {
        try {
            const postDocRef = doc(dbFirestore, COLLECTIONS.COLLECTION_DRAFTS, postId)
            await deleteDoc(postDocRef)
        } catch (error) {
            console.error(new Error(`Erro ao deletar o courier: ${error}`))
            throw error
        }
    }
}