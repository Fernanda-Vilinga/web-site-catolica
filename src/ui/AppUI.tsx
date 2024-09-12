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
  MdFavoriteBorder,
  MdEdit,
  MdDelete
} from 'react-icons/md';
import Header from './HearderUI';
import AdicionarVersiculo from './AdicionarVersiculoUI';
import { 
  fetchData, 
  saveOrUpdateDraft, 
  publishPost, 
  deleteDraftById, 
  deletePostById 
} from '../repositorios/AppRepositorios';


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
  const [activeTab, setActiveTab] = useState<'drafts' | 'posts'>('posts');
  const [firestoreStatus, setFirestoreStatus] = useState<string>('Verificando conexão...');
  const [editingDraft, setEditingDraft] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchData(setDrafts, setPosts, setFirestoreStatus);
  }, []);

  const handleSaveOrUpdate = (draft: Post) => {
    saveOrUpdateDraft(draft, setDrafts, setActiveTab, setEditingDraft, setIsModalOpen);
  };

  const handlePublish = (post: Post) => {
    publishPost(post, setPosts, setActiveTab);
  };

  const handleEditDraft = (draft: Post) => {
    setEditingDraft(draft);
    setIsModalOpen(true);
  };

  const handleDeleteDraft = (draftId: string) => {
    deleteDraftById(draftId, setDrafts);
  };

  const handleDeletePost = (postId: string) => {
    deletePostById(postId, setPosts);
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
        <Box
          position="absolute"
          top="4"
          right="4"
          zIndex="1"
        >
          <Button
            colorScheme="blue"
            onClick={handleOpenAddVersiculo}
          >
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
                      drafts.map(draft => (
                        <Box
                          key={draft.id}
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
                                alt={`Imagem do rascunho`}
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
                                overflow="hidden"
                                whiteSpace="pre-wrap"
                                borderRadius="md"
                                zIndex={1}
                              >
                                <Box display="flex" flexDirection="column" marginRight={24}>
                                  <Text mb={0} fontSize={12} mr={12}>
                                    Versículo do dia
                                  </Text>
                                  <Text mb={2} fontWeight="bold" mr={8}>
                                    {draft.passage}
                                  </Text>
                                </Box>
                                <Text
                                  mb={2}
                                  style={{
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {extractTextAfterReference(draft.text)}
                                </Text>
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
                                  <IconButton
                                    icon={<MdEdit />}
                                    aria-label="Editar"
                                    variant="ghost"
                                    color="white"
                                    onClick={() => handleEditDraft(draft)}
                                  />
                                  <IconButton
                                    icon={<MdDelete />}
                                    aria-label="Excluir"
                                    variant="ghost"
                                    color="white"
                                    onClick={() => handleDeleteDraft(draft.id!)}
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
                                      icon={<MdFavoriteBorder />}
                                      aria-label="Curtir"
                                      variant="ghost"
                                      _hover={{ bg: 'transparent' }}
                                      _active={{ bg: 'transparent' }}
                                    />
                                    <Text fontSize="sm" mt={1}>10</Text>
                                  </Box>
                                  <Box textAlign="center" color="white">
                                    <IconButton
                                      color="white"
                                      icon={<MdMessage />}
                                      aria-label="Comentário"
                                      variant="ghost"
                                      _hover={{ bg: 'transparent' }}
                                      _active={{ bg: 'transparent' }}
                                    />
                                    <Text fontSize="sm" mt={1}>5</Text>
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
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {posts.length === 0 ? (
                      <Text>Nenhuma publicação ainda.</Text>
                    ) : (
                      posts.map(post => (
                        <Box
                          key={post.id}
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
                                alt={`Imagem da publicação`}
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
                                overflow="hidden"
                                whiteSpace="pre-wrap"
                                borderRadius="md"
                                zIndex={1}
                              >
                                <Box display="flex" flexDirection="column" marginRight={24}>
                                  <Text mb={0} fontWeight="bold">
                                    Versículo do dia
                                  </Text>
                                  <Text mb={2} fontWeight="bold">
                                    {post.passage}
                                  </Text>
                                </Box>
                                <Text
                                  mb={2}
                                  style={{
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {extractTextAfterReference(post.text)}
                                </Text>
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
                                      _hover={{ bg: 'transparent' }}
                                      _active={{ bg: 'transparent' }}
                                    />
                                    <Text fontSize="sm" mt={1}>{post.likes || 0}</Text>
                                  </Box>
                                  <Box textAlign="center" color="white">
                                    <IconButton
                                      color="white"
                                      icon={<MdMessage />}
                                      aria-label="Comentário"
                                      variant="ghost"
                                      _hover={{ bg: 'transparent' }}
                                      _active={{ bg: 'transparent' }}
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
