import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import {
    Avatar,
    Box,
    FormControl,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Spinner,
    Text,
    position,
} from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/chatLogics";
import { ProfileModal } from "./ProfileModal";
import { UpdateGroupChatModal } from "./UpdateGroupChatModal";
import axios from "axios";
import useGlobalToast from "../../globalFunctions/toast";
import "../../assets/css/styles.css";
import chatWall from "../../assets/images/wpWall.png";
import { ScrollableChat } from "./ScrollableChat";
import InputEmoji from "react-input-emoji";
import { IoIosDocument, IoMdPhotos } from "react-icons/io";
import { FaUser, FaCamera } from "react-icons/fa";

export const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useGlobalToast();

    console.log("messages", messages);
    const fecthMessages = () => {
        if (!selectedChat) return;
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .get(`${BACKEND_URL}/api/message?chatId=${selectedChat._id}`, config)
            .then(({ data }) => {
                console.log("messages data", data);
                toast.success(data.message, "");
                setMessages(data.data);
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response
                        ? error.response.data.message
                        : "Something Went Wrong in fetching messages"
                );
            });
    };
    const sendMessage = (e) => {
        if (e.key === "Enter" && newMessage) {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setNewMessage("");
            axios
                .post(
                    `${BACKEND_URL}/api/message`,
                    { content: newMessage, chatId: selectedChat._id },
                    config
                )
                .then(({ data }) => {
                    console.log("data", data);
                    toast.success(data.message, "");
                    setMessages([...messages, data.data.message]);
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
        }
    };

    useEffect(() => {
        fecthMessages();
    }, [selectedChat]);
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={{ base: "space-between" }}
                        alignItems={"center"}
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                <div>
                                    <Avatar
                                        mt={"7px"}
                                        m={1}
                                        cursor={"pointer"}
                                        name={getSender(user, selectedChat.users)}
                                        src={getSenderFull(user, selectedChat.users).dp}
                                        h={"2.5rem"}
                                        w={"2.5rem"}
                                    />
                                    {getSender(user, selectedChat.users)}
                                </div>
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {/* <div>
                                    <Avatar
                                        mt={"7px"}
                                        m={1}
                                        cursor={"pointer"}
                                        name={selectedChat.chatName.toUpperCase()}
                                        src={selectedChat.dp}
                                        h={"2.5rem"}
                                        w={"2.5rem"}
                                    />
                                    {selectedChat.chatName.toUpperCase()}
                                </div> */}
                                {selectedChat.chatName.toUpperCase()}{" "}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fecthMessages={fecthMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display={"flex"}
                        flexDir={"column"}
                        justifyContent={"flex-end"}
                        p={3}
                        bg={"#E8E8E8"}
                        w={"100%"}
                        h={"100%"}
                        borderRadius={"lg"}
                        overflow={"hidden"}
                        style={{ backgroundImage: `url(${chatWall})` }}
                    >
                        {loading ? (
                            <Spinner
                                size={"xl"}
                                w={20}
                                h={20}
                                alignSelf={"center"}
                                margin={"auto"}
                            />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                            mt={3}
                            display={"flex"}
                            position={"relative"}
                            alignItems={"center"}
                        >
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    icon={<AddIcon />}
                                    borderRadius={"50%"}
                                    bg={"#FFFFFF"}
                                />
                                <Portal>
                                    <MenuList>
                                        <MenuItem
                                            icon={<IoIosDocument size={20} color="#7F66FF" />}
                                        >
                                            Document
                                        </MenuItem>
                                        <MenuItem icon={<IoMdPhotos size={20} color="#007BFC" />}>
                                            Photos & Videos
                                        </MenuItem>
                                        <MenuItem icon={<FaCamera size={20} color="#FF2E74" />}>
                                            Camera
                                        </MenuItem>
                                        <MenuItem icon={<FaUser size={20} color="#009DE2" />}>
                                            Contact
                                        </MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                            <InputEmoji
                                value={newMessage}
                                onChange={setNewMessage}
                                placeholder="Enter message.."
                                width={"50%"}
                            />
                            <img
                                width="24"
                                height="24"
                                src="https://img.icons8.com/material-rounded/24/sent.png"
                                alt="sent"
                                style={{
                                    right: "10px",
                                    top: "8px",
                                    cursor: "pointer",
                                }}
                                onClick={() => sendMessage({ key: "Enter" })}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
                    <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};
