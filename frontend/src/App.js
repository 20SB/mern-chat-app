import "./App.css";
import {
    Route,
    Routes,
    useLocation,
    useParams,
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import { GoogleLogin } from "./components/Authentication/Authentication/GoogleLogin";
import { ChatState } from "./context/chatProvider";
import axios from "axios";
import { useEffect } from "react";
import useGlobalToast from "./globalFunctions/toast";
import { useNavigate } from "react-router-dom";

function App() {
    // Define the backend URL using an environment variable
    // const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    // const { setUser, getGoogleUser, setGetGoogleUser } = ChatState();
    // const navigate = useNavigate();

    // // use global toast function
    // const toast = useGlobalToast();

    // const handleGetGoogleUser = async () => {
    //     axios
    //         .get(`${BACKEND_URL}/auth/login/success`, {
    //             withCredentials: true,
    //         })
    //         .then(({ data }) => {
    //             toast.success(data.message, "");
    //             console.log("data", data);
    //             setUser(data.data);
    //             localStorage.setItem(
    //                 "userInfo",
    //                 JSON.stringify(data.data)
    //             );
    //             navigate("/chats");
    //         })
    //         .catch((error) => {
    //             console.log("Error***", error);
    //             toast.error(
    //                 "Error",
    //                 error.response
    //                     ? error.response.data.message
    //                     : "Something Went Wrong"
    //             );
    //         })
    //         .finally(() => {
    //             setGetGoogleUser(false);
    //             localStorage.setItem(
    //                 "needToGetGoogleUser",
    //                 JSON.stringify(false)
    //             );
    //         });
    // };

    // useEffect(() => {
    //     const needToGetGoogleUser = localStorage.getItem(
    //         "needToGetGoogleUser"
    //     );
    //     if (!needToGetGoogleUser) {
    //         console.log("No need to get google user");
    //         setGetGoogleUser(false);
    //         localStorage.setItem("needToGetGoogleUser", false);
    //     } else {
    //         console.log("get google user", needToGetGoogleUser);
    //         setGetGoogleUser(needToGetGoogleUser);
    //         if (needToGetGoogleUser == "true") {
    //             console.log("reached here");
    //             handleGetGoogleUser();
    //         }
    //     }
    // }, []);

    const location = useLocation();
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const googleLoginData = queryParams.get("google_login_data");
        console.log("googleLoginData", googleLoginData);
        if(googleLoginData){
            const data = JSON.parse(googleLoginData);
            if(data.success)
            // process its data and move to chat page
        }else{
            // Do nothing
        }
    }, []);

    return (
        <div className="App">
            <Routes>
                {/* <Route path="/" element={<HomePage />} exact /> */}
                {/* <Route
                    path="/google_auth"
                    element={<GoogleLogin />}
                    exact
                />
                <Route path="/chats" element={<ChatPage />} /> */}
            </Routes>
        </div>
    );
}

export default App;
