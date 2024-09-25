import React, { useState, useEffect, ChangeEvent } from "react";
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
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { MdFavoriteBorder, MdMessage } from "react-icons/md";
import { getBibleData, BibleBook } from "../data/bibleData";
import defaultImage from "../assets/paisagem.jpeg";
import { Draft, Post } from "../types/types";
import { usePostState } from "../repositorios/usePostState";

interface AdicionarVersiculoProps {
  isOpen: boolean;
  onClose: () => void;
  draft: Post | null;
  //draft?: Post & { id?: string };
  onSaveDraft: (draft: Draft) => void;
}

export const AdicionarVersiculo: React.FC<AdicionarVersiculoProps> = ({
  isOpen,
  onClose,
  draft,
  onSaveDraft,
}) => {
  const updatePostById = usePostState((state) => state.updatePostById);
  const addPost = usePostState((state) => state.addPost);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<number>(1);
  const [bibleBooks, setBibleBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [verses, setVerses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    setBibleBooks(getBibleData());
  }, []);

  useEffect(() => {
    const book = bibleBooks.find((book) => book.name === selectedBook);
    if (book) {
      setChapters(book.chapters.map((_, index) => `Capítulo ${index + 1}`));
      setSelectedChapter(1);
      setSelectedVerse(1);
      setVerses([]);
    }
  }, [selectedBook, bibleBooks]);

  useEffect(() => {
    const book = bibleBooks.find((book) => book.name === selectedBook);
    if (book) {
      setVerses(
        book.chapters[selectedChapter - 1]?.map(
          (_, index) => `Versículo ${index + 1}`
        ) || []
      );
      setSelectedVerse(1);
    }
  }, [selectedChapter, selectedBook, bibleBooks]);

  useEffect(() => {
    const book = bibleBooks.find((book) => book.name === selectedBook);
    if (book && selectedChapter && selectedVerse) {
      const versesList = book.chapters[selectedChapter - 1] || [];
      setSelectedText(versesList[selectedVerse - 1] || "");
    }
  }, [selectedVerse, selectedChapter, selectedBook, bibleBooks]);

  const convertToBase64 = (
    file: File,
    callback: (base64String: string) => void
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const initializeDefaultImage = () => {
    fetch(defaultImage)
      .then((response) => response.blob())
      .then((blob) => {
        convertToBase64(blob as File, (base64String) => {
          setImagePreview(base64String);
        });
      });
  };

  useEffect(() => {
    initializeDefaultImage();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (draft) {
        setSelectedBook(draft.book || "");
        setSelectedChapter(draft.chapter || 1);
        setSelectedVerse(draft.verse || 1);
        setSelectedText(draft.text || "");
        setImagePreview(draft.image || imagePreview);
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
      convertToBase64(file, (base64String) => {
        setImagePreview(base64String);
      });
    } else {
      initializeDefaultImage();
    }
  };

  const handleSelectChange =
    <T,>(
      setter: React.Dispatch<React.SetStateAction<T>>,
      parser: (value: string) => T
    ) =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      setter(parser(event.target.value));
      setError(null);
    };

  const getFormattedReference = () => {
    if (selectedBook && selectedChapter && selectedVerse) {
      const book = bibleBooks.find((book) => book.name === selectedBook);
      return book ? `${book.name} ${selectedChapter}:${selectedVerse}` : "";
    }
    return "";
  };

  const handleSaveDraft = async () => {
    if (loading) return;

    if (!isFormValid()) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const newDraft: Draft = {
        text: selectedText || "Texto do versículo",
        image: imagePreview,
        book: selectedBook,
        chapter: selectedChapter,
        verse: selectedVerse,
        passage: getFormattedReference(),
        createdAt: new Date(),
      };

      onSaveDraft(newDraft);
      toast({
        title: "Rascunho salvo.",
        description: "Seu rascunho foi salvo com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar rascunho:", error);
      toast({
        title: "Erro ao salvar rascunho.",
        description: "Ocorreu um problema ao salvar o rascunho.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (loading) return;

    if (!isFormValid()) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const post: Post = {
        id: draft?.id,
        text: selectedText || "Texto do versículo",
        image: imagePreview || "",
        book: selectedBook,
        chapter: selectedChapter,
        verse: selectedVerse,
        passage: getFormattedReference(),
        createdAt: draft ? draft.createdAt : new Date(),
      };

      updatePostById(post.id ?? "", post);
      toast({
        title: "Post atualizado.",
        description: "Seu post foi atualizado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Erro ao publicar:", error);
      toast({
        title: "Erro ao publicar.",
        description: "Ocorreu um problema ao publicar o post.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (loading) return;

    if (!isFormValid()) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const post: Post = {
        text: selectedText || "Texto do versículo",
        image: imagePreview || "",
        book: selectedBook,
        chapter: selectedChapter,
        verse: selectedVerse,
        passage: getFormattedReference(),
        createdAt: draft ? draft.createdAt : new Date(),
      };

      addPost(post);

      toast({
        title: "Post salvo.",
        description: "Seu post foi publicado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Erro ao publicar:", error);
      toast({
        title: "Erro ao publicar.",
        description: "Ocorreu um problema ao publicar o post.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    initializeDefaultImage();
    setSelectedText("");
    setSelectedBook("");
    setSelectedChapter(1);
    setSelectedVerse(1);
    setChapters([]);
    setVerses([]);
    setError(null);
  };

  const isFormValid = () => selectedBook && selectedChapter && selectedVerse;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!loading) {
          onClose();
          resetForm();
        }
      }}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent width="100%" maxWidth="1150px" mx={4} height="90vh">
        <ModalHeader>
          {draft ? "Editar versículo" : "Adicionar versículo do dia"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            display="flex"
            gap={6}
            flexDirection={{ base: "column", md: "row" }}
          >
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
                {error && <Text color="red.500">{error}</Text>}
                <Box
                  display="flex"
                  gap={6}
                  mb={6}
                  flexDirection={{ base: "column", md: "row" }}
                >
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">
                      Livro
                    </Text>
                    <Select
                      placeholder="Selecione o livro"
                      value={selectedBook}
                      onChange={handleSelectChange(
                        setSelectedBook,
                        (value) => value
                      )}
                    >
                      {bibleBooks.map((book) => (
                        <option key={book.name} value={book.name}>
                          {book.name}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">
                      Capítulo
                    </Text>
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
                    <Text mb={2} fontWeight="bold">
                      Versículo
                    </Text>
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
                  <Box
                    borderRadius="md"
                    p={4}
                    bg="white"
                    boxShadow="md"
                    height="220px"
                  >
                    <Text>{selectedText || "Selecione um versículo"}</Text>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <Button
                  as="label"
                  htmlFor="imageUpload"
                  variant="outline"
                  colorScheme="teal"
                >
                  Carregar Imagem
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </Button>
                <Text ml={4}>
                  {selectedImage
                    ? selectedImage.name
                    : "Nenhuma imagem selecionada"}
                </Text>
                {selectedImage && (
                  <Button
                    ml={4}
                    variant="outline"
                    colorScheme="red"
                    onClick={() => {
                      setSelectedImage(null);
                      initializeDefaultImage();
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
                  <Text
                    fontWeight="bold"
                    mt={10}
                    width="100%"
                    height="15%"
                    color={"#6F3B52"}
                    mr={10}
                    fontSize={"lg"}
                  >
                    Versículo do dia
                  </Text>
                </Box>
                <img
                  src={imagePreview}
                  alt="Pré-visualização"
                  style={{
                    width: "100%",
                    height: "72%",
                    objectFit: "cover",
                    borderRadius: "5%",
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
                  <Box display="flex" flexDirection="column" mb={8} mr={170}>
                    <Text mb={0} fontSize={12}>
                      Versículo do dia
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" mb={0}>
                      {getFormattedReference()}
                    </Text>
                  </Box>
                  <Text fontSize="sm" noOfLines={3} mb={4}>
                    {selectedText || "Texto do versículo"}
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
                isDisabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Salvar como rascunho"}
              </Button>
            )}
            <Button
              variant="solid"
              onClick={draft ? handleUpdatePost : handlePublish}
              isDisabled={loading}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : draft ? (
                "Atualizar"
              ) : (
                "Salvar e publicar"
              )}
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdicionarVersiculo;
