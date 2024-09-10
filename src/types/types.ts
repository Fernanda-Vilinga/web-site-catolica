// types.ts

export interface Post {
    id: string;
    book: string;
    text: string;
    createdAt: Date;
    image?: string; // Adiciona um campo opcional para imagens
  }
  
  export interface Draft {
    id?: string; // Pode ser undefined para novos rascunhos
    book: string;
    text: string;
    createdAt?: Date; // Pode ser undefined para novos rascunhos
    image?: string; // Adiciona um campo opcional para imagens
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
  