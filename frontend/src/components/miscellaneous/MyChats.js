import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import useGlobalToast from "../../globalFunctions/toast";
import axios from "axios";
import {
    Avatar,
    Box,
    Button,
    Stack,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ChatLoading } from "./ChatLoading";
import {
    formatDateForChats,
    getSender,
    getSenderFull,
} from "../../config/chatLogics";
import { GroupChatModal } from "./GroupChatModal";
import {
    fileMsg,
    getTimeAgoString,
    mapToObject,
    shortendMsg,
} from "../../config/notificationLogics";

export const MyChats = ({ fetchAgain }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [loggedUser, setLoggedUser] = useState();
    const toast = useGlobalToast();
    const {
        user,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        setNotifications,
    } = ChatState();
    const maxHeadingLength = useBreakpointValue({
        base: 15,
        md: 45,
        lg: 25,
    });

    const removeNotification = (chat) => {
        setNotifications((prevNotifications) => {
            const updatedNotifications = new Map(prevNotifications);

            if (updatedNotifications.has(chat._id)) {
                // If notification exists for the chat._id, remove it
                updatedNotifications.delete(chat._id);
            }
            localStorage.setItem(
                "unseenNotifications",
                JSON.stringify(mapToObject(updatedNotifications))
            );
            return updatedNotifications;
        });
    };

    const fetchChats = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .get(`${BACKEND_URL}/api/chat`, config)
            .then(({ data }) => {
                // console.log("data", data);
                // toast.success(data.message, "");

                setChats(data.data);
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response
                        ? error.response.data.message
                        : "Something Went Wrong"
                );
            });
    };
    // console.log("chats", chats);
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);
    return (
        <Box
            display={{
                base: selectedChat ? "none" : "flex",
                lg: "flex",
            }}
            flexDir={"column"}
            alignItems={"center"}
            p={3}
            bg={"white"}
            w={{ base: "100%", lg: "31%" }}
            borderRadius={"lg"}
            borderWidth={"1px"}
        >
            <Box
                pb={3}
                px={3}
                fontSize={"28px"}
                fontFamily={"Work sans"}
                display={"flex"}
                flexDir={{
                    base: "column",
                    md: "column",
                    lg: "column",
                    xl: "row",
                }}
                flexWrap={"wrap"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
                borderBottom={"1px"}
                borderColor="gray.400"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display={"flex"}
                        fontSize={{ base: "17px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display={"flex"}
                flexDir={"column"}
                p={3}
                bg={"#F8F8F8"}
                w={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                {chats ? (
                    <Stack overflowY={"scroll"}>
                        {chats.map((chat) => (
                            <Box
                                onClick={() => {
                                    setSelectedChat(chat);
                                    removeNotification(chat);
                                }}
                                cursor={"pointer"}
                                bg={
                                    selectedChat === chat
                                        ? "#38B2AC"
                                        : "#E8E8E8"
                                }
                                color={
                                    selectedChat === chat
                                        ? "white"
                                        : "black"
                                }
                                px={3}
                                py={2}
                                borderRadius={"lg"}
                                key={chat._id}
                                display={"flex"}
                                gap={2}
                            >
                                <Avatar
                                    size="md"
                                    name={
                                        !chat.isGroupChat
                                            ? getSender(
                                                  loggedUser,
                                                  chat.users
                                              )
                                            : chat.chatName
                                    }
                                    src={
                                        !chat.isGroupChat
                                            ? getSenderFull(
                                                  loggedUser,
                                                  chat.users
                                              ).dp
                                            : chat.gdp
                                    }
                                />
                                <Box
                                    display={"flex"}
                                    flexDir={"column"}
                                    w={"100%"}
                                    color={
                                        selectedChat === chat
                                            ? "white"
                                            : "black"
                                    }
                                >
                                    <Box
                                        display={"flex"}
                                        justifyContent={
                                            "space-between"
                                        }
                                        w={"100%"}
                                    >
                                        <Text fontWeight={"450"}>
                                            {shortendMsg(
                                                !chat.isGroupChat
                                                    ? getSender(
                                                          loggedUser,
                                                          chat.users
                                                      )
                                                    : chat.chatName,
                                                maxHeadingLength
                                            )}
                                        </Text>
                                        <Text
                                            color={
                                                selectedChat === chat
                                                    ? "white"
                                                    : "#667781"
                                            }
                                            fontSize={"14px"}
                                        >
                                            {chat.latestMessage &&
                                                formatDateForChats(
                                                    chat.latestMessage
                                                        .updatedAt
                                                )}
                                        </Text>
                                    </Box>
                                    <Box
                                        color={
                                            selectedChat === chat
                                                ? "white"
                                                : "#667781"
                                        }
                                        fontSize="15px"
                                        display={"flex"}
                                    >
                                        <Box fontWeight={"bold"}>
                                            {chat.latestMessage &&
                                                chat.isGroupChat &&
                                                `${chat.latestMessage.sender.name}: \u00A0`}
                                        </Box>

                                        <Box>
                                            {chat.latestMessage &&
                                            chat.latestMessage
                                                .isFileInput
                                                ? fileMsg(
                                                      chat
                                                          .latestMessage
                                                          .fileType
                                                  )
                                                : chat.latestMessage &&
                                                  chat.latestMessage
                                                      .content &&
                                                  shortendMsg(
                                                      chat
                                                          .latestMessage
                                                          .content,
                                                      30
                                                  )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
};
