import React, { useEffect, useState } from "react";
import axios from "axios";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { Avatar, Box } from "@chakra-ui/react";
import { ChatState } from "./../context/chatProvider";
import { MyChats } from "../components/miscellaneous/MyChats";
import { ChatBox } from "../components/miscellaneous/ChatBox";

export const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                h={`calc(100vh - 60px)`}
                p={{
                    base: "1",
                    md: "10px",
                }}
                boxSizing="border-box"
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <ChatBox
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                    />
                )}
            </Box>
        </div>
    );
};
