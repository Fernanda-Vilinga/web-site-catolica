// src/App.tsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import Header from './Componentes/Hearder'; 
import AdicionarVersiculo from './Componentes/AdicionarVersiculo'; // Importe o novo componente

const headerBgColor = '#F5F5F5';  

const App: React.FC = () => {
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
        <AdicionarVersiculo /> {/* Utilize o novo componente */}
      </Box>
    </Box>
  );
};

export default App;
