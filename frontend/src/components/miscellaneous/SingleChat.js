import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import {
    Avatar,
    Box,
    CircularProgress,
    CircularProgressLabel,
    FormControl,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Spinner,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
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
import { FaFileVideo } from "react-icons/fa";
import Lottie from "react-lottie";
import loadingDots from "../../assets/animations/loadingDots.json";
import { AiOutlineFileGif } from "react-icons/ai";

import io from "socket.io-client";
import {
    mapToObject,
    shortendMsg,
} from "../../config/notificationLogics";
import { GifModal } from "./GifModal";
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
    const [isSendingMsg, setIsSendingMsg] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const maxHeadingLength = useBreakpointValue({
        base: 15,
        md: 50,
        lg: 45,
    });

    const { user, selectedChat, setSelectedChat, setNotifications } =
        ChatState();
    const toast = useGlobalToast();
    const typingRef = useRef(false);
    const fileInputDocRef = useRef(null);
    const fileInputImgRef = useRef(null);
    const fileInputVidRef = useRef(null);

    const handleFileInput = (ref) => {
        ref.current.click();
    };

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

    const handleGifMessage = (gif) => {
        console.log("gif inside function", gif);
        console.log("gif preview link", gif.url);

        setIsSendingMsg(true);
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${user.token}`,
            },
        };
        setNewMessage("");
        axios
            .post(
                `${BACKEND_URL}/api/message`,
                {
                    isFileInput: true,
                    isGif: true,
                    fileType: "img",
                    gif: gif.url,
                    chatId: selectedChat._id,
                },
                config
            )
            .then(({ data }) => {
                setMessages([...messages, data.data.message]);
                socket.emit("new message", data.data.message);
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response
                        ? error.response.data.message
                        : "Something Went Wrong"
                );
            })
            .finally(() => {
                setIsSendingMsg(false);
                setFetchAgain(!fetchAgain);
            });
    };

    const handleFileSelection = (e, fileType) => {
        // console.log("fileType", fileType);
        const files = e.target.files;
        // console.log("file", files);

        const formData = new FormData();
        formData.append("chatId", selectedChat._id);
        formData.append("isFileInput", true);
        formData.append("fileType", fileType);

        let largeFiles = 0;

        // Check file sizes and append only if they are within the limit
        for (let i = 0; i < files.length; i++) {
            if (files[i].size <= 100 * 1024 * 1024) {
                formData.append("files", files[i]);
            } else {
                // count no of large files
                largeFiles++;
                toast.warning(
                    `${files[i].name} exceeds the limit (100MB).`
                );
            }
        }

        if (largeFiles == files.length) {
            toast.error(
                "Please upload files within the 100MB limit."
            );
            return;
        }

        setIsSendingMsg(true);
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${user.token}`,
            },
            onUploadProgress: (progressEvent) => {
                // Calculate the upload percentage
                const percentage = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentage);
                console.log("Upload Progress:", percentage);
                // You can set or update the progress state here if needed
            },
        };

        setNewMessage("");
        axios
            .post(`${BACKEND_URL}/api/message`, formData, config)
            .then(({ data }) => {
                setUploadProgress(0);
                socket.emit(
                    "multiple new messages",
                    data.data.message
                );
                console.log("new message", data);
                setMessages([...messages, ...data.data.message]);
            })
            .catch((error) => {
                setUploadProgress(0);
                toast.error(
                    "Error",
                    error.response
                        ? error.response.data.message
                        : "Something Went Wrong"
                );
            })
            .finally(() => {
                setIsSendingMsg(false);
                setFetchAgain(!fetchAgain);
            });
    };

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
            .get(
                `${BACKEND_URL}/api/message?chatId=${selectedChat._id}`,
                config
            )
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
                        error.response
                            ? error.response.data.message
                            : "Something Went Wrong"
                    );
                })
                .finally(() => {
                    setFetchAgain(!fetchAgain);
                });
        }
    };

    const deleteMessage = (msgId) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .delete(
                `${BACKEND_URL}/api/message/unsend?messageId=${msgId}`,
                config
            )
            .then(({ data }) => {
                // Successfully deleted message, now fetch messages again
                setMessages(
                    messages.filter(
                        (message) => message._id !== msgId
                    )
                );

                // Emit socket event to inform other users to fetch messages again
                socket.emit("delete message", data.data);
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response
                        ? error.response.data.message
                        : "Something Went Wrong"
                );
            })
            .finally(() => {
                setFetchAgain(!fetchAgain);
            });
    };

    const editMessage = (msgId, updatedMsg) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .put(
                `${BACKEND_URL}/api/message/update?messageId=${msgId}`,
                { messageId: msgId, content: updatedMsg },
                config
            )
            .then(({ data }) => {
                // Find the index of the message in your messages array
                const messageIndex = messages.findIndex(
                    (message) => message._id === data.data._id
                );

                // If the message is found, update its content
                if (messageIndex !== -1) {
                    const updatedMessages = [...messages]; // Create a copy of the messages array
                    updatedMessages[messageIndex].content =
                        data.data.content; // Update the content
                    setMessages(updatedMessages); // Update the state
                }

                console.log("updated msg", data.data);

                // Emit socket event to inform other users to update the specified messages
                socket.emit("update message", data.data);
            })
            .catch((error) => {
                console.log("Error:", error);

                toast.error(
                    "Error",
                    error.response
                        ? error.response.data.message
                        : "Something Went Wrong"
                );
            })
            .finally(() => {
                setFetchAgain(!fetchAgain);
            });
    };

    // Fetch messages when the selected chat changes
    useEffect(() => {
        fecthMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    // Update messages when a new message is received
    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !==
                    newMessageReceived.chat._id
            ) {
                const { chat } = newMessageReceived;
                const chatId = chat._id;

                // Update notifications for the chat
                setNotifications((prevNotifications) => {
                    const updatedNotifications = new Map(
                        prevNotifications
                    );

                    if (updatedNotifications.has(chatId)) {
                        // If notification exists for the chat, update it
                        const notification =
                            updatedNotifications.get(chatId);

                        // Check if the new message is not already in the messages array
                        if (
                            !notification.messages.some(
                                (msg) =>
                                    msg._id === newMessageReceived._id
                            )
                        ) {
                            // Prepend the new message to the messages array
                            notification.messages = [
                                newMessageReceived,
                                ...notification.messages,
                            ];
                            notification.count++;
                            notification.lastMsgTime =
                                newMessageReceived.createdAt;
                        }
                    } else {
                        // If notification doesn't exist, create a new one
                        updatedNotifications.set(chatId, {
                            messages: [newMessageReceived],
                            count: 1,
                            lastMsgTime: newMessageReceived.createdAt,
                        });
                    }

                    localStorage.setItem(
                        "unseenNotifications",
                        JSON.stringify(
                            mapToObject(updatedNotifications)
                        )
                    );
                    return updatedNotifications;
                });
            } else {
                setMessages([...messages, newMessageReceived]);
            }
            setFetchAgain(!fetchAgain);
        });
        socket.on(
            "multiple messages received",
            (newMessagesReceived) => {
                // check if chat is opened whose new message is received now
                if (
                    !selectedChatCompare ||
                    selectedChatCompare._id !==
                        newMessagesReceived[0].chat._id
                ) {
                    newMessagesReceived.forEach(
                        (newMessageReceived) => {
                            const { chat } = newMessageReceived;
                            const chatId = chat._id;

                            // Update notifications for the chat
                            setNotifications((prevNotifications) => {
                                const updatedNotifications = new Map(
                                    prevNotifications
                                );

                                if (
                                    updatedNotifications.has(chatId)
                                ) {
                                    // If notification exists for the chat, update it
                                    const notification =
                                        updatedNotifications.get(
                                            chatId
                                        );

                                    // Check if the new message is not already in the messages array
                                    if (
                                        !notification.messages.some(
                                            (msg) =>
                                                msg._id ===
                                                newMessageReceived._id
                                        )
                                    ) {
                                        // Prepend the new message to the messages array
                                        notification.messages = [
                                            newMessageReceived,
                                            ...notification.messages,
                                        ];
                                        notification.count++;
                                        notification.lastMsgTime =
                                            newMessageReceived.createdAt;
                                    }
                                } else {
                                    // If notification doesn't exist, create a new one
                                    updatedNotifications.set(chatId, {
                                        messages: [
                                            newMessageReceived,
                                        ],
                                        count: 1,
                                        lastMsgTime:
                                            newMessageReceived.createdAt,
                                    });
                                }

                                return updatedNotifications;
                            });

                            setFetchAgain(!fetchAgain);
                        }
                    );
                } else {
                    setMessages([
                        ...messages,
                        ...newMessagesReceived,
                    ]);
                }
            }
        );
        socket.on("message deleted", (messageDeleted) => {
            setMessages(
                messages.filter(
                    (message) => message._id !== messageDeleted._id
                )
            );
        });
        socket.on("message updated", (messageUpdated) => {
            setMessages(
                messages.filter(
                    (message) => message._id !== messageUpdated._id
                )
            );
            // Find the index of the message in your messages array
            const messageIndex = messages.findIndex(
                (message) => message._id === messageUpdated._id
            );

            // If the message is found, update its content
            if (messageIndex !== -1) {
                const updatedMessages = [...messages]; // Create a copy of the messages array
                updatedMessages[messageIndex].content =
                    messageUpdated.content; // Update the content
                setMessages(updatedMessages); // Update the state
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
                        pb={{
                            base: "2",
                            md: "3",
                        }}
                        px={{
                            base: "1",
                            md: "2",
                        }}
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
                            w={{
                                base: "calc(100% - 50px)",
                                md: "100%",
                            }}
                        >
                            {!selectedChat.isGroupChat ? (
                                <>
                                    <ProfileModal
                                        selectedUser={getSenderFull(
                                            user,
                                            selectedChat.users
                                        )}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                            }}
                                        >
                                            <Avatar
                                                mt={"7px"}
                                                m={1}
                                                cursor={"pointer"}
                                                name={getSender(
                                                    user,
                                                    selectedChat.users
                                                )}
                                                src={
                                                    getSenderFull(
                                                        user,
                                                        selectedChat.users
                                                    ).dp
                                                }
                                                h={"2.5rem"}
                                                w={"2.5rem"}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems:
                                                        "flex-end",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {shortendMsg(
                                                    getSender(
                                                        user,
                                                        selectedChat.users
                                                    ),
                                                    maxHeadingLength
                                                )}
                                                {isTyping ? (
                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "13px",
                                                            fontFamily:
                                                                "Segoe UI",
                                                            color: "#667781",
                                                            display:
                                                                "flex",
                                                            padding:
                                                                "0px 0px 7px 10px",
                                                            alignItems:
                                                                "flex-end",
                                                        }}
                                                    >
                                                        typing
                                                        <Lottie
                                                            options={getDefaultOptions(
                                                                loadingDots
                                                            )}
                                                            width={20}
                                                            height={
                                                                "50%"
                                                            }
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
                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fecthMessages={fecthMessages}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <div>
                                                <Avatar
                                                    mt={"7px"}
                                                    m={1}
                                                    name={
                                                        selectedChat.chatName
                                                    }
                                                    src={
                                                        selectedChat.gdp
                                                    }
                                                    h={"2.5rem"}
                                                    w={"2.5rem"}
                                                />
                                                {shortendMsg(
                                                    selectedChat.chatName.toUpperCase(),
                                                    maxHeadingLength
                                                )}
                                            </div>
                                            {isTyping ? (
                                                <div
                                                    style={{
                                                        fontSize:
                                                            "13px",
                                                        fontFamily:
                                                            "Segoe UI",
                                                        color: "#667781",
                                                        display:
                                                            "flex",
                                                        padding:
                                                            "0px 0px 7px 10px",
                                                        alignItems:
                                                            "flex-end",
                                                    }}
                                                >
                                                    {typingUser.name}{" "}
                                                    is typing
                                                    <Lottie
                                                        options={getDefaultOptions(
                                                            loadingDots
                                                        )}
                                                        width={20}
                                                        height={"50%"}
                                                    />
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </UpdateGroupChatModal>
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
                        p={{
                            base: "1",
                            md: "2",
                            lg: "3",
                        }}
                        bg={"#E8E8E8"}
                        w={"100%"}
                        h={"100%"}
                        borderRadius={"lg"}
                        overflow={"hidden"}
                        style={{
                            backgroundImage: `url(${chatWall})`,
                        }}
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
                                <ScrollableChat
                                    messages={messages}
                                    editHandler={editMessage}
                                    deleteHandler={deleteMessage}
                                    style={{ overflowX: "hidden" }}
                                />

                                <Box
                                    w={"100%"}
                                    display={"flex"}
                                    justifyContent={"flex-end"}
                                >
                                    {isSendingMsg ? (
                                        uploadProgress == 100 ? (
                                            <CircularProgress
                                                isIndeterminate
                                                color="green.400"
                                                size={8}
                                            />
                                        ) : (
                                            <CircularProgress
                                                value={uploadProgress}
                                                color="green.400"
                                                size={8}
                                            >
                                                <CircularProgressLabel
                                                    zIndex={2}
                                                    fontSize={8}
                                                >
                                                    {uploadProgress}%
                                                </CircularProgressLabel>
                                            </CircularProgress>
                                        )
                                    ) : (
                                        ""
                                    )}
                                </Box>
                            </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                            display={"flex"}
                            flexDir={"column"}
                            alignItems={"flex-start"}
                        >
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
                                        width={5}
                                    />
                                    <Portal>
                                        <MenuList>
                                            <MenuItem
                                                onClick={() =>
                                                    handleFileInput(
                                                        fileInputDocRef
                                                    )
                                                }
                                                icon={
                                                    <IoIosDocument
                                                        size={20}
                                                        color="#7F66FF"
                                                    />
                                                }
                                            >
                                                Document
                                                <input
                                                    ref={
                                                        fileInputDocRef
                                                    }
                                                    type="file"
                                                    style={{
                                                        display:
                                                            "none",
                                                    }}
                                                    onChange={(e) =>
                                                        handleFileSelection(
                                                            e,
                                                            "doc"
                                                        )
                                                    }
                                                    multiple
                                                />
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleFileInput(
                                                        fileInputImgRef
                                                    )
                                                }
                                                icon={
                                                    <IoMdPhotos
                                                        size={20}
                                                        color="#007BFC"
                                                    />
                                                }
                                            >
                                                Photos
                                                <input
                                                    ref={
                                                        fileInputImgRef
                                                    }
                                                    type="file"
                                                    style={{
                                                        display:
                                                            "none",
                                                    }}
                                                    onChange={(e) =>
                                                        handleFileSelection(
                                                            e,
                                                            "img"
                                                        )
                                                    }
                                                    accept="image/*"
                                                    multiple
                                                />
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleFileInput(
                                                        fileInputVidRef
                                                    )
                                                }
                                                icon={
                                                    <FaFileVideo
                                                        size={20}
                                                        color="#6c0101"
                                                    />
                                                }
                                            >
                                                Videos
                                                <input
                                                    ref={
                                                        fileInputVidRef
                                                    }
                                                    type="file"
                                                    style={{
                                                        display:
                                                            "none",
                                                    }}
                                                    onChange={(e) =>
                                                        handleFileSelection(
                                                            e,
                                                            "vid"
                                                        )
                                                    }
                                                    accept="video/*"
                                                    multiple
                                                />
                                            </MenuItem>
                                            <GifModal
                                                handleGifMessage={
                                                    handleGifMessage
                                                }
                                            >
                                                <MenuItem
                                                    icon={
                                                        <AiOutlineFileGif
                                                            size={20}
                                                            color="#156c01"
                                                        />
                                                    }
                                                >
                                                    Gif
                                                </MenuItem>
                                            </GifModal>
                                        </MenuList>
                                    </Portal>
                                </Menu>
                                <InputEmoji
                                    value={newMessage}
                                    onChange={typingHandler}
                                    placeholder="Enter message.."
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
                                    onClick={() =>
                                        sendMessage({ key: "Enter" })
                                    }
                                />
                            </Box>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    h={"100%"}
                >
                    <Text
                        fontSize={"3xl"}
                        pb={3}
                        fontFamily={"Work sans"}
                    >
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};
