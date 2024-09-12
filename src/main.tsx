
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import AppUI from './ui/AppUI';
import theme from './theme'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <AppUI />
  </ChakraProvider>,
);
