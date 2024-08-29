import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    buttonSolid: '#6F3B52', // Cor para botões sólidos
    buttonLight: '#4D1A3B', // Cor mais clara para botões sólidos em hover/active
    buttonDarker: '#333333', // Cor preta descarregada para botões com outline
    buttonOutlineBorder: '#333333', // Cor da borda para botões com outline
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: {
          bg: 'buttonSolid',
          color: 'white',
          _hover: {
            bg: 'buttonLight',
          },
          _active: {
            bg: 'buttonLight',
          },
        },
        outline: {
          bg: 'buttonDarker',
          borderColor: 'buttonDarker',
          color: 'white',
          _hover: {
            bg: 'buttonDarker',
            color: 'white',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.200', // Cor de fundo do body
        color: 'black', // Cor do texto padrão
        fontFamily: 'Roboto, sans-serif', // Define a fonte Roboto como padrão
      },
    },
  },
});

export default theme;
