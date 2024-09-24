import { Timestamp, collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

import { convertDateFirestore } from '../utils/helpers';
import { dbFirestore } from '../config/firebaseConfig';
import { COLLECTIONS } from '../utils/constants';


// Define a estrutura do Post
export interface Post {
  text: string;
  image: string;
  book: string;
  chapter: number;
  verse: number;
  passage: string;
  createdAt?: Date;
}

// Função para buscar posts do Firestore
export const fetchFirestorePosts = (
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
  setFirestoreStatus: React.Dispatch<React.SetStateAction<string>>
) => {
  const postsCollection = collection(dbFirestore, COLLECTIONS.COLLECTION_POSTS);
  const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
    const postsList = snapshot.docs.map(doc => {
      const data = doc.data() as Post;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? convertDateFirestore(data.createdAt) : new Date(),
      };
    }).sort((a, b) => {
      {
        const dateA = a.createdAt ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt ? b.createdAt.getTime() : 0;
        return dateA - dateB;
      }
});

    console.log('Posts recuperados:', postsList);
    setPosts(postsList);
    setFirestoreStatus('Conectado');
  }, (error) => {
    setFirestoreStatus('Erro ao conectar ao Firestore');
    console.error('Erro ao conectar ao Firestore:', error);
  });

  return unsubscribe; // Retorne a função de unsubscribe
};

// Função para adicionar um novo post ao Firestore
export const addFirestorePost = async (post: Post) => {
  try {
    const currentDate = new Date();
    const postWithDefaults = {
      ...post,
      createdAt: Timestamp.fromDate(currentDate),
    };

    console.log('Adicionando post:', JSON.stringify(postWithDefaults, null, 2)); // Log formatado

    // Verificando se todos os campos estão definidos
    if (!postWithDefaults.text || !postWithDefaults.book || !postWithDefaults.chapter || !postWithDefaults.verse) {
      console.error('Erro: Campos obrigatórios não estão definidos', postWithDefaults);
      throw new Error('Campos obrigatórios não estão definidos');
    }

    const docRef = await addDoc(collection(dbFirestore, 'posts'), postWithDefaults);
    console.log('Post salvo com ID:', docRef.id);
  } catch (e) {
    console.error('Erro ao salvar post:', e);
  }
};

// Função para adicionar um novo post, removendo campos indesejados
export const createAndAddPost = async (post: Post & { id?: string }) => {
  const { id, ...postToSave } = post; // Remove o campo id
  await addFirestorePost(postToSave);
};

// Função para atualizar um post existente no Firestore pelo ID
export const updateFirestorePost = async (postId: string, data: Partial<Post>) => {
  try {
    const docRef = doc(dbFirestore, COLLECTIONS.COLLECTION_POSTS, postId);
    console.log('Atualizando post:', { postId, data }); // Log para verificação
    await setDoc(docRef, data, { merge: true });
    console.log('Post atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
  }
};

// Função para excluir um post do Firestore pelo ID
export const deleteFirestorePostById = async (postId: string) => {
  try {
    const postRef = doc(dbFirestore, COLLECTIONS.COLLECTION_POSTS, postId);
    await deleteDoc(postRef);
    console.log('Post deletado com ID:', postId);
  } catch (e) {
    console.error('Erro ao deletar post:', e);
  }
};

// Função para adicionar um rascunho ao Firestore
export const addFirestoreDraft = async (draft: Post) => {
  try {
    const draftRef = doc(collection(dbFirestore, 'drafts'));
    await setDoc(draftRef, {
      ...draft,
      createdAt: Timestamp.fromDate(new Date()), // Use Timestamp para consistência
    });
    console.log('Rascunho salvo com ID:', draftRef.id);
  } catch (error) {
    console.error('Erro ao adicionar rascunho ao Firestore:', error);
  }
};
