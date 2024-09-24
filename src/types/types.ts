// types.ts

export type Post = {
    id: string;
    book: string;
    text: string;
    createdAt: Date;
    image?: string;
    passage: string
    chapter: number
    verse: number 
  }
  
  // export interface Draft {
  //   id?: string; // Pode ser undefined para novos rascunhos
  //   book: string;
  //   text: string;
  //   createdAt?: Date; // Pode ser undefined para novos rascunhos
  //   image?: string;
  //   passage: string // Adiciona um campo opcional para imagens
  // }
  export type Draft = {
    id?: string;
    book: string;
    text: string;
    createdAt: Date;
    image?: string;
    passage: string
    chapter: number
    verse: number
  }
  
  export interface FirebaseError {
    code: string;
    message: string;
  }
  
  export interface ImageFile extends File {
    preview?: string;
  }
  
  export interface FormData {
    book: string;
    text: string;
    image?: ImageFile;
  }
  