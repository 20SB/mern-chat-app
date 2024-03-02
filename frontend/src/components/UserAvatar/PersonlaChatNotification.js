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
import { fileMsg, getTimeAgoString, shortendMsg } from "../../config/notificationLogics";
import NotificationBadge from "react-notification-badge";

export const PersonlaChatNotification = ({ notification, sender }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const handleSubMenuClick = (e) => {
        if (notification.messages.length > 1) {
            e.preventDefault();
            e.stopPropagation();
            setIsSubMenuOpen(!isSubMenuOpen);
        }
    };

    return (
        <Box display={"flex"} alignItems={"center"}>
            <div style={{ position: "relative" }}>
                <Avatar size="sm" name={sender.name} src={sender.dp}>
                    {/* <AvatarBadge boxSize="1.25em" bg="green.500" /> */}
                </Avatar>
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
            <Box display={"flex"} flexDir={"column"} ml={2} maxW={"2xs"}>
                <Text display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    {shortendMsg(sender.name, 10)}
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
                    {notification.messages[0].isFileInput
                        ? fileMsg(notification.messages[0].fileType)
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
                                                {message.isFileInput
                                                    ? fileMsg(notification.messages[0].fileType)
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
