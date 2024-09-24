import {
  getDrafts as getDraftsFromDAO,
  addDraft as addDraftToDAO,
  deleteDraft as deleteDraftFromDAO,
  publishDraft as publishDraftFromDAO
} from '../dao/DraftDAO';
import { Post } from '../dao/PostDAO';

// Obter todos os rascunhos
export const getDrafts = async (): Promise<Post[]> => {
  try {
    return []
   // return await getDraftsFromDAO();
  } catch (error) {
    console.error('Erro ao obter drafts:', error);
    return [];
  }
};

// Adicionar um novo rascunho
export const addDraft = async (draft: Post): Promise<number | void> => {
  try {
    ///return await addDraftToDAO(draft);
  } catch (error) {
    console.error('Erro ao adicionar draft:', error);
  }
};

// Deletar um rascunho pelo ID
export const deleteDraft = async (id: number): Promise<void> => {
  try {
    await deleteDraftFromDAO(id);
  } catch (error) {
    console.error('Erro ao deletar draft:', error);
  }
};

// Publicar um rascunho
export const publishDraft = async (id: number): Promise<void> => {
  try {
    await publishDraftFromDAO(id);
  } catch (error) {
    console.error('Erro ao publicar draft:', error);
  }
};
