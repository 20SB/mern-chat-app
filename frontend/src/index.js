import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./context/chatProvider";
// import axios from 'axios';

// // Configure Axios defaults
// axios.defaults.baseURL = 'https://mern-chat-app-pearl.vercel.app';
// axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <ChatProvider>
            <ChakraProvider>
                <App />
            </ChakraProvider>
        </ChatProvider>
    </BrowserRouter>
);
