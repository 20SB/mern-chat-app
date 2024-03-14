import {
    Avatar,
    Box,
    Button,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tooltip,
    useBreakpointValue,
    useDisclosure,
} from "@chakra-ui/react";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/react";
import {
    BellIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import { ProfileModal } from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import useGlobalToast from "../../globalFunctions/toast";
import axios from "axios";
import { ChatLoading } from "./ChatLoading";
import { UserListItem } from "../UserAvatar/UserListItem";
import { getSender, getSenderFull } from "../../config/chatLogics";
import NotificationBadge from "react-notification-badge";

import { Effect } from "react-notification-badge";
import { GroupChatNotification } from "../UserAvatar/GroupChatNotification";
import { PersonlaChatNotification } from "../UserAvatar/PersonlaChatNotification";
import {
    mapToObject,
    shortendMsg,
} from "../../config/notificationLogics";

const SideDrawer = () => {
    // Define the backend URL using an environment variable
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const {
        user,
        setUser,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
    } = ChatState();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // use global toast function
    const toast = useGlobalToast();

    const maxHeadingLength = useBreakpointValue({
        md: 15,
        lg: 20,
    });

    // Convert notification map to array and sort by lastMsgTime if notifications is not null or undefined
    const notificationArray = notifications
        ? Array.from(notifications.values()).sort((a, b) =>
              a.lastMsgTime > b.lastMsgTime ? -1 : 1
          )
        : [];

    // Show no of notifications on the document title
    document.title =
        notificationArray.length == 0
            ? "Chit Chaat"
            : `(${notificationArray.length}) Chit Chaat`;
    const removeNotification = (chatId) => {
        setNotifications((prevNotifications) => {
            const updatedNotifications = new Map(prevNotifications);

            if (updatedNotifications.has(chatId)) {
                // If notification exists for the chat, remove it
                updatedNotifications.delete(chatId);
            }
            localStorage.setItem(
                "unseenNotifications",
                JSON.stringify(mapToObject(updatedNotifications))
            );
            return updatedNotifications;
        });
    };

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("unseenNotifications");
        navigate("/");
    };
    const handleSearch = async () => {
        if (!search) {
            toast.warning(
                "Warning",
                "Please Enter something in search"
            );
            return;
        } else {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            axios
                .get(
                    `${BACKEND_URL}/api/user?search=${search}`,
                    config
                )
                .then(({ data }) => {
                    console.log("users", data.users);
                    toast.success(data.message, "");

                    setSearchResult(data.users);
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
                    setLoading(false);
                });
        }
    };

    // console.log("chats", chats);
    const accessChat = async (userId) => {
        console.log(userId);
        setLoadingChat(true);

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .post(`${BACKEND_URL}/api/chat`, { userId }, config)
            .then(({ data }) => {
                console.log("res", data);
                toast.success(data.message, "");

                if (!chats.find((c) => c._id === data.data._id))
                    setChats([data.data, ...chats]);
                setSelectedChat(data.data);
            })
            .catch((error) => {
                console.log("error", error);
                toast.error(
                    "Error",
                    error.response
                        ? error.response.data.message
                        : "Something Went Wrong"
                );
            })
            .finally(() => {
                setLoadingChat(false);
                onClose();
            });
    };
    return (
        <>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bg={"white"}
                w={"100%"}
                p={"5px 10px 5px 10px"}
                borderWidth={"5px"}
                boxSizing="border-box"
            >
                <Tooltip
                    label="Search users to chat"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant={"ghost"} onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text
                            display={{ base: "none", md: "flex" }}
                            px={"4"}
                        >
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize={"2xl"} fontFamily={"Work sans"}>
                    {" "}
                    Chit Chaat
                </Text>
                <Box>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notificationArray.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize={"2xl"} m={1} />
                        </MenuButton>
                        <MenuList>
                            {!notificationArray.length && (
                                <MenuItem>No New Messages</MenuItem>
                            )}
                            {notificationArray.map((notification) => (
                                <MenuItem
                                    key={
                                        notification.messages[0].chat
                                            ._id
                                    }
                                    onClick={() => {
                                        setSelectedChat(
                                            notification.messages[0]
                                                .chat
                                        );
                                        removeNotification(
                                            notification.messages[0]
                                                .chat._id
                                        );
                                    }}
                                >
                                    {notification.messages[0].chat
                                        .isGroupChat ? (
                                        <>
                                            <GroupChatNotification
                                                key={
                                                    notification
                                                        .messages[0]
                                                        .chat._id
                                                }
                                                notification={
                                                    notification
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <PersonlaChatNotification
                                                key={
                                                    notification
                                                        .messages[0]
                                                        .chat._id
                                                }
                                                notification={
                                                    notification
                                                }
                                                sender={getSenderFull(
                                                    user.user,
                                                    notification
                                                        .messages[0]
                                                        .chat.users
                                                )}
                                            />
                                        </>
                                    )}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        {({ isOpen }) => (
                            <>
                                <MenuButton
                                    as={Button}
                                    rightIcon={
                                        isOpen ? (
                                            <ChevronUpIcon />
                                        ) : (
                                            <ChevronDownIcon />
                                        )
                                    }
                                    paddingX={{
                                        base: "2",
                                        md: "4",
                                    }}
                                    isActive={true}
                                >
                                    <Box
                                        display={"flex"}
                                        alignItems={"center"}
                                    >
                                        <Text
                                            display={{
                                                base: "none",
                                                md: "flex",
                                            }}
                                        >
                                            {shortendMsg(
                                                user.user.name,
                                                maxHeadingLength
                                            )}
                                        </Text>

                                        <Avatar
                                            size="sm"
                                            cursor="pointer"
                                            name={user.user.name}
                                            src={user.user.dp}
                                            ml={{
                                                base: "0",
                                                md: "2",
                                            }}
                                        />
                                    </Box>
                                </MenuButton>
                                <MenuList>
                                    <ProfileModal
                                        selectedUser={user.user}
                                    >
                                        <MenuItem>
                                            My Profile
                                        </MenuItem>
                                    </ProfileModal>
                                    <MenuDivider />
                                    <MenuItem onClick={logoutHandler}>
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </>
                        )}
                    </Menu>
                </Box>
            </Box>

            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth={"1px"}>
                        Search Users
                    </DrawerHeader>

                    <DrawerBody>
                        <Box display={"flex"} mb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() =>
                                        accessChat(user._id)
                                    }
                                />
                            ))
                        )}
                        {loadingChat && (
                            <Spinner ml={"auto"} display={"flex"} />
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default SideDrawer;
