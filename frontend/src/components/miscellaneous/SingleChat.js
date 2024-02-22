import React, { useEffect, useRef, useState } from "react";
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
} from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
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
import Lottie from "react-lottie";
import typingDots from "../../assets/animations/typing.json";
import loadingDots from "../../assets/animations/loadingDots.json";

import io from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
var socket, selectedChatCompare;

export const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState({});

    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useGlobalToast();
    const typingRef = useRef(false);

    const getDefaultOptions = (animationData) => {
        let defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
            },
        };
        return defaultOptions;
    };

    // Establish a connection to the Socket.IO server when the component mounts
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => {
            setSocketConnected(true);
        });
        socket.on("typing", (userData) => {
            setIsTyping(true);
            setTypingUser(userData);
        });
        socket.on("stop typing", () => {
            setIsTyping(false);
            setTypingUser({});
        });
    }, []);

    // Fetch messages when the selected chat changes
    const fecthMessages = () => {
        if (!selectedChat) return;

        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .get(`${BACKEND_URL}/api/message?chatId=${selectedChat._id}`, config)
            .then(({ data }) => {
                // toast.success(data.message, "");
                setMessages(data.data);
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response
                        ? error.response.data.message
                        : "Something Went Wrong in fetching messages"
                );
            })
            .finally(() => {
                setLoading(false);
                socket.emit("join chat", selectedChat._id);
            });
    };

    // Send a new message when the user presses Enter
    const sendMessage = (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
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
                    socket.emit("new message", data.data.message);
                    setMessages([...messages, data.data.message]);
                })
                .catch((error) => {
                    toast.error(
                        "Error",
                        error.response ? error.response.data.message : "Something Went Wrong"
                    );
                });
        }
    };

    // Fetch messages when the selected chat changes
    useEffect(() => {
        fecthMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    // Update messages when a new message is received
    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // give notification
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    // Typing handler function
    const typingHandler = (newText) => {
        setNewMessage(newText);
        if (!socketConnected) return;

        if (!typingRef.current) {
            typingRef.current = true; // Update the reference
            socket.emit("typing", selectedChat._id, user.user);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typingRef.current) {
                socket.emit("stop typing", selectedChat._id);
                typingRef.current = false;
                setTypingUser({});
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Box
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        display={"flex"}
                        justifyContent={{ base: "space-between" }}
                        alignItems={"center"}
                    >
                        <Box
                            fontFamily={"Work sans"}
                            display={"flex"}
                            justifyContent={{ base: "space-between" }}
                            alignItems={"center"}
                            w={{ base: "calc(100% - 50px)", md: "100%" }}
                        >
                            {!selectedChat.isGroupChat ? (
                                <>
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                                        <div style={{ display: "flex" }}>
                                            <Avatar
                                                mt={"7px"}
                                                m={1}
                                                cursor={"pointer"}
                                                name={getSender(user, selectedChat.users)}
                                                src={getSenderFull(user, selectedChat.users).dp}
                                                h={"2.5rem"}
                                                w={"2.5rem"}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "flex-end",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {getSender(user, selectedChat.users)}
                                                {isTyping ? (
                                                    <div
                                                        style={{
                                                            fontSize: "13px",
                                                            fontFamily: "Segoe UI",
                                                            color: "#667781",
                                                            display: "flex",
                                                            padding: "0px 0px 7px 10px",
                                                            alignItems: "flex-end",
                                                        }}
                                                    >
                                                        typing
                                                        <Lottie
                                                            options={getDefaultOptions(loadingDots)}
                                                            width={20}
                                                            height={"50%"}
                                                        />
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </ProfileModal>
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
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-end",
                                        }}
                                    >
                                        {selectedChat.chatName.toUpperCase()}{" "}
                                        {isTyping ? (
                                            <div
                                                style={{
                                                    fontSize: "13px",
                                                    fontFamily: "Segoe UI",
                                                    color: "#667781",
                                                    display: "flex",
                                                    padding: "0px 0px 7px 10px",
                                                    alignItems: "flex-end",
                                                }}
                                            >
                                                {typingUser.name} is typing
                                                <Lottie
                                                    options={getDefaultOptions(loadingDots)}
                                                    width={20}
                                                    height={"50%"}
                                                />
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fecthMessages={fecthMessages}
                                    />
                                </>
                            )}
                        </Box>
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            fontSize={15}
                            icon={<CloseIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                    </Box>
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
                            display={"flex"}
                            flexDir={"column"}
                            alignItems={"flex-start"}
                        >
                            {/* {isTyping ? (
                                <div>
                                    <Lottie options={getDefaultOptions(typingDots)} width={80} />
                                </div>
                            ) : (
                                <></>
                            )} */}
                            <Box
                                display={"flex"}
                                position={"relative"}
                                alignItems={"center"}
                                w={"100%"}
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
                                            <MenuItem
                                                icon={<IoMdPhotos size={20} color="#007BFC" />}
                                            >
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
                                    onChange={typingHandler}
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
                            </Box>
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
