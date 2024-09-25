
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme'; 
import AppPage from './ui/AppUI';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <AppPage />
  </ChakraProvider>,
  
);
