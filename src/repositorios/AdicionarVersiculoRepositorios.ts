import { addDoc, collection } from 'firebase/firestore';
import { db } from '../dao/firestorePostDAO';

export interface Post {
  text: string;
  image: string; 
  book: string;
  chapter: number;
  verse: number;
  passage: string;
  createdAt?: Date;
}

export const saveDraft = async (draft: Post) => {
  try {
    const docRef = await addDoc(collection(db, 'drafts'), draft);
    console.log('Draft salvo com ID:', docRef.id);
  } catch (e) {
    console.error('Erro ao salvar draft:', e);
  }
};

export const publishPost = async (post: Post) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), post);
    console.log('Post salvo com ID:', docRef.id);
  } catch (e) {
    console.error('Erro ao salvar post:', e);
  }
};
