import React, { useEffect, useState } from "react";
import axios from "axios";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { Avatar, Box } from "@chakra-ui/react";
import { ChatState } from "./../context/chatProvider";

export const ChatPage = () => {
    const { user } = ChatState();

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            hiiii
            <Box>
                <Avatar
                    name="Segun Adebayo"
                    src="https://subha-biswal-b1.s3.ap-south-1.amazonaws.com/DP/m3.jpg"
                />
                {/* {user && <MyChats />} */}
                {/* {user && <ChatBox />} */}
            </Box>
        </div>
    );
};
