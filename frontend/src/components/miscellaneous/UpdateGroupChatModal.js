import { ViewIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import useGlobalToast from "../../globalFunctions/toast";
import { UserBadgeItem } from "../UserAvatar/UserBadgeItem";
import { UserListItem } from "../UserAvatar/UserListItem";
import axios from "axios";

export const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fecthMessages }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingRename, setLoadingRename] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const toast = useGlobalToast();

    // console.log("selectedChat", selectedChat);
    const handleRename = () => {
        if (!groupChatName) {
            return;
        }

        setLoadingRename(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .put(
                `${BACKEND_URL}/api/chat/rename_group`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            )
            .then(({ data }) => {
                setSelectedChat(data.data);
                setFetchAgain(!fetchAgain);
                toast.success(data.message, "");
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response ? error.response.data.message : "Something Went Wrong"
                );
            })
            .finally(() => {
                setLoadingRename(false);
                setGroupChatName("");
            });
    };

    const handleSearch = (query) => {
        setSearch(query);
        if (!query) {
            setSearchResult([]);
            return;
        }

        setLoadingSearch(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .get(`${BACKEND_URL}/api/user?search=${search}`, config)
            .then(({ data }) => {
                // console.log("users", data.users)
                setSearchResult(data.users);
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response ? error.response.data.message : "Something Went Wrong"
                );
            })
            .finally(() => {
                setLoadingSearch(false);
            });
    };

    const handleAddUser = (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast.warning("Warning", "User already in the Group");
            return;
        }

        if (selectedChat?.groupAdmin?._id !== user.user._id) {
            toast.error("Error", "Only Admins can add Someone!");
            return;
        }

        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .put(
                `${BACKEND_URL}/api/chat/add_to_group`,
                { chatId: selectedChat._id, userId: userToAdd._id },
                config
            )
            .then(({ data }) => {
                setSelectedChat(data.data);
                setFetchAgain(!fetchAgain);
                toast.success(data.message, "");
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response ? error.response.data.message : "Something Went Wrong"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const handleRemove = (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user.user._id && userToRemove._id !== user.user._id) {
            toast.error("Error", "Only Admins can remove Someone!");
        }

        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .put(
                `${BACKEND_URL}/api/chat/remove_from_group`,
                { chatId: selectedChat._id, userId: userToRemove._id },
                config
            )
            .then(({ data }) => {
                userToRemove._id === user.user._id ? setSelectedChat() : setSelectedChat(data.data);
                setFetchAgain(!fetchAgain);
                fecthMessages();
                toast.success(data.message, "");
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response ? error.response.data.message : "Something Went Wrong"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>

                        <FormControl display={"flex"}>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => {
                                    setGroupChatName(e.target.value);
                                }}
                            />
                            <Button
                                variant={"solid"}
                                colorScheme="teal"
                                ml={1}
                                isLoading={loadingRename}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        {selectedChat.groupAdmin._id == user.user._id ? (
                            <>
                                <FormControl>
                                    <Input
                                        placeholder="Add Users eg: Rakesh, Mahesh, Arpan"
                                        mb={1}
                                        onChange={(e) => {
                                            handleSearch(e.target.value);
                                        }}
                                    />
                                </FormControl>
                                {loadingSearch ? (
                                    <div>loading Search Results</div>
                                ) : (
                                    searchResult?.slice(0, 4).map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => {
                                                handleAddUser(user);
                                            }}
                                        />
                                    ))
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="red"
                            mr={3}
                            isLoading={loading}
                            onClick={() => {
                                handleRemove(user.user);
                            }}
                        >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
