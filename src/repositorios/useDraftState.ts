import { Draft } from "../types/types"
import { create } from "zustand";
import DraftDao from "../database/DraftDao";


interface State {
    drafts: Draft[]
    errorMessage: string
    isLoading: boolean
}

interface Actions {
    getAllWithoutDrafts: () => void
    deleteGraftById: (draftId: string) => void
}

const initialState: State = {
    drafts: [],
    errorMessage: "",
    isLoading: false
}

export const useDraftState = create<Actions & State>()((set) => ({
     ...initialState,

      async getAllWithoutDrafts() {
            set(() => ({ isLoading: true }));
        
            try {
                const newDrafts = await DraftDao.shared.getAllWithDrafts();

                console.log("newDrafts", newDrafts)
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
            try {
                await DraftDao.shared.deleteDraft(draftId)

                set((state) => ({
                    drafts: state.drafts.filter( draft => draft.id !== draftId)
                }))
            } catch (error) {
                throw error
            }
      }
}))