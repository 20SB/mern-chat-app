import React, { useEffect, useState } from "react";
import axios from "axios";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { Avatar, Box } from "@chakra-ui/react";
import { ChatState } from "./../context/chatProvider";
import { MyChats } from "../components/miscellaneous/MyChats";
import { ChatBox } from "../components/miscellaneous/ChatBox";

export const ChatPage = () => {
    const { user } = ChatState();

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>
    );
};
