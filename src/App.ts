import React, { useState, useEffect } from 'react';
import { Post } from './types';
import { fetchDrafts, saveOrUpdateDraft, removeDraft } from '../repositorio/draftRepository';
import { fetchPosts, publishPost, removePost } from '../repositorio/postRepository';
import AppUI from './AppUI';

const App: React.FC = () => {
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'drafts' | 'posts'>('posts');
  const [firestoreStatus, setFirestoreStatus] = useState<string>('Verificando conexão...');
  const [editingDraft, setEditingDraft] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const draftsData = await fetchDrafts();
        setDrafts(draftsData);

        const postsData = await fetchPosts();
        setPosts(postsData);
        setFirestoreStatus('Conectado');
      } catch (error) {
        setFirestoreStatus('Erro ao conectar ao Firestore');
        console.error('Erro ao conectar ao Firestore:', error);
      }
    };

    loadData();
  }, []);

  const handleSaveOrUpdate = async (draft: Post) => {
    try {
      await saveOrUpdateDraft(draft);
      const draftsData = await fetchDrafts();
      setDrafts(draftsData);
      setActiveTab('drafts');
      setEditingDraft(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar rascunho: ', error);
    }
  };

  const handlePublish = async (post: Post) => {
    try {
      await publishPost(post);
      const postsData = await fetchPosts();
      setPosts(postsData);
      setActiveTab('posts');
    } catch (error) {
      console.error('Erro ao publicar: ', error);
    }
  };

  const handleEditDraft = (draft: Post) => {
    setEditingDraft(draft);
    setIsModalOpen(true);
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      await removeDraft(draftId);
      const draftsData = await fetchDrafts();
      setDrafts(draftsData);
    } catch (error) {
      console.error('Erro ao deletar rascunho:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await removePost(postId);
      const postsData = await fetchPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Erro ao deletar publicação:', error);
    }
  };

  const handleOpenAddVersiculo = () => {
    setEditingDraft(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (editingDraft) {
          setEditingDraft({ ...editingDraft, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppUI
      drafts={drafts}
      posts={posts}
      activeTab={activeTab}
      firestoreStatus={firestoreStatus}
      editingDraft={editingDraft}
      isModalOpen={isModalOpen}
      onSaveOrUpdate={handleSaveOrUpdate}
      onPublish={handlePublish}
      onEditDraft={handleEditDraft}
      onDeleteDraft={handleDeleteDraft}
      onDeletePost={handleDeletePost}
      onOpenAddVersiculo={handleOpenAddVersiculo}
      onImageChange={handleImageChange}
      setActiveTab={setActiveTab}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

export default App;
