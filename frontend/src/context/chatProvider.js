import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapToObject, objectToMap } from "../config/notificationLogics";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState(new Map());

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const unseenNotifications = JSON.parse(localStorage.getItem("unseenNotifications"));
        setUser(userInfo);
        setNotifications(objectToMap(unseenNotifications));

        if (!userInfo) {
            // console.log("go to home");
            navigate("/");
        }
    }, [navigate]);

    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
                notifications,
                setNotifications,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
