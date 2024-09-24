
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { dbPromise } from '../config/IndexedDbConfig';
import { Draft } from '../types/types';
import { addFirestorePost } from './PostDAO';
import { COLLECTIONS } from '../utils/constants';

// Função para recuperar todos os rascunhos
export async function getDrafts() {
  const db = await dbPromise;
  return db.getAll('drafts');
}

// Função para adicionar um novo rascunho
// export async function addDraft(draft: {
//   text: string;
//   image: string | null;
//   book: string;
//   chapter: number;
//   verse: number;
//   passage: string;
//   createdAt?: Date;
// }) {
//   const db = await dbPromise;
//   return db.add('drafts', draft);
// }


export async function addDraft(draft: Draft): Promise<Draft> {
  return new Promise( async (resolve, reject) => {
    try {
      const collectionRef = collection(getFirestore(), COLLECTIONS.COLLECTION_POSTS)
      await addDoc(collectionRef, draft)

      resolve(draft)
    } catch (error) {
      reject(new Error(`Erro ao adicionar o draft: ${error}`));
    }
  })

}

// Função para deletar um rascunho pelo ID
export async function deleteDraft(id: number) {
  const db = await dbPromise;
  return db.delete('drafts', id);
}

// Função para publicar um rascunho
export async function publishDraft(id: number) {
  const db = await dbPromise;

  const draft = await db.get('drafts', id);
  if (!draft) {
    throw new Error('Draft não encontrado');
  }

   //await addFirestorePost({ ...draft, createdAt: draft.createdAt || new Date() });
  // await addFirestorePost({ ...draft, createdAt: draft.createdAt || new Date() });
  await deleteDraft(id);
}
