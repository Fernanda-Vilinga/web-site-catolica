import {

  //updateFirestorePost,
  deleteFirestorePostById,
  addFirestoreDraft,
  createAndAddPost,
  addFirestorePost, // Importando a nova função
} from '../dao/PostDAO';

import { Draft, Post } from '../types/types';

// Função para buscar posts
/*
export const fetchPosts = (
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
  setFirestoreStatus: React.Dispatch<React.SetStateAction<string>>
) => {
  return fetchPostsFromFirestore(setPosts, setFirestoreStatus);
};


export const fetchPosts = (
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
  setFirestoreStatus: React.Dispatch<React.SetStateAction<string>>
) => {
  return fetchPostsFromFirestore(setPosts, setFirestoreStatus);
};

Função para adicionar um novo post
export const addPost = async (post: Post & { id?: string }) => {
  try {
    console.log('Adicionando post:', post);
    await createAndAddPost(post); // Usando a nova função
  } catch (error) {
    console.error('Erro ao adicionar post:', error);
  }
};
*/

export const addPost = async (post: Post) => {
  try {
    console.log('Adicionando post:', post);
    await addFirestorePost(post); // Usando a nova função
  } catch (error) {
    console.error('Erro ao adicionar post:', error);
  }
};

// Função para adicionar um rascunho
export const addDraft = async (draft: Draft) => {
  try {
    await addFirestoreDraft(draft);
  } catch (error) {
    console.error('Erro ao adicionar rascunho:', error);
  }
};

// Função para atualizar um post existente
// export const updatePost = async (postId: string, updatedPost?: Partial<Post>) => {
//   try {
//     await updateFirestorePost(postId, updatedPost);
//   } catch (error) {
//     console.error('Erro ao atualizar post:', error);
//   }
// };

// Função para deletar um post
export const deletePost = async (postId: string) => {
  try {
    await deleteFirestorePostById(postId);
  } catch (error) {
    console.error('Erro ao deletar post:', error);
  }
};

// Função para publicar um post
export const puublishPost = async (post: Post & { id?: string }) => {
  try {
    console.log('Adicionando post:', post);
    await createAndAddPost(post); // Usando a nova função
    console.log('Post publicado com sucesso!');
  } catch (error) {
    console.error('Erro ao publicar post:', error);
  }
};
