import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  SimpleGrid,
  Button
} from '@chakra-ui/react';
import {
  MdFavorite,
  MdMessage,
  MdEdit,
  MdDelete
} from 'react-icons/md';
import Header from './HearderUI'; 
import AdicionarVersiculo from './AdicionarVersiculoUI';
import {
  getDrafts,
  deleteDraft as deleteDraftById
} from '../repositorios/DraftRepositorios';
import {
  fetchPosts,
  deletePost as deletePostById,
  publishPost,
  addDraft
} from '../repositorios/PostRepositorios';

interface Post {
  id?: string;
  passage: string;
  text: string;
  image?: string;
  createdAt?: Date;
  likes?: number;
  comments?: number;
}

const headerBgColor = '#F5F5F5';

const formatDate = (date: Date | undefined) => {
  if (!date) return 'Data inválida';
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const extractTextAfterReference = (text: string) => {
  const cleanedText = text.replace('passagembiblic', '').trim();
  const splitText = cleanedText.split(' - ');
  return splitText.length > 1 ? splitText[1] : cleanedText;
};

const App: React.FC = () => {
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [firestoreStatus, setFirestoreStatus] = useState<string>('Desconectado');
  const [activeTab, setActiveTab] = useState<'drafts' | 'posts'>('posts');
  const [editingDraft, setEditingDraft] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const draftsData = await getDrafts();
        setDrafts(Array.isArray(draftsData) ? draftsData : []);
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const unsubscribe = fetchPosts(setPosts, setFirestoreStatus);
    return () => unsubscribe();
  }, []);

  const handleSaveOrUpdate = async (draft: Post) => {
    try {
      await addDraft(draft);
      const draftsData = await getDrafts();
      setDrafts(Array.isArray(draftsData) ? draftsData : []);
      setEditingDraft(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar ou atualizar rascunho:', error);
    }
  };

  const handlePublish = async (draft: Post) => {
    try {
      await publishPost(draft);
      await deleteDraftById(draft.id!);
      setDrafts(drafts.filter(d => d.id !== draft.id));
    } catch (error) {
      console.error('Erro ao publicar post:', error);
    }
  };

  const handleEditDraft = (draft: Post) => {
    setEditingDraft(draft);
    setIsModalOpen(true);
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      await deleteDraftById(draftId);
      setDrafts(drafts.filter(draft => draft.id !== draftId));
    } catch (error) {
      console.error('Erro ao excluir rascunho:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePostById(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Erro ao excluir post:', error);
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
        if (editingDraft) {
          setEditingDraft({ ...editingDraft, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Header />
      <Box
        p={4}
        bg={headerBgColor}
        minH="calc(100vh - 80px)"
        mt="6"
        mx="auto"
        maxW="container.xl"
        borderRadius="md"
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
        position="relative"
      >
        <Box position="absolute" top="4" right="4" zIndex="1">
          <Button colorScheme="blue" onClick={handleOpenAddVersiculo}>
            Adicionar versículo
          </Button>
          <AdicionarVersiculo
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            draft={editingDraft}
            onSaveDraft={handleSaveOrUpdate}
            onPublish={handlePublish}
            onImageChange={handleImageChange}
          />
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" mb={4} gap={4}>
          <Box width="100%" maxWidth="800px">
            <Text fontSize="lg" fontWeight="bold" mb={2} textAlign="center">Visualizar:</Text>
            <Tabs
              variant="enclosed"
              isLazy
              onChange={(index) => setActiveTab(index === 0 ? 'drafts' : 'posts')}
              align="center"
            >
              <TabList>
                <Tab>Rascunhos</Tab>
                <Tab>Publicações</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {drafts.length === 0 ? (
                      <Text>Nenhum rascunho ainda.</Text>
                    ) : (
                      drafts.map((draft, index) => (
                        <Box
                          key={draft.id || `draft-${index}`} // Chave única
                          p={4}
                          borderBottom="1px solid #ddd"
                          borderRadius="md"
                          bg="white"
                          boxShadow="md"
                          position="relative"
                          display="flex"
                          flexDirection="column"
                          overflow="hidden"
                        >
                          {draft.image && (
                            <Box
                              position="relative"
                              width="100%"
                              height="200px"
                              overflow="hidden"
                              borderRadius="md"
                            >
                              <img
                                src={draft.image}
                                alt="Imagem do rascunho"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block'
                                }}
                              />
                              <Box
                                position="absolute"
                                top="0"
                                left="0"
                                width="100%"
                                height="100%"
                                color="white"
                                bg="rgba(0, 0, 0, 0.6)"
                                p={2}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                textAlign="center"
                                zIndex={1}
                              >
                                <Text mb={2} fontWeight="bold">{draft.passage}</Text>
                                <Text mb={2}>{extractTextAfterReference(draft.text)}</Text>
                                {draft.createdAt && (
                                  <Text fontSize="xs" mt={2}>
                                    Criado em: {formatDate(draft.createdAt)}
                                  </Text>
                                )}
                                <Box
                                  position="absolute"
                                  top="4px"
                                  right="2px"
                                  zIndex={2}
                                  display="flex"
                                  flexDirection="row"
                                  alignItems="center"
                                  gap={2}
                                >
                                  <Button
                                    colorScheme="green"
                                    onClick={() => handlePublish(draft)}
                                  >
                                    Publicar
                                  </Button>
                                  <IconButton
                                    icon={<MdDelete />}
                                    aria-label="Excluir"
                                    variant="ghost"
                                    color="white"
                                    onClick={() => handleDeleteDraft(draft.id!)}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      ))
                    )}
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {posts.length === 0 ? (
                      <Text>Nenhuma publicação ainda.</Text>
                    ) : (
                      posts.map((post, index) => (
                        <Box
                          key={post.id || `post-${index}`} // Chave única
                          p={4}
                          borderBottom="1px solid #ddd"
                          borderRadius="md"
                          bg="white"
                          boxShadow="md"
                          position="relative"
                          display="flex"
                          flexDirection="column"
                          overflow="hidden"
                        >
                          {post.image && (
                            <Box
                              position="relative"
                              width="100%"
                              height="200px"
                              overflow="hidden"
                              borderRadius="md"
                            >
                              <img
                                src={post.image}
                                alt="Imagem da publicação"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block'
                                }}
                              />
                              <Box
                                position="absolute"
                                top="0"
                                left="0"
                                width="100%"
                                height="100%"
                                color="white"
                                bg="rgba(0, 0, 0, 0.6)"
                                p={4}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                textAlign="center"
                                zIndex={1}
                              >
                                <Text mb={2} fontWeight="bold">{post.passage}</Text>
                                <Text mb={2}>{extractTextAfterReference(post.text)}</Text>
                                {post.createdAt && (
                                  <Text fontSize="xs" mt={2}>
                                    Criado em: {formatDate(post.createdAt)}
                                  </Text>
                                )}
                                <Box
                                  position="absolute"
                                  top="4px"
                                  right="2px"
                                  zIndex={2}
                                  display="flex"
                                  flexDirection="row"
                                  alignItems="center"
                                  gap={2}
                                >
                                  <IconButton
                                    icon={<MdEdit />}
                                    aria-label="Editar"
                                    variant="ghost"
                                    color="white"
                                    onClick={() => handleEditDraft(post)}
                                  />
                                  <IconButton
                                    icon={<MdDelete />}
                                    aria-label="Excluir"
                                    variant="ghost"
                                    color="white"
                                    onClick={() => handleDeletePost(post.id!)}
                                  />
                                </Box>
                                <Box
                                  position="absolute"
                                  bottom="0"
                                  left="0"
                                  width="100%"
                                  p={2}
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  zIndex={2}
                                  bg="rgba(0, 0, 0, 0.3)"
                                >
                                  <Box textAlign="center" color="white">
                                    <IconButton
                                      color="white"
                                      icon={<MdFavorite />}
                                      aria-label="Curtir"
                                      variant="ghost"
                                    />
                                    <Text fontSize="sm" mt={1}>{post.likes || 0}</Text>
                                  </Box>
                                  <Box textAlign="center" color="white">
                                    <IconButton
                                      color="white"
                                      icon={<MdMessage />}
                                      aria-label="Comentário"
                                      variant="ghost"
                                    />
                                    <Text fontSize="sm" mt={1}>{post.comments || 0}</Text>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      ))
                    )}
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
