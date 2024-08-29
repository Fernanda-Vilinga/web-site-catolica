import { Box, Flex, Text } from "@chakra-ui/react";

const headerBgColor = '#F5F5F5F5'; 

const Header: React.FC = () => {
  return (
    <Flex
      justify="flex-end"
      align="center"
      h="80px"
      p="10px 50px"
      bg={headerBgColor} 
      borderBottom="1px solid rgba(0, 0, 0, 0.1)"
    >
      <Box
        as="button"
        px="15px"
        py="8px"
        borderRadius="md"
        _hover={{ bg: "gray.100" }}
        _active={{ bg: "gray.200" }}
        _focus={{ outline: "none" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="22px" color="black" fontWeight="bold">
          Sair
        </Text>
      </Box>
    </Flex>
  );
};

export default Header;
