import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import Header from "./HearderUI";
import { usePostState } from "../repositorios/usePostState";
import { useDraftState } from "../repositorios/useDraftState";
import AdicionarVersiculo from "./AdicionarVersiculoUI";
import { Draft, Post } from "../types/types";
import InfoDraftPage from "./components/InfoDraftPage";
import InfoPostPage from "./components/InfoPostPage";

// interface Post {
//   id?: string;
//   passage: string;
//   text: string;
//   image?: string;
//   createdAt?: Date;
//   likes?: number;
//   comments?: number;
// }

const headerBgColor = "#F5F5F5";

export default function AppPage(): JSX.Element {

  const [activeTab, setActiveTab] = useState<"drafts" | "posts">("posts");
  const [editingDraft, setEditingDraft] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const posts = usePostState((state) => state.posts);
  const drafts = useDraftState((state) => state.drafts);
  const getAllWithoutPosts = usePostState((state) => state.getAllWithoutPosts);
  const getAllWithoutDrafts = useDraftState(
    (state) => state.getAllWithoutDrafts
  );
  const addDraft = useDraftState((state) => state.addDraft);

  const deleteGraftById = useDraftState((state) => state.deleteGraftById);
  const deletePostById = usePostState((state) => state.deletePostById);
  const publishPost = usePostState((state) => state.publishPost);

  useEffect(() => {
    getAllWithoutPosts();
    getAllWithoutDrafts();
  }, []);

  const handleSaveDraft = async (draft: Draft) => {
    try {
      addDraft(draft);
      setEditingDraft(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar rascunho:", error);
    }
  };

  const handlePublish = async (draft: Draft) => {
    try {
      publishPost(draft);
      deleteGraftById(draft.id ?? "");
    } catch (error) {
      console.error("Erro ao publicar post:", error);
    }
  };

  const handleEditDraft = (post: Post) => {
    setEditingDraft(post);
    setIsModalOpen(true);
  };

  const handleDeleteDraftById = async (draft: Draft) => {
    try {
      deleteGraftById(draft.id ?? "");
    } catch (error) {
      console.error("Erro ao excluir rascunho:", error);
    }
  };

  const handleDeletePostById = async (post: Post) => {
    try {
      deletePostById(post.id ?? "");
    } catch (error) {
      console.error("Erro ao excluir post:", error);
    }
  };

  const handleOpenAddVersiculo = () => {
    setEditingDraft(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingDraft) {
          setEditingDraft({ ...editingDraft, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Header />
      <Box
        p={4}
        bg={headerBgColor}
        minH="calc(100vh - 80px)"
        mt="6"
        mx="auto"
        maxW="container.xl"
        borderRadius="md"
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
        position="relative"
      >
        <Box position="absolute" top="4" right="4" zIndex="1">
          <Button colorScheme="blue" onClick={handleOpenAddVersiculo}>
            Adicionar versículo
          </Button>
          <AdicionarVersiculo
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            draft={editingDraft}
            onSaveDraft={handleSaveDraft}
            // onImageChange={handleImageChange}
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={4}
          gap={4}
        >
          <Box width="100%" maxWidth="800px">
            <Text fontSize="lg" fontWeight="bold" mb={2} textAlign="center">
              Visualizar:
            </Text>
            <Tabs
              variant="enclosed"
              isLazy
              onChange={(index) =>
                setActiveTab(index === 0 ? "drafts" : "posts")
              }
              align="center"
            >
              <TabList>
                <Tab>Rascunhos</Tab>
                <Tab>Publicações</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {drafts.length === 0 ? (
                      <Text>Nenhum rascunho ainda.</Text>
                    ) : (
                      drafts.map((draft, index) => (
                        <InfoDraftPage
                          key={draft.id || `draft-${index}`}
                          draft={draft}
                          handleDeleteDraftById={handleDeleteDraftById}
                          handlePublish={() => handlePublish(draft)}
                        />
                      ))
                    )}
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {posts.length === 0 ? (
                      <Text>Nenhuma publicação ainda.</Text>
                    ) : (
                      posts.map((post, index) => (
                        <InfoPostPage
                          key={post.id || `post-${index}`}
                          post={post}
                          handleDeletePostById={handleDeletePostById}
                          handleEditDraft={handleEditDraft}
                        />
                      ))
                    )}
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
