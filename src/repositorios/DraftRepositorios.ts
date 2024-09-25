import {
  deleteDraft as deleteDraftFromDAO,
  publishDraft as publishDraftFromDAO
} from '../dao/DraftDAO';


// Obter todos os rascunhos
// export const getDrafts = async (): Promise<Post[]> => {
//   try {
//     return await getDraftsFromDAO();
//   } catch (error) {
//     console.error('Erro ao obter drafts:', error);
//     return [];
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
