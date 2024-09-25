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
     deletePostById: (postId: string) => void
     updatePostById: (postId: string, post: Post) => void
     addPost: (post: Post) => void
     publishPost: (post: Post) => void
}

const initialState: State = {
    posts: [],
    errorMessage: "",
    isLoading: false
}

export const usePostState = create<Actions & State>()((set) => ({
     ...initialState,

     async publishPost(post: Post) {
        set(() => ({ isLoading: true }))

        try {
            const publishPostResult = await PostDao.shared.publishPost(post)

            set((state) => ({
                posts: [...state.posts, publishPostResult]
            }))

         } catch (error) {
            set(() => ({ errorMessage: "Erro ao adicionar post" }));
            console.error(error);
        } finally {
            set(() => ({ isLoading: false }));
        }
     },

      async addPost(post: Post) {
        set(() => ({ isLoading: true }));

         try {
            const postResult = await PostDao.shared.addPost(post)

            set((state) => ({
                posts: [...state.posts, postResult]
            }))

         } catch (error) {
            set(() => ({ errorMessage: "Erro ao adicionar post" }));
            console.error(error);
        } finally {
            set(() => ({ isLoading: false }));
        }
      },

      async getAllWithoutPosts() {
        set(() => ({ isLoading: true }));
    
        try {
            const newPosts = await PostDao.shared.getAllWithPosts();
            
            set(() => ({ posts: newPosts}));

        } catch (error) {
            set(() => ({ errorMessage: "Erro ao carregar couriers" }));
            console.error(error);
        } finally {
            set(() => ({ isLoading: false }));
        }
    },

    async updatePostById(postId: string, post: Post) {
        set(() => ({ isLoading: true }))

        try {
            await PostDao.shared.updatePost(postId, post)

            set((state) => ({
                posts: state.posts.map((oldPost) => oldPost.id === postId ? {...oldPost, post
                }: oldPost)
            }))
        } catch (error) {
            console.error("Erro ao atualizar o post", error);
        } finally {
            set(() => ({ isLoading: false}))
        }
    },

    async deletePostById(postId: string) {
        set(() => ({ isLoading: true}))

        try {
            await PostDao.shared.deletePostById(postId)

            set((state) => ({
                posts: state.posts.filter( post => post.id !== postId)
            }))
        } catch (error) {
            throw error
        } finally {
            set(() => ({ isLoading: false}))
        }
  }
}))