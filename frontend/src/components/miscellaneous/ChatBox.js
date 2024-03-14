import React from "react";
import { ChatState } from "./../../context/chatProvider";
import { Box } from "@chakra-ui/react";
import { SingleChat } from "./SingleChat";

export const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();
    return (
        <Box
            display={{
                base: selectedChat ? "flex" : "none",
                lg: "flex",
            }}
            alignItems={"center"}
            flexDir={"column"}
            p={{
                base: "1",
                lg: "3",
            }}
            bg={"white"}
            w={{ base: "100%", lg: "68%" }}
            borderRadius={"lg"}
            borderWidth={"1px"}
            boxSizing="border-box"
        >
            <SingleChat
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
            />
        </Box>
    );
};
