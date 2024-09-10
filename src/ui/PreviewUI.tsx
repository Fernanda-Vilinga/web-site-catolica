import React from 'react';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { MdFavoriteBorder, MdMessage } from 'react-icons/md';

interface PreviewProps {
  imagePreview: string;
  getFormattedReference: () => string;
  selectedText: string;
}

const Preview: React.FC<PreviewProps> = ({ imagePreview, getFormattedReference, selectedText }) => {
  return (
    <Box flex="1" bg="white" borderRadius="md" boxShadow="md" p={0} width="770px" height="calc(98vh - 200px)" display="flex" flexDirection="column">
      <Text fontWeight="bold" mt={6} textAlign="center" mr={40}>
        Pré-visualização
      </Text>
      <Box position="relative" bg="white" borderRadius="md" p={0} height="68%" width="90%" mx="auto" mt={0} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <Box width="100%" height="20%" bg="white" marginBottom={4} borderRadius="md">
          <Text fontWeight="bold" mt={10} width="100%" height="15%" color={'#6F3B52'} mr={10} fontSize={'lg'}>
            Versículo do dia
          </Text>
        </Box>
        <img src={imagePreview} alt="Pré-visualização" style={{ width: '100%', height: '72%', objectFit: 'cover', borderRadius: '5%' }} />
        <Box position="absolute" top="20" left="0" width="100%" height="72%" bg="rgba(0, 0, 0, 0.6)" borderRadius="md" display="flex" flexDirection="column" justifyContent="center" alignItems="center" color="white" p={0} textAlign="center">
          <Box display="flex" flexDirection="column" mr={28} mb={8}>
            <Text mb={0} fontSize={12} mr={20}>
              Versículo do dia
            </Text>
            <Text fontSize="xl" fontWeight="bold" mb={0} mr={20}>
              {getFormattedReference()}
            </Text>
          </Box>
          <Text fontSize="sm" noOfLines={3} mb={4} ml={1}>
            {selectedText || 'Texto do versículo'}
          </Text>
        </Box>
        <Box position="absolute" bottom="0" left="0" width="100%" p={0} display="flex" justifyContent="space-between" alignItems="center" borderBottomRadius="md">
          <Box textAlign="center" color="white">
            <IconButton color="white" icon={<MdFavoriteBorder />} aria-label="Curtir" variant="link" />
            <Text fontSize="sm">10</Text>
          </Box>
          <Box textAlign="center" color="white">
            <IconButton color="white" icon={<MdMessage />} aria-label="Comentário" variant="link" />
            <Text fontSize="sm">5</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Preview;
