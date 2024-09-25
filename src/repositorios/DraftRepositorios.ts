import {
  getDrafts as getDraftsFromDAO,
  deleteDraft as deleteDraftFromDAO,
  publishDraft as publishDraftFromDAO
} from '../dao/DraftDAO';
import DraftDao from '../database/DraftDao';
import { Draft } from '../types/types';

// Obter todos os rascunhos
// export const getDrafts = async (): Promise<Post[]> => {
//   try {
//     return await getDraftsFromDAO();
//   } catch (error) {
//     console.error('Erro ao obter drafts:', error);
//     return [];
//   }
// };

// Adicionar um novo rascunho
// export const addDraft = async (draft: Draft): Promise<Draft | void> => {
//   try {
//     let res = await DraftDao.shared.addDraft(draft)
//     console.log("Resposta", res)
//     return res
//   } catch (error) {
//     console.error('Erro ao adicionar draft:', error);
//   }
// };

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
