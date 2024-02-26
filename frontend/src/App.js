import "./App.css";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import CameraComponent from "./components/miscellaneous/CameraComponent";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomePage />} exact />
                <Route path="/chats" element={<ChatPage />} />
                <Route path="/camera" element={<CameraComponent />} />
            </Routes>
        </div>
    );
}

export default App;
