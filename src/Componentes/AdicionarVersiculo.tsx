import React, { useState } from 'react';
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

const AdicionarVersiculo: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

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

  return (
    <>
      <Button variant="solid" onClick={onOpen}>
        Adicionar Versículo
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent width="100%" maxWidth="1150px" mx={4}>
          <ModalHeader>Adicionar versículo do dia</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              display="flex"
              gap={6}
              p={6}
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
              >
                <Box display="flex" gap={6} mb={6} flexDirection={{ base: 'column', md: 'row' }}>
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">Livro</Text>
                    <Select placeholder="Escolha o livro">
                      <option value="livro1">Livro 1</option>
                      <option value="livro2">Livro 2</option>
                      
                    </Select>
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">Versículo</Text>
                    <Select placeholder="Escolha o versículo">
                      <option value="versiculo1">Versículo 1</option>
                      <option value="versiculo2">Versículo 2</option>
                     
                    </Select>
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="bold">Capítulo</Text>
                    <Select placeholder="Escolha o capítulo">
                      <option value="capitulo1">Capítulo 1</option>
                      <option value="capitulo2">Capítulo 2</option>
                      
                    </Select>
                  </Box>
                </Box>
                <Box mb={6}>
                  <Text mb={2} fontWeight="bold">Carregar imagem</Text>
                  <Input type="file" onChange={handleImageChange} />
                </Box>
              </Box>
              <Box
                flex="1"
                bg="white"
                borderRadius="md"
                boxShadow="md"
                p={6}
                minWidth="0" 
              >
                <Box textAlign="center" mb={6}>
                  <Text fontWeight="bold">Pré-visualização</Text>
                </Box>
                {imagePreview ? (
                  <img
                    src={imagePreview as string}
                    alt="Pré-visualização"
                    style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                  />
                ) : (
                  <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
                    <Text>Sem imagem selecionada</Text>
                  </Box>
                )}
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
