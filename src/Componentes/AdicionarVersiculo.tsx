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
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { MdFavoriteBorder, MdMessage } from 'react-icons/md';
import { getBibleData, BibleBook } from '../data/bibleData';

interface AdicionarVersiculoProps {
  onSaveDraft: (draft: { text: string; image: string | ArrayBuffer | null }) => void;
  onPublish: (publication: { text: string; image: string | ArrayBuffer | null }) => void;
}

const AdicionarVersiculo: React.FC<AdicionarVersiculoProps> = ({ onSaveDraft, onPublish }) => {
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
    setBibleBooks(getBibleData());
  }, []);

  useEffect(() => {
    if (selectedBook) {
      const book = bibleBooks.find((book) => book.abbrev === selectedBook);
      setChapters(book ? book.chapters.map((_, index) => `Capítulo ${index + 1}`) : []);
    }
  }, [selectedBook, bibleBooks]);

  useEffect(() => {
    if (selectedBook && selectedChapter !== null) {
      const book = bibleBooks.find((book) => book.abbrev === selectedBook);
      const versesList = book?.chapters[selectedChapter - 1] || [];
      setVerses(versesList.map((_, index) => `Versículo ${index + 1}`));
      setSelectedText(versesList[selectedVerse ?? 0] || null);
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

  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<any>>, parser: (value: string) => any) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    setter(parser(event.target.value));
  };

  const getFormattedReference = () => {
    if (selectedBook && selectedChapter !== null && selectedVerse !== null) {
      const book = bibleBooks.find((book) => book.abbrev === selectedBook);
      return book ? `${book.name} ${selectedChapter}:${selectedVerse}` : '';
    }
    return '';
  };

  const handleSaveDraft = () => {
    const draft = {
      text: `${getFormattedReference()} - ${selectedText || 'Texto do versículo'}`,
      image: imagePreview,
    };
    onSaveDraft(draft);
    onClose();
  };

  const handlePublish = () => {
    const publication = {
      text: `${getFormattedReference()} - ${selectedText || 'Texto do versículo'}`,
      image: imagePreview,
    };
    onPublish(publication);
    onClose();
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
            <Box display="flex" gap={6} p={0} width="100%" flexDirection={{ base: 'column', md: 'row' }}>
         
              <Box
                flex="2"
                bg="white"
                borderRadius="md"
                p={6}
                minWidth="0"
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
                        value={selectedBook || ''}
                        onChange={handleSelectChange(setSelectedBook, (value) => value)}
                      >
                        {bibleBooks.map((book) => (
                          <option key={book.abbrev} value={book.abbrev}>
                            {book.name}
                          </option>
                        ))}
                      </Select>
                    </Box>
                    <Box flex="1">
                      <Text mb={2} fontWeight="bold">Capítulo</Text>
                      <Select
                        placeholder="Selecione o capítulo"
                        value={selectedChapter || ''}
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
                        value={selectedVerse || ''}
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
                  <Box mb={6} display="flex" alignItems="center">
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
                </Box>
              </Box>

           
              <Box
                flex="1"
                bg="white"
                borderRadius="md"
                boxShadow="md"
                p={0}
                minWidth="0"
                width="770px"
                height="calc(98vh - 200px)"
                display="flex"
                flexDirection="column"
              >
                <Text fontWeight="bold" mt={6} textAlign="center" mr={170}>
                  Pré-visualização
                </Text>
                <Box
                  position="relative"
                  bg="white"
                  borderRadius="md"
                  p={0}
                  minWidth="0"
                  height="64%"
                  width="90%"
                  left={4}
                >
                  <Text
                    position="absolute"
                    top="38px"
                    right="36%"
                    transform="translateX(-50%)"
                    fontWeight="bold"
                    color="#6F3B52"
                    textAlign="center"
                    zIndex={2}
                    mb={3}
                  >
                    Versículo do dia
                  </Text>
                  <Box
                    position="absolute"
                    top="80px"
                    left="0"
                    width="100%"
                    height="calc(110% - 80px)"
                    bg={imagePreview ? 'transparent' : '#f7f7f7'}
                    borderRadius="md"
                    overflow="hidden"
                    zIndex={1}
                  >
                    {imagePreview && (
                      <img
                        src={imagePreview as string}
                        alt="Pré-visualização"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </Box>
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    zIndex={2}
                    color="white"
                    textAlign="center"
                    p={0}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="90%"
                    maxWidth="600px"
                  >
                    <Text fontSize="sm" mt={2} width="100%" textAlign="center" mr={40}>
                      Versículo do dia
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" mb={2} width="70%" textAlign="center" mr={110}>
                      {getFormattedReference()}
                    </Text>
                    <Text fontSize="sm" width="100%" textAlign="justify" noOfLines={3}>
                      {selectedText || 'Texto do versículo'}
                    </Text>
                  </Box>
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    width="100%"
                    p={0}
                    gap={32}
                    display="flex"
                    justifyContent="space-around"
                    alignItems="center"
                    borderBottomRadius="md"
                    zIndex={3}
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
              <Button variant="outline" onClick={handleSaveDraft}>
                Salvar como rascunho
              </Button>
              <Button variant="solid" onClick={handlePublish}>
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
