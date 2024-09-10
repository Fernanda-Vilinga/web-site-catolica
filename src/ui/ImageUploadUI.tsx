/* import React, { ChangeEvent } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import defaultImage from '../assets/paisagem.jpeg';

interface ImageUploadProps {
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  imagePreview: string;
  setImagePreview: React.Dispatch<React.SetStateAction<string>>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ selectedImage, setSelectedImage, imagePreview, setImagePreview }) => {
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(defaultImage);
    }
  };

  return (
    <Box mt={2} mb={8} display="flex" alignItems="center">
      <Button as="label" htmlFor="imageUpload" variant="outline" width="auto" bg="white" size="sm" mr={4} color="black">
        Carregar Imagem
        <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
      </Button>
      <Text>{selectedImage ? selectedImage.name : 'Nenhuma imagem selecionada'}</Text>
      {selectedImage && (
        <Button ml={4} variant="outline" colorScheme="red" onClick={() => {
          setSelectedImage(null);
          setImagePreview(defaultImage);
        }}>
          Remover Imagem
        </Button>
      )}
    </Box>
  );
};

export default ImageUpload;
 */