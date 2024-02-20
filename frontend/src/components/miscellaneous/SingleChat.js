import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import {
    Avatar,
    Box,
    FormControl,
    IconButton,
    Input,
    Spinner,
    Text,
    position,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/chatLogics";
import { ProfileModal } from "./ProfileModal";
import { UpdateGroupChatModal } from "./UpdateGroupChatModal";
import axios from "axios";
import useGlobalToast from "../../globalFunctions/toast";
import "../../assets/css/styles.css";
import chatWall from "../../assets/images/wpWall.png";
import { ScrollableChat } from "./ScrollableChat";
import EmojiPicker from "emoji-picker-react";
import InputEmoji from "react-input-emoji";

export const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [text, setText] = useState("");
    console.log(text);

    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useGlobalToast();
    function handleOnEnter(text) {
        console.log("enter", text);
    }
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
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        //Typing logic here
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
                        bg={"red"}
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
                        <InputEmoji
                            value={text}
                            onChange={setText}
                            cleanOnEnter
                            onEnter={handleOnEnter}
                            placeholder="Type a message"
                        />
                        {showEmojiPicker && (
                            <EmojiPicker
                                onEmojiClick={(event, emojiObject) => {
                                    console.log(event.target);
                                    console.log(emojiObject);
                                    setNewMessage((prevMessage) =>
                                        prevMessage
                                            ? prevMessage + emojiObject.emoji
                                            : emojiObject.emoji
                                    );
                                }}
                                style={{ position: "absolute", height: "60vh", bottom: "80px" }}
                            />
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                            mt={3}
                            display={"flex"}
                            position={"relative"}
                            alignItems={"center"}
                        >
                            <i
                                class="fa-regular fa-face-smile"
                                style={{ fontSize: "25px", padding: "0px 10px", cursor: "pointer" }}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            ></i>
                            <Input
                                variant={"filled"}
                                bg="#E0E0E0"
                                placeholder="Enter message.."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                            <img
                                width="24"
                                height="24"
                                src="https://img.icons8.com/material-rounded/24/sent.png"
                                alt="sent"
                                style={{
                                    position: "absolute",
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
