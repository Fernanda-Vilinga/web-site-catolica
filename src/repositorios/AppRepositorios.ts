import { Timestamp, collection, onSnapshot, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getDrafts, addDraft, updateDraft, deleteDraft } from '../dao/indexedDBDraftDAO'; // IndexedDB
import { db } from '../dao/firestorePostDAO'; 

export interface Post {
  id?: string;
  text: string;
  image?: string; 
  likes?: number;
  comments?: number;
  passage: string;
  book?: string;
  chapter?: number;
  verse?: number;
  createdAt?: Date;
}

export const fetchData = (
  setDrafts: React.Dispatch<React.SetStateAction<Post[]>>,
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
  setFirestoreStatus: React.Dispatch<React.SetStateAction<string>>
) => {
 
  const postsCollection = collection(db, 'posts');
  const unsubscribePosts = onSnapshot(postsCollection, (snapshot) => {
    const postsList = snapshot.docs
      .map(doc => {
        const data = doc.data() as Post;
        return { id: doc.id, ...data, createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt) };
      })
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    setPosts(postsList);
    setFirestoreStatus('Conectado');
  }, (error) => {
    setFirestoreStatus('Erro ao conectar ao Firestore');
    console.error('Erro ao conectar ao Firestore:', error);
  });

 
  const fetchDrafts = async () => {
    try {
      const draftsList = await getDrafts();
      setDrafts(
        draftsList
          .map(draft => ({
            ...draft,
            createdAt: draft.createdAt instanceof Date ? draft.createdAt : new Date(draft.createdAt),
          }))
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    } catch (error) {
      console.error('Erro ao buscar rascunhos:', error);
    }
  };

  fetchDrafts();
 
  return () => unsubscribePosts();
};

export const saveOrUpdateDraft = async (
  draft: Post,
  setDrafts: React.Dispatch<React.SetStateAction<Post[]>>,
  setActiveTab: React.Dispatch<React.SetStateAction<'drafts' | 'posts'>>,
  setEditingDraft: React.Dispatch<React.SetStateAction<Post | null>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const draftWithDefaults = {
      ...draft,
      createdAt: draft.createdAt || new Date(),
      book: draft.book || '',
      chapter: draft.chapter || 0,
      verse: draft.verse || 0,
      text: draft.text || '',
      image: draft.image || '',
    };

    if (draft.id) {
      await updateDraft(draft.id, draftWithDefaults);
      setDrafts(prevDrafts =>
        prevDrafts
          .map(d => d.id === draft.id ? draftWithDefaults : d)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    } else {
      const existingDraft = await getDrafts().then(drafts => drafts.find(draft => draft.text === draft.text));
      if (existingDraft) {
        console.warn('Rascunho já existente.');
        return;
      }
      const id = await addDraft(draftWithDefaults);
      setDrafts(prevDrafts =>
        [...prevDrafts, { ...draftWithDefaults, id }]
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    }
    setActiveTab('drafts');
    setEditingDraft(null);
    setIsModalOpen(false);
  } catch (error) {
    console.error('Erro ao salvar rascunho: ', error);
  }
};

export const publishPost = async (
  post: Post,
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
  setActiveTab: React.Dispatch<React.SetStateAction<'drafts' | 'posts'>>
) => {
  try {
    const postWithDefaults = {
      ...post,
      createdAt: Timestamp.fromDate(new Date()),
      book: post.book || '',
      chapter: post.chapter || 0,
      verse: post.verse || 0,
      text: post.text || '',
      image: post.image || '',
    };

    
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, where('text', '==', post.text));
    const postsSnapshot = await getDocs(q);
    if (!postsSnapshot.empty) {
      console.warn('Post já existente.');
      return;
    }

    await addDoc(postsCollection, postWithDefaults);

    
    setActiveTab('posts');
  } catch (error) {
    console.error('Erro ao publicar: ', error);
  }
};

export const deleteDraftById = async (
  draftId: string,
  setDrafts: React.Dispatch<React.SetStateAction<Post[]>>
) => {
  try {
    await deleteDraft(draftId);
    setDrafts(prevDrafts =>
      prevDrafts
        .filter(draft => draft.id !== draftId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    );
  } catch (error) {
    console.error('Erro ao deletar rascunho:', error);
  }
};

export const deletePostById = async (
  postId: string,
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
    setPosts(prevPosts =>
      prevPosts
        .filter(post => post.id !== postId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    );
  } catch (error) {
    console.error('Erro ao deletar publicação:', error);
  }
};
