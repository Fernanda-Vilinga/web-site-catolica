import { Box, IconButton, Text } from "@chakra-ui/react";
import { MdDelete, MdEdit, MdFavorite, MdMessage } from "react-icons/md";

import { Post } from "../../types/types";
import { extractTextAfterReference, formatDate } from "../../utils/helpers";

interface InfoDraftProps {
    post: Post
    index: any
    handleDeletePostById: (post: Post) => void
    handleEditDraft: (post: Post) => void
}

export default function InfoPostPage(props: InfoDraftProps): JSX.Element {

    const {
        post,
        index,
        handleDeletePostById,
        handleEditDraft
    } = props

    return (
        <Box
        key={post.id || `post-${index}`}
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
        {post.image && (
          <Box
            position="relative"
            width="100%"
            height="200px"
            overflow="hidden"
            borderRadius="md"
          >
            <img
              src={post.image}
              alt="Imagem da publicação"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
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
              p={4}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              zIndex={1}
            >
              <Text mb={2} fontWeight="bold">{post.passage}</Text>
              <Text mb={2}>{extractTextAfterReference(post.text)}</Text>
              {post.createdAt && (
                <Text fontSize="xs" mt={2}>
                  Criado em: {formatDate(post.createdAt)}
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
                <IconButton
                  icon={<MdEdit />}
                  aria-label="Editar"
                  variant="ghost"
                  color="white"
                  onClick={() => handleEditDraft(post)}
                />
                <IconButton
                  icon={<MdDelete />}
                  aria-label="Excluir"
                  variant="ghost"
                  color="white"
                  onClick={() => handleDeletePostById(post)}
                />
              </Box>
              <Box
                position="absolute"
                bottom="0"
                left="0"
                width="100%"
                p={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                zIndex={2}
                bg="rgba(0, 0, 0, 0.3)"
              >
                <Box textAlign="center" color="white">
                  <IconButton
                    color="white"
                    icon={<MdFavorite />}
                    aria-label="Curtir"
                    variant="ghost"
                  />
                  {/* <Text fontSize="sm" mt={1}>{post.likes || 0}</Text> */}
                </Box>
                <Box textAlign="center" color="white">
                  <IconButton
                    color="white"
                    icon={<MdMessage />}
                    aria-label="Comentário"
                    variant="ghost"
                  />
                  {/* <Text fontSize="sm" mt={1}>{post.comments || 0}</Text> */}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    );
}