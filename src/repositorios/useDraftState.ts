import DraftDao from "../database/DraftDao";
import { Draft } from "../types/types"
import { create } from "zustand";



interface State {
    drafts: Draft[]
    errorMessage: string
    isLoading: boolean
}

interface Actions {
    getAllWithoutDrafts: () => void
    deleteGraftById: (draftId: string) => void
    addDraft: (draft: Draft) => void
}

const initialState: State = {
    drafts: [],
    errorMessage: "",
    isLoading: false
}

export const useDraftState = create<Actions & State>()((set) => ({
     ...initialState,

      async addDraft(draft: Draft) {
        set(() => ({ isLoading: true }))

        try {
          DraftDao.shared.addDraft(draft)
            .then(() => {
                set((state) => ({ drafts: [...state.drafts, draft] }))
            })
            .catch(error => {
                console.log(error)
                set(() => ({ errorMessage: "Ocorreu um erro desconhecido ao cadastrar draft" }))
            })
          
        } catch (error) {
          console.error('Erro ao adicionar draft:', error);
        } finally {
            set(() => ({ isLoading: false }));
        }
      },

      async getAllWithoutDrafts() {
            set(() => ({ isLoading: true }));
        
            try {
                const newDrafts = await DraftDao.shared.getAllWithDrafts();

                set(() => ({
                    drafts: newDrafts, 
                }));
            } catch (error) {
                set(() => ({ errorMessage: "Erro ao carregar drafts" }));
                console.error(error);
            } finally {
                set(() => ({ isLoading: false }));  
            }
      },

      async deleteGraftById(draftId: string) {
        set(() => ({ isLoading: true}))

            await DraftDao.shared.deleteDraft(draftId)
            .then(() => {
                set((state) => ({
                    drafts: state.drafts.filter( draft => draft.id !== draftId)
                }))
            })
            .catch(error => {
                set(() => ({ errorMessage: error }))
                set(() => ({ isLoading: false}))
            })
            
            
      }
}))