import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    buttonDark: '#3E2723',  
    buttonLight: '#6D4C41', 
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: {
          bg: 'buttonDark',
          color: 'white',
          _hover: {
            bg: 'buttonLight',
          },
          _active: {
            bg: 'buttonLight',
          },
        },
        outline: {
          borderColor: 'buttonDark',
          color: 'buttonDark',
          _hover: {
            bg: 'buttonLight',
            color: 'white',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: '#E0E0E0', 
        color: 'black', 
      },
    },
  },
});

export default theme;
