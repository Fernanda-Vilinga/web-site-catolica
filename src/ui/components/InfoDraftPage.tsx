import { Box, Button, IconButton, Text } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { Draft } from "../../types/types";
import { formatDate } from "../../utils/helpers";

interface InfoDraftProps {
    draft: Draft
    index: any
    handleDeleteDraftById: (draft: Draft) => void;
    handlePublish: (draft: Draft) => void;
}

export default function InfoDraftPage(props: InfoDraftProps): JSX.Element {

    const {
        draft,
        index,
        handleDeleteDraftById, 
        handlePublish
    } = props

  return (
    <Box
      key={draft.id || `draft-${index}`} 
      p={4}
      borderBottom="1px solid #ddd"
      borderRadius="md"
      bg="white"
      boxShadow="md"
      position="relative"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {draft.image && (
        <Box
          position="relative"
          width="100%"
          height="200px"
          overflow="hidden"
          borderRadius="md"
        >
          <img
            src={draft.image}
            alt="Imagem do rascunho"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            color="white"
            bg="rgba(0, 0, 0, 0.6)"
            p={2}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            zIndex={1}
          >
            <Text mb={2} fontWeight="bold">
              {draft.passage}
            </Text>
            {draft.createdAt && (
              <Text fontSize="xs" mt={2}>
                Criado em: {formatDate(draft.createdAt)}
              </Text>
            )}
            <Box
              position="absolute"
              top="4px"
              right="2px"
              zIndex={2}
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={2}
            >
              <Button
                colorScheme="green"
                onClick={() => handlePublish(draft)}
              >
                Publicar
              </Button>
              <IconButton
                icon={<MdDelete />}
                aria-label="Excluir"
                variant="ghost"
                color="white"
                onClick={() => handleDeleteDraftById(draft)}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
