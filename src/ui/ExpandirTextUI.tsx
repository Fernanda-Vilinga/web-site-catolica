import React, { useState } from 'react';
import { Text, Button, Box } from '@chakra-ui/react';

interface ExpandableTextProps {
  text: string;
  maxLines: number;
}

const Expandir: React.FC<ExpandableTextProps> = ({ text, maxLines }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box>
      <Text
        mb={2}
        textAlign="justify"
        sx={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          WebkitLineClamp: isExpanded ? 'unset' : maxLines,
          lineHeight: '1.5rem', 
          wordBreak: 'break-word',
          hyphens: 'auto'
        }}
      >
        {text}
      </Text>
      {text.length > maxLines * 100 && (
        <Button variant="link" onClick={handleToggle}>
          {isExpanded ? 'Ver Menos' : 'Ver Mais'}
        </Button>
      )}
    </Box>
  );
};

export default Expandir;
