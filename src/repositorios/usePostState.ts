import { Post } from "../types/types"
import { create } from "zustand";
import PostDao from '../database/PostDao';


interface State {
    posts: Post[]
    errorMessage: string
    isLoading: boolean
}

interface Actions {
     getAllWithoutPosts: () => void
}

const initialState: State = {
    posts: [],
    errorMessage: "",
    isLoading: false
}

export const usePostState = create<Actions & State>()((set) => ({
     ...initialState,

      async getAllWithoutPosts() {
        set(() => ({ isLoading: true }));
    
        try {
            const newPosts = await PostDao.shared.getAllWithPosts();
            console.log("newPosts", newPosts)
            set(() => ({
                posts: newPosts, 
            }));
        } catch (error) {
            set(() => ({ errorMessage: "Erro ao carregar couriers" }));
            console.error(error);
        } finally {
            set(() => ({ isLoading: false }));
        }
    }
}))