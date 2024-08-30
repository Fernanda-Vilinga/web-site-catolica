import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { getBibleData, BibleBook } from '../data/bibleData';

const AdicionarVersiculo: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const [bibleBooks, setBibleBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  const [chapters, setChapters] = useState<string[]>([]);
  const [verses, setVerses] = useState<string[]>([]);

  useEffect(() => {
    const data = getBibleData();
    setBibleBooks(data);
  }, []);

  useEffect(() => {
    if (selectedBook) {
      const book = bibleBooks.find(book => book.abbrev === selectedBook);
      if (book) {
        setChapters(book.chapters.map((_, index) => `Capítulo ${index + 1}`));
      } else {
        setChapters([]);
      }
    }
  }, [selectedBook, bibleBooks]);

  useEffect(() => {
    if (selectedBook && selectedChapter !== null) {
      const book = bibleBooks.find(book => book.abbrev === selectedBook);
      if (book) {
        const versesList = book.chapters[selectedChapter - 1] || [];
        setVerses(versesList.map((verse, index) => `Versículo ${index + 1}`));
        setSelectedText(versesList[selectedVerse ?? 0] || null);
      } else {
        setVerses([]);
        setSelectedText(null);
      }
    }
  }, [selectedChapter, selectedBook, selectedVerse, bibleBooks]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleBookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBook(event.target.value);
    setSelectedChapter(null);
    setSelectedVerse(null);
  };

  const handleChapterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChapter(Number(event.target.value));
    setSelectedVerse(null);
  };

  const handleVerseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVerse(Number(event.target.value));
    const book = bibleBooks.find(book => book.abbrev === selectedBook);
    if (book && selectedChapter !== null) {
      const verseText = book.chapters[selectedChapter - 1][Number(event.target.value) - 1] || null;
      setSelectedText(verseText);
    }
  };

  const getFormattedReference = () => {
    if (selectedBook && selectedChapter !== null && selectedVerse !== null) {
      const book = bibleBooks.find(book => book.abbrev === selectedBook);
      return book ? `${book.name} ${selectedChapter}:${selectedVerse}` : '';
    }
    return '';
  };

  return (
    <>
      <Button variant="solid" onClick={onOpen}>
        Adicionar Versículo
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent width="100%" maxWidth="1150px" mx={4} height="90vh">
          <ModalHeader>Adicionar versículo do dia</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              display="flex"
              gap={0}
              p={0}
              width="100%"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box
                flex="2"
                bg="white"
                borderRadius="md"
                boxShadow="md"
                p={6}
                minWidth="0"
                height="calc(100vh - 250px)"
                position="relative"
              >
                <Box
                  display="flex"
                  gap={6}
                  mb={6}
                  flexDirection={{ base: 'column', md: 'row' }}
                >
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">Livro</Text>
                    <Select placeholder="Selecione o livro" value={selectedBook || ''} onChange={handleBookChange}>
                      {bibleBooks.map((book) => (
                        <option key={book.abbrev} value={book.abbrev}>{book.name}</option>
                      ))}
                    </Select>
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">Capítulo</Text>
                    <Select placeholder="Selecione o capítulo" value={selectedChapter || ''} onChange={handleChapterChange}>
                      {chapters.map((chapter, index) => (
                        <option key={index} value={index + 1}>{chapter}</option>
                      ))}
                    </Select>
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">Versículo</Text>
                    <Select placeholder="Selecione o versículo" value={selectedVerse || ''} onChange={handleVerseChange}>
                      {verses.map((verse, index) => (
                        <option key={index} value={index + 1}>{verse}</option>
                      ))}
                    </Select>
                  </Box>
                </Box>
                <Box mb={6} display="flex" alignItems="center" marginTop={240}>
                  <Button as="label" htmlFor="imageUpload" variant="outline" width="auto" bg="white" size="sm" mr={4} color="black">
                    Carregar Imagem
                    <Input 
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </Button>
                  <Text>{selectedImage ? selectedImage.name : 'Nenhuma imagem selecionada'}</Text>
                </Box>
              </Box>

              <Box
                flex="1"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={6}
                minWidth="0"
                height="calc(100vh - 220px)"
              >
                <Box
                  
                  color="black"
                  paddingRight={32}
                  mb={4}
                  width="100%"
                  textAlign="center"
                >
                  <Text fontWeight="bold">Pré-visualização</Text>
                </Box>
                <Box
                  flex="1"
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                  p={6}
                  minWidth="0"
                  height="100%"
                  width="100%"
                  position="relative"
                >
                  <Text fontSize="lg" color="#4D1A3B" fontWeight="bold">Versículo do dia</Text>
                  <Box
                    display="flex"
                    flexDirection="column"
                    height="70%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box
                      flex="1"
                      position="relative"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      border="1px solid #ccc"
                      borderRadius="md"
                      overflow="hidden"
                      backgroundColor={imagePreview ? 'transparent' : '#f7f7f7'}
                      width="100%"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview as string}
                          alt="Pré-visualização"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 1,
                          }}
                        />
                      ) : (
                        <Box
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                          textAlign="center"
                          zIndex={1}
                        >
                          <Text>Sem imagem selecionada</Text>
                        </Box>
                      )}
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        padding="8px"
                        backgroundColor="rgba(0, 0, 0, 0.5)"
                        color="white"
                        zIndex={2}
                        borderRadius="md"
                      >
                        <Box>
                          <Text fontSize="md">Versículo do dia</Text>
                          <Text fontSize="lg" fontWeight="bold" mt={1}>
                            {getFormattedReference()}
                          </Text>
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="md">{selectedText || 'Texto do versículo'}</Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Button variant="outline" onClick={onClose}>
                Salvar como rascunho
              </Button>
              <Button variant="solid" onClick={() => console.log('Adicionar')}>
                Salvar e publicar
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdicionarVersiculo;
