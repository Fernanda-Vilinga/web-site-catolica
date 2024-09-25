import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, Timestamp } from "firebase/firestore";
import { Post } from "../types/types";
import { dbFirestore } from "../config/firebaseConfig";
import { COLLECTIONS } from "../utils/constants";


export default class PostDao {

    static shared = new PostDao()

    async publishPost(post: Post): Promise<Post> {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.addPost(post); 
                resolve(result)
              } catch (error) {
                reject(new Error(`Erro ao publicar o post: ${error}`));
              }
        })
    }

    async addPost(post: Post): Promise<Post> {
        return new Promise( async (resolve, reject) => {
          try {
            const collectionRef = collection(dbFirestore, COLLECTIONS.COLLECTION_POSTS)
          let docRef =  await addDoc(collectionRef, post)

            const postWithId = { ...post, id: docRef.id };
      
            resolve(postWithId)
          } catch (error) {
            reject(new Error(`Erro ao adicionar o post: ${error}`));
          }
        })
    }

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


    async updatePost(postId: string, data: Post) {
        try {
            const docRef = doc(dbFirestore, COLLECTIONS.COLLECTION_POSTS, postId);
            
            await setDoc(docRef, data, { merge: true });
            console.log('Post atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar post:', error);
            throw error
        }
    }

    async  deletePostById(postId: string) {
        try {
            const postDocRef = doc(dbFirestore, COLLECTIONS.COLLECTION_POSTS, postId)
            await deleteDoc(postDocRef)
        } catch (error) {
            console.error(new Error(`Erro ao deletar o courier: ${error}`))
            throw error
        }
    }
}