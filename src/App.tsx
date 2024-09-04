import React, { useState, useEffect } from 'react';
import { Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel, IconButton, SimpleGrid } from '@chakra-ui/react';
import { MdFavorite, MdMessage, MdFavoriteBorder } from 'react-icons/md';
import Header from './Componentes/Hearder';
import AdicionarVersiculo from './Componentes/AdicionarVersiculo';
import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const headerBgColor = '#F5F5F5';

interface Publication {
  text: string;
  image: string | ArrayBuffer | null;
  likes: number;
  comments: number;
  passage: string; // Adicione esta linha
}

const App: React.FC = () => {
  const [drafts, setDrafts] = useState<Publication[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [activeTab, setActiveTab] = useState<'drafts' | 'publications'>('publications');
  const [firestoreStatus, setFirestoreStatus] = useState<string>('Verificando conexão...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const draftsCollection = collection(db, 'drafts');
        const draftsSnapshot = await getDocs(draftsCollection);
        const draftsList = draftsSnapshot.docs.map(doc => doc.data() as Publication);
        setDrafts(draftsList);

        const publicationsCollection = collection(db, 'publications');
        const publicationsSnapshot = await getDocs(publicationsCollection);
        const publicationsList = publicationsSnapshot.docs.map(doc => doc.data() as Publication);
        setPublications(publicationsList);

        setFirestoreStatus('Conectado');
      } catch (error) {
        setFirestoreStatus('Erro ao conectar ao Firestore');
        console.error('Erro ao conectar ao Firestore:', error);
      }
    };

    fetchData();
  }, []);

  const handleSaveDraft = async (draft: Publication) => {
    try {
      const draftsCollection = collection(db, 'drafts');
      await addDoc(draftsCollection, draft);
      setDrafts(prevDrafts => [...prevDrafts, draft]);
      setActiveTab('drafts');
    } catch (error) {
      console.error('Erro ao salvar rascunho: ', error);
    }
  };

  const handlePublish = async (publication: Publication) => {
    try {
      const publicationsCollection = collection(db, 'publications');
      await addDoc(publicationsCollection, publication);
      setPublications(prevPublications => [...prevPublications, publication]);
      setActiveTab('publications');
    } catch (error) {
      console.error('Erro ao publicar: ', error);
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
          <AdicionarVersiculo 
            onSaveDraft={handleSaveDraft} 
            onPublish={handlePublish} 
          />
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" mb={4} gap={4}>
          <Box width="100%" maxWidth="800px">
            <Text fontSize="lg" fontWeight="bold" mb={2} textAlign="center">Visualizar:</Text>
            <Tabs 
              variant="enclosed" 
              isLazy 
              onChange={(index) => setActiveTab(index === 0 ? 'drafts' : 'publications')}
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
                          key={index} 
                          p={4} 
                          borderBottom="1px solid #ddd" 
                          borderRadius="md"
                          bg="white"
                          boxShadow="md"
                          position="relative"
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
                                src={draft.image as string}
                                alt={`Imagem do rascunho ${index}`}
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
                                <Text fontWeight="bold" mb={2}>
                                  Versículo do dia
                                </Text>
                                <Text mb={2}>
                                  {draft.text}
                                </Text>
                                <Text fontSize="sm">
                                  {draft.passage} {/* Exiba a passagem bíblica aqui */}
                                </Text>
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
                                bg="transparent" 
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
                          )}
                        </Box>
                      ))
                    )}
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {publications.length === 0 ? (
                      <Text>Nenhuma publicação ainda.</Text>
                    ) : (
                      publications.map((publication, index) => (
                        <Box 
                          key={index} 
                          p={4} 
                          borderBottom="1px solid #ddd" 
                          borderRadius="md"
                          bg="white"
                          boxShadow="md"
                          position="relative"
                        >
                          {publication.image && (
                            <Box
                              position="relative"
                              width="100%"
                              height="200px"
                              overflow="hidden"
                              borderRadius="md"
                            >
                              <img
                                src={publication.image as string}
                                alt={`Imagem da publicação ${index}`}
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
                              >
                                <Text fontWeight="bold" mb={2}>
                                  Versículo do dia
                                </Text>
                                <Text mb={2}>
                                  {publication.text}
                                </Text>
                                <Text fontSize="sm">
                                  {publication.passage} {/* Exiba a passagem bíblica aqui */}
                                </Text>
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
                                    colorScheme="teal"
                                  />
                                  <Text fontSize="sm" mt={1}>{publication.likes}</Text>
                                </Box>
                                <Box textAlign="center" color="white">
                                  <IconButton
                                    color="white"
                                    icon={<MdMessage />}
                                    aria-label="Comentário"
                                    variant="ghost"
                                    colorScheme="teal"
                                  />
                                  <Text fontSize="sm" mt={1}>{publication.comments}</Text>
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
