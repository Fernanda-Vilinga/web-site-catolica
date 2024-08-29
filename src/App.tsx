import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';
import Header from './Componentes/Hearder'; 

const headerBgColor = '#F5F5F5F5';  

const App: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      >
        <Button variant="solid" onClick={onOpen}>
          Adicionar Versículo
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Adicionar versículo do dia</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
             
              <p>Conteúdo...</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Salvar como rascunho
              </Button>
              <Button variant="solid" onClick={() => console.log('Adicionar')}>
                Salvar e publicar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default App;
