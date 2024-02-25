import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
    Avatar,
    AvatarBadge,
    Badge,
    Box,
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { getTimeAgoString, shortendMsg } from "../../config/notificationLogics";
import NotificationBadge from "react-notification-badge";

export const GroupChatNotification = ({ notification }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const handleSubMenuClick = (e) => {
        if (notification.messages.length > 1) {
            e.preventDefault();
            e.stopPropagation();
            setIsSubMenuOpen(!isSubMenuOpen);
        }
    };

    return (
        <Box display={"flex"} alignItems={"center"} width={"100%"}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Avatar size="sm" name="" src=""></Avatar>
                <Badge
                    variant="solid"
                    colorScheme="red"
                    borderRadius={"50%"}
                    width={3}
                    height={3}
                    fontSize={"8px"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    style={{
                        position: "absolute",
                        top: "-3px",
                        left: "-6px",
                        border: "2px solid white",
                        padding: "6px",
                    }}
                >
                    {notification.messages.length}
                </Badge>
            </div>
            <Box
                display={"flex"}
                flexDir={"column"}
                ml={2}
                justifyContent={"space-between"}
                width={"100%"}
            >
                <Text display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    {shortendMsg(notification.messages[0].chat.chatName, 10)}
                    <span style={{ fontSize: "0.6rem", fontWeight: "bold", color: "#a3a3a3" }}>
                        {getTimeAgoString(notification.lastMsgTime)}
                    </span>
                </Text>
                <Box
                    fontSize={10}
                    fontFamily={"Arial"}
                    fontWeight={"600"}
                    onClick={handleSubMenuClick}
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                    position={"relative"}
                    w={"150px"}
                >
                    <Avatar
                        size="2xs"
                        name={notification.messages[0].sender.name}
                        src={notification.messages[0].sender.dp}
                    >
                        {/* <AvatarBadge boxSize="1.25em" bg="green.500" /> */}
                    </Avatar>
                    {notification.messages[0].isFileInput
                        ? `Sent a ${notification.messages[0].fileType}`
                        : shortendMsg(notification.messages[0].content, 20)}
                    {notification.messages.length > 1 && (
                        <>
                            {isSubMenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            {isSubMenuOpen && (
                                <Box
                                    width="170px"
                                    position={"absolute"}
                                    top={"15px"}
                                    background={"white"}
                                    borderRadius={"lg"}
                                    padding={"5px 10px"}
                                    borderWidth={"1px"}
                                    outline={"2px" + "solid" + "transparent"}
                                    outlineOffset={"2px"}
                                    zIndex={1}
                                    boxShadow={" 0 1px 2px 0 rgba(0, 0, 0, 0.05)"}
                                    maxHeight={"100px"}
                                    overflowY={"scroll"}
                                    bg={"#fbfeff"}
                                >
                                    {notification.messages.map((message, index) => (
                                        <Box
                                            key={index}
                                            display={"flex"}
                                            justifyContent={"space-between"}
                                            gap={3}
                                            paddingY={0.5}
                                        >
                                            <Text
                                                whiteSpace={"nowrap"}
                                                overflow={"hidden"}
                                                textOverflow={"ellipsis"}
                                                maxWidth={"80px"}
                                            >
                                                <Avatar
                                                    size="2xs"
                                                    name={message.sender.name}
                                                    src={message.sender.dp}
                                                    marginRight={1}
                                                >
                                                    {/* <AvatarBadge boxSize="1.25em" bg="green.500" /> */}
                                                </Avatar>
                                                {message.isFileInput
                                                    ? `Sent a ${message.fileType}`
                                                    : message.content}
                                            </Text>
                                            <Text fontWeight={300}>
                                                {getTimeAgoString(message.updatedAt)}
                                            </Text>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
