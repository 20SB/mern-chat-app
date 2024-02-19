import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/chatProvider";

export const UserBadgeItem = ({ user, handleFunction }) => {
    const { user: loggedUser, selectedChat } = ChatState();
    console.log("current user", loggedUser.user._id);
    console.log("user", user._id);
    console.log("selectedChat", selectedChat);

    return (
        <Box
            key={user._id}
            px={2}
            py={2}
            borderRadius={"lg"}
            m={1}
            mb={2}
            variant="solid"
            fontSize={15}
            bg="purple"
            color={"white"}
            userSelect={"none"}
            display={"flex"}
            alignItems={"center"}
        >
            <Avatar size="xs" name={user.name} src={user.dp} mr={2} fontSize={"2xl"} />
            {user.name}
            {selectedChat ? (
                <>
                    {selectedChat.groupAdmin._id == loggedUser.user._id &&
                        selectedChat.groupAdmin._id != user._id && (
                            <CloseIcon ml={2} pl={1} onClick={handleFunction} cursor={"pointer"} />
                        )}
                    {selectedChat.groupAdmin._id == user._id && <Text pl={1}>(Admin)</Text>}
                </>
            ) : (
                <>
                    <CloseIcon ml={2} pl={1} onClick={handleFunction} cursor={"pointer"} />
                </>
            )}
        </Box>
    );
};
