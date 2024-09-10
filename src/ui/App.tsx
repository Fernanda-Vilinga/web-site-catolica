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
import AdicionarVersiculo from './AdicionarVersiculo';
import { getDrafts, addDraft, updateDraft, deleteDraft } from '../dao/indexedDBDraftDAO'; // IndexedDB
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'; // Firestore
import { db } from '../dao/firestorePostDAO';

// Cores e estilos
const headerBgColor = '#F5F5F5';

interface Post {
  id?: string;
  text: string;
  image: string; // Base64 string
  likes?: number;
  comments?: number;
  passage: string;
  book?: string;
  chapter?: number;
  verse?: number;
  createdAt?: Date; // Always Date
}

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
    const fetchData = async () => {
      try {
        const draftsList = await getDrafts();
        setDrafts(draftsList
          .map(draft => ({
            ...draft,
            createdAt: draft.createdAt instanceof Date ? draft.createdAt : new Date(draft.createdAt),
          }))
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        );

        const postsCollection = collection(db, 'posts');
        const postsSnapshot = await getDocs(postsCollection);
        const postsList = postsSnapshot.docs
          .map(doc => {
            const data = doc.data() as Post;
            return { id: doc.id, ...data, createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt) };
          })
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        setPosts(postsList);
        setFirestoreStatus('Conectado');
      } catch (error) {
        setFirestoreStatus('Erro ao conectar ao Firestore');
        console.error('Erro ao conectar ao Firestore:', error);
      }
    };

    fetchData();
  }, []);

  const handleSaveOrUpdate = async (draft: Post) => {
    try {
      const draftWithDefaults = {
        ...draft,
        createdAt: draft.createdAt || new Date(),
        book: draft.book || '',
        chapter: draft.chapter || 0,
        verse: draft.verse || 0,
        text: draft.text || '',
        image: draft.image || '', // Ensure the image is in Base64 format
      };

      if (draft.id) {
        await updateDraft(draft.id, draftWithDefaults);
        setDrafts(prevDrafts =>
          prevDrafts
            .map(d => d.id === draft.id ? draftWithDefaults : d)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        );
      } else {
        const id = await addDraft(draftWithDefaults);
        setDrafts(prevDrafts =>
          [...prevDrafts, { ...draftWithDefaults, id }]
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        );
      }
      setActiveTab('drafts');
      setEditingDraft(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar rascunho: ', error);
    }
  };

  const handlePublish = async (post: Post) => {
    try {
      const postWithDefaults = {
        ...post,
        createdAt: Timestamp.fromDate(new Date()),
        book: post.book || '',
        chapter: post.chapter || 0,
        verse: post.verse || 0,
        text: post.text || '',
        image: post.image || '', // Ensure the image is in Base64 format
      };

      const postsCollection = collection(db, 'posts');
      await addDoc(postsCollection, postWithDefaults);

      setPosts(prevPosts =>
        [...prevPosts, { ...postWithDefaults, createdAt: new Date() }]
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );
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
      await deleteDraft(draftId);
      setDrafts(prevDrafts =>
        prevDrafts
          .filter(draft => draft.id !== draftId)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    } catch (error) {
      console.error('Erro ao deletar rascunho:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);
      setPosts(prevPosts =>
        prevPosts
          .filter(post => post.id !== postId)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    } catch (error) {
      console.error('Erro ao deletar publicação:', error);
    }
  };

  const handleOpenAddVersiculo = () => {
    setEditingDraft(null);
    setIsModalOpen(true);
  };

  // Função para converter arquivos para Base64
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
            onImageChange={handleImageChange} // Adicione a prop para lidar com mudanças de imagem
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
                                src={draft.image} // Exibindo a imagem Base64
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
                                src={post.image} // Exibindo a imagem Base64
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

