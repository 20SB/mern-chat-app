import React, { useEffect, useState } from "react";
import axios from "axios";

export const ChatPage = () => {
    const [chats, setchats] = useState([])
    const fetchChats = async () => {
        const {data} = await axios.get(
            "https://ems-dev.stepsoflearningprocess.com:5002/users/get_all_user"
        );

        setchats(data.users);
    };

    useEffect(()=>{
        fetchChats();
    }, []);


    return <div>{
        chats.map((chat) => (
            <div key={chat._id}>{chat.email}</div>
        ))
        }</div>;
};
