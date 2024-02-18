import {
    Box,
    Button,
    FormControl,
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
import useGlobalToast from "../../globalFunctions/toast";
import { ChatState } from "../../context/chatProvider";
import axios from "axios";
import { UserListItem } from "../UserAvatar/UserListItem";
import { UserBadgeItem } from "../UserAvatar/UserBadgeItem";

export const GroupChatModal = ({ children }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingCreateGroup, setLoadingCreateGroup] = useState(false);
    const toast = useGlobalToast();

    const { user, chats, setChats } = ChatState();

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

    const handleSubmit = () => {
        if (!groupChatName || !selectedUsers) {
            toast.warning("Pleae fill all the fields", "");
            return;
        }
        setLoadingCreateGroup(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .post(
                `${BACKEND_URL}/api/chat/group`,
                { name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id)) },
                config
            )
            .then(({ data }) => {
                console.log("data", data);
                toast.success(data.message, "");
                setChats([data.data, ...chats]);
                onClose();
                setGroupChatName(null);
                setSelectedUsers([]);
                setSearchResult([]);
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response ? error.response.data.message : "Something Went Wrong"
                );
            })
            .finally(() => {
                setLoadingCreateGroup(false);
            });
    };

    const handleGroup = (userToAdd) => {
        // console.log("userToAdd", userToAdd);
        if (selectedUsers.includes(userToAdd)) {
            toast.warning("User already added", "");
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
                        <FormControl>
                            <Input
                                value={groupChatName ? groupChatName : null}
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => {
                                    setGroupChatName(e.target.value);
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: Rakesh, Mahesh, Arpan"
                                mb={1}
                                onChange={(e) => {
                                    handleSearch(e.target.value);
                                }}
                            />
                        </FormControl>
                        <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                                // <Text>abc</Text>
                            ))}
                        </Box>
                        {loadingSearch ? (
                            <div>loading Search Results</div>
                        ) : (
                            searchResult?.slice(0, 4).map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => {
                                        handleGroup(user);
                                    }}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            onClick={handleSubmit}
                            isLoading={loadingCreateGroup}
                        >
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
