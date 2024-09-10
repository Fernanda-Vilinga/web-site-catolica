import React, { ChangeEvent } from 'react';
import { Box, Select, Text, Input } from '@chakra-ui/react';
import { BibleBook } from '../data/bibleData';

interface VersiculoFormProps {
  selectedBook: string;
  setSelectedBook: React.Dispatch<React.SetStateAction<string>>;
  selectedChapter: number;
  setSelectedChapter: React.Dispatch<React.SetStateAction<number>>;
  selectedVerse: number;
  setSelectedVerse: React.Dispatch<React.SetStateAction<number>>;
  selectedText: string;
  setSelectedText: React.Dispatch<React.SetStateAction<string>>;
  bibleBooks: BibleBook[];
  chapters: string[];
  verses: string[];
}

const VersiculoForm: React.FC<VersiculoFormProps> = ({
  selectedBook,
  setSelectedBook,
  selectedChapter,
  setSelectedChapter,
  selectedVerse,
  setSelectedVerse,
  selectedText,
  setSelectedText,
  bibleBooks,
  chapters,
  verses,
}) => {
  const handleSelectChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, parser: (value: string) => T) => (event: ChangeEvent<HTMLSelectElement>) => {
    setter(parser(event.target.value));
  };

  return (
    <Box flex="2" bg="white" borderRadius="md" p={6} height="calc(100vh - 250px)" display="flex" flexDirection="column" justifyContent="space-between">
      <Box mb={6}>
        <Box display="flex" gap={6} mb={6} flexDirection={{ base: 'column', md: 'row' }}>
          <Box flex="1">
            <Text mb={2} fontWeight="bold">Livro</Text>
            <Select placeholder="Selecione o livro" value={selectedBook} onChange={handleSelectChange(setSelectedBook, (value) => value)}>
              {bibleBooks.map((book) => (
                <option key={book.name} value={book.name}>
                  {book.name}
                </option>
              ))}
            </Select>
          </Box>
          <Box flex="1">
            <Text mb={2} fontWeight="bold">Capítulo</Text>
            <Select placeholder="Selecione o capítulo" value={selectedChapter} onChange={handleSelectChange(setSelectedChapter, Number)}>
              {chapters.map((chapter, index) => (
                <option key={index} value={index + 1}>
                  {chapter}
                </option>
              ))}
            </Select>
          </Box>
          <Box flex="1">
            <Text mb={2} fontWeight="bold">Versículo</Text>
            <Select placeholder="Selecione o versículo" value={selectedVerse} onChange={handleSelectChange(setSelectedVerse, Number)}>
              {verses.map((verse, index) => (
                <option key={index} value={index + 1}>
                  {verse}
                </option>
              ))}
            </Select>
          </Box>
        </Box>
        <Box mb={0} display="flex" alignItems="center">
          <Box borderRadius="md" p={4} bg="white" boxShadow="md" height="220px">
            <Text>{selectedText || 'Selecione um versículo'}</Text>
          </Box>
        </Box>
      </Box>
      <Box>
        <Text mb={2} fontWeight="bold">Texto do versículo</Text>
        <Input value={selectedText} onChange={(e) => setSelectedText(e.target.value)} placeholder="Digite o texto do versículo" />
      </Box>
    </Box>
  );
};

export default VersiculoForm;
