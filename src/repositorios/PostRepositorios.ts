/* import { addDoc, collection } from 'firebase/firestore';
import { db } from '../dao/firestorePostDAO'; // Importar a instância do Firestore

interface Post {
  text: string;
  image: string; // Imagem como string Base64
  book: string;
  chapter: number;
  verse: number;
  passage: string;
  createdAt?: Date;
}

export const saveDraft = async (draft: Post): Promise<void> => {
  try {
    await addDoc(collection(firestore, 'drafts'), draft);
    console.log('Draft salvo com sucesso');
  } catch (e) {
    console.error('Erro ao salvar draft:', e);
  }
};

export const publishPost = async (post: Post): Promise<void> => {
  try {
    await addDoc(collection(firestore, 'posts'), post);
    console.log('Post salvo com sucesso');
  } catch (e) {
    console.error('Erro ao salvar post:', e);
  }
};
 */