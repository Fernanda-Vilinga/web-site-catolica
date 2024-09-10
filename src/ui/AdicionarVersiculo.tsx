import React, { useState, useEffect, ChangeEvent } from 'react';
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
  IconButton,
} from '@chakra-ui/react';
import { MdFavoriteBorder, MdMessage } from 'react-icons/md';
import { getBibleData, BibleBook } from '../data/bibleData';
import defaultImage from '../assets/paisagem.jpeg'; // Importando a imagem padrão
import { db } from '../dao/firestorePostDAO'; // Certifique-se de que você está importando a instância do Firestore corretamente
import { addDoc, collection } from 'firebase/firestore';

interface Post {
  text: string;
  image: string; // Imagem como string Base64
  book: string;
  chapter: number;
  verse: number;
  passage: string;
  createdAt?: Date;
}

interface AdicionarVersiculoProps {
  isOpen: boolean;
  onClose: () => void;
  draft?: Post;
  onSaveDraft: (draft: Post) => void;
  onPublish: (post: Post) => void;
}

const AdicionarVersiculo: React.FC<AdicionarVersiculoProps> = ({
  isOpen,
  onClose,
  draft,
  onSaveDraft,
  onPublish,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(defaultImage);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<number>(1);
  const [bibleBooks, setBibleBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [verses, setVerses] = useState<string[]>([]);

  useEffect(() => {
    setBibleBooks(getBibleData());
  }, []);

  useEffect(() => {
    if (selectedBook) {
      const book = bibleBooks.find((book) => book.name === selectedBook);
      setChapters(book ? book.chapters.map((_, index) => `Capítulo ${index + 1}`) : []);
      setSelectedChapter(1);
      setSelectedVerse(1);
      setVerses([]);
    }
  }, [selectedBook, bibleBooks]);

  useEffect(() => {
    if (selectedChapter) {
      const book = bibleBooks.find((book) => book.name === selectedBook);
      setVerses(book?.chapters[selectedChapter - 1].map((_, index) => `Versículo ${index + 1}`) || []);
      setSelectedVerse(1);
    }
  }, [selectedChapter, selectedBook, bibleBooks]);

  useEffect(() => {
    if (selectedVerse && selectedChapter && selectedBook) {
      const book = bibleBooks.find((book) => book.name === selectedBook);
      const versesList = book?.chapters[selectedChapter - 1] || [];
      setSelectedText(versesList[selectedVerse - 1] || '');
    }
  }, [selectedVerse, selectedChapter, selectedBook, bibleBooks]);

  useEffect(() => {
    if (isOpen) {
      if (draft) {
        setSelectedBook(draft.book || '');
        setSelectedChapter(draft.chapter || 1);
        setSelectedVerse(draft.verse || 1);
        setSelectedText(draft.text || '');
        setImagePreview(draft.image || defaultImage);
        setSelectedImage(null);
      } else {
        resetForm();
      }
    }
  }, [isOpen, draft]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String); // Atualiza a pré-visualização da imagem
      };
      reader.readAsDataURL(file); // Converte o arquivo para string Base64
    } else {
      setImagePreview(defaultImage);
    }
  };

  const handleSelectChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, parser: (value: string) => T) => (event: ChangeEvent<HTMLSelectElement>) => {
    setter(parser(event.target.value));
  };

  const getFormattedReference = () => {
    if (selectedBook && selectedChapter && selectedVerse) {
      const book = bibleBooks.find((book) => book.name === selectedBook);
      return book ? `${book.name} ${selectedChapter}:${selectedVerse}` : '';
    }
    return '';
  };

  const handleSaveDraft = async () => {
    const updatedDraft: Post = {
      text: selectedText || 'Texto do versículo',
      image: imagePreview, // String Base64 da imagem
      book: selectedBook,
      chapter: selectedChapter,
      verse: selectedVerse,
      passage: getFormattedReference(),
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, 'drafts'), updatedDraft);
      console.log('Draft salvo com ID:', docRef.id);
    } catch (e) {
      console.error('Erro ao salvar draft:', e);
    }

    onSaveDraft(updatedDraft);
    onClose();
  };

  const handlePublish = async () => {
    const post: Post = {
      text: selectedText || 'Texto do versículo',
      image: imagePreview, // String Base64 da imagem
      book: selectedBook,
      chapter: selectedChapter,
      verse: selectedVerse,
      passage: getFormattedReference(),
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, 'posts'), post);
      console.log('Post salvo com ID:', docRef.id);
    } catch (e) {
      console.error('Erro ao salvar post:', e);
    }

    onPublish(post);
    onClose();
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(defaultImage);
    setSelectedText('');
    setSelectedBook('');
    setSelectedChapter(1);
    setSelectedVerse(1);
    setChapters([]);
    setVerses([]);
  };

  const isFormValid = () => selectedBook && selectedChapter && selectedVerse;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent width="100%" maxWidth="1150px" mx={4} height="90vh">
        <ModalHeader>{draft ? 'Editar versículo' : 'Adicionar versículo do dia'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="flex" gap={6} flexDirection={{ base: 'column', md: 'row' }}>
            <Box
              flex="2"
              bg="white"
              borderRadius="md"
              p={6}
              height="calc(100vh - 250px)"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box mb={6}>
                <Box display="flex" gap={6} mb={6} flexDirection={{ base: 'column', md: 'row' }}>
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">Livro</Text>
                    <Select
                      placeholder="Selecione o livro"
                      value={selectedBook}
                      onChange={handleSelectChange(setSelectedBook, (value) => value)}
                    >
                      {bibleBooks.map((book) => (
                        <option key={book.name} value={book.name}>
                          {book.name}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">Capítulo</Text>
                    <Select
                      placeholder="Selecione o capítulo"
                      value={selectedChapter}
                      onChange={handleSelectChange(setSelectedChapter, Number)}
                    >
                      {chapters.map((chapter, index) => (
                        <option key={index} value={index + 1}>
                          {chapter}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">Versículo</Text>
                    <Select
                      placeholder="Selecione o versículo"
                      value={selectedVerse}
                      onChange={handleSelectChange(setSelectedVerse, Number)}
                    >
                      {verses.map((verse, index) => (
                        <option key={index} value={index + 1}>
                          {verse}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Box>
                <Box mb={0} display="flex" alignItems="center">
                  <Box borderRadius="md" p={4} bg="white" boxShadow="md" height="220px">
                    <Text>{selectedText || 'Selecione um versículo'}</Text>
                  </Box>
                </Box>
              </Box>
              <Box mt={2} mb={8} display="flex" alignItems="center">
                <Button
                  as="label"
                  htmlFor="imageUpload"
                  variant="outline"
                  width="auto"
                  bg="white"
                  size="sm"
                  mr={4}
                  color="black"
                >
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
                {selectedImage && (
                  <Button
                    ml={4}
                    variant="outline"
                    colorScheme="red"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(defaultImage);
                    }}
                  >
                    Remover Imagem
                  </Button>
                )}
              </Box>
            </Box>

            <Box
              flex="1"
              bg="white"
              borderRadius="md"
              boxShadow="md"
              p={0}
              width="770px"
              height="calc(98vh - 200px)"
              display="flex"
              flexDirection="column"
            >
              <Text fontWeight="bold" mt={6} textAlign="center" mr={40}>
                Pré-visualização
              </Text>
              <Box
                position="relative"
                bg="white"
                borderRadius="md"
                p={0}
                height="68%"
                width="90%"
                mx="auto"
                mt={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Box
                  width="100%"
                  height="20%"
                  bg="white"
                  marginBottom={4}
                  borderRadius="md"
                >
                  <Text fontWeight="bold" mt={10} width="100%" height="15%" color={'#6F3B52'} mr={10} fontSize={'lg'}>
                    Versículo do dia
                  </Text>
                </Box>
                <img
                  src={imagePreview}
                  alt="Pré-visualização"
                  style={{
                    width: '100%',
                    height: '72%',
                    objectFit: 'cover',
                    borderRadius: '5%',
                  }}
                />
                <Box
                  position="absolute"
                  top="20"
                  left="0"
                  width="100%"
                  height="72%"
                  bg="rgba(0, 0, 0, 0.6)"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  color="white"
                  p={0}
                  textAlign="center"
                >
                  <Box display="flex" flexDirection="column" mr={28} mb={8}>
                    <Text mb={0} fontSize={12} mr={20}>
                      Versículo do dia
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" mb={0} mr={20}>
                      {getFormattedReference()}
                    </Text>
                  </Box>
                  <Text fontSize="sm" noOfLines={3} mb={4} ml={1}>
                    {selectedText || 'Texto do versículo'}
                  </Text>
                </Box>
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  width="100%"
                  p={0}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottomRadius="md"
                >
                  <Box textAlign="center" color="white">
                    <IconButton
                      color="white"
                      icon={<MdFavoriteBorder />}
                      aria-label="Curtir"
                      variant="link"
                    />
                    <Text fontSize="sm">10</Text>
                  </Box>
                  <Box textAlign="center" color="white">
                    <IconButton
                      color="white"
                      icon={<MdMessage />}
                      aria-label="Comentário"
                      variant="link"
                    />
                    <Text fontSize="sm">5</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" width="100%" justifyContent="space-between">
            {!draft && (
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                isDisabled={!isFormValid()}
              >
                Salvar como rascunho
              </Button>
            )}
            <Button
              variant="solid"
              onClick={handlePublish}
              isDisabled={!isFormValid()}
            >
              {draft ? 'Atualizar e publicar' : 'Salvar e publicar'}
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdicionarVersiculo;
