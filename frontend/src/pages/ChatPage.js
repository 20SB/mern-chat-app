import React, { useEffect, useState } from "react";
import axios from "axios";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { Box } from "@chakra-ui/react";
import { ChatState } from "./../context/chatProvider";

export const ChatPage = () => {
    const { user } = ChatState();

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box>
                {/* {user && <MyChats />} */}
                {/* {user && <ChatBox />} */}
            </Box>
        </div>
    );
};
