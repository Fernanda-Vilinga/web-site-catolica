/* // Repositório para rascunhos
import { getDrafts, addDraft, updateDraft, deleteDraft } from '../dao/indexedDBDraftDAO';
import { Post } from '../types/types';

export const fetchDrafts = async (): Promise<Post[]> => {
  return await getDrafts();
};

export const saveOrUpdateDraft = async (draft: Post): Promise<void> => {
  if (draft.id) {
    await updateDraft(draft.id, draft);
  } else {
    await addDraft(draft);
  }
};

export const removeDraft = async (id: string): Promise<void> => {
  await deleteDraft(id);
};
 */