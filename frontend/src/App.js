import "./App.css";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" component={HomePage} exact />
                <Route path="/chats" component={ChatPage} />
            </Routes>
        </div>
    );
}

export default App;
