import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import { ChatState } from "./context/chatProvider";
import { useEffect } from "react";
import useGlobalToast from "./globalFunctions/toast";
import { useNavigate } from "react-router-dom";

function App() {
    const { setUser } = ChatState();
    const navigate = useNavigate();

    // use global toast function
    const toast = useGlobalToast();

    const location = useLocation();
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const googleLoginData = queryParams.get("google_login_data");

        if (googleLoginData) {
            console.log("found Google Login Data");
            const data = JSON.parse(googleLoginData);
            if (data.success) {
                toast.success(data.message, "");
                console.log("data", data);
                setUser(data.data);
                localStorage.setItem(
                    "userInfo",
                    JSON.stringify(data.data)
                );
                navigate("/chats");
            } else {
                const data = JSON.parse(googleLoginData);
                toast.error("Error", data.message);
            }
        }
    }, []);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomePage />} exact />
                <Route path="/chats" element={<ChatPage />} />
            </Routes>
        </div>
    );
}

export default App;
