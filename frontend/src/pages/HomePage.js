import React, { useEffect, useState } from "react";
import {
    Container,
    Box,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import GifPicker from "gif-picker-react";

export const HomePage = () => {
    const navigate = useNavigate();
    const [selectedGif, setSelectedGif] = useState(null);

    // Function to handle GIF selection
    const handleGifSelect = (gif) => {
        setSelectedGif(gif);
        console.log(gif);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        // console.log(user ? "user found" : "user not found");
        if (user) {
            navigate("/chats");
        }
    }, [navigate]);
    return (
        <Container maxW="xl" centerContent>
            <Box
                display="flex"
                justifyContent="center"
                bg={"white"}
                p={3}
                w={"100%"}
                m={{ base: "15px 0 15px 0", md: "40px 0 15px 0" }}
                borderRadius={"lg"}
                borderWidth={"1px"}
            >
                <Text
                    fontSize={"4xl"}
                    fontFamily={"Work sans"}
                    textAlign={"center"}
                >
                    Chit Chaat
                </Text>
            </Box>
            <Box
                bg={"white"}
                p={3}
                w={"100%"}
                m={"0 0 15px 0"}
                borderRadius={"lg"}
                borderWidth={"1px"}
            >
                <Tabs variant="soft-rounded">
                    <TabList mb={"1em"}>
                        <Tab w={"50%"}>Login</Tab>
                        <Tab w={"50%"}>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
            {/* <div>
                <div>
                    <GifPicker
                        tenorApiKey={
                            "AIzaSyAt2gt6xnnjK7O4OcCb0v24HVt2RW7MLV8"
                        }
                        onGifClick={handleGifSelect}
                    />
                    {selectedGif && (
                        <img src={selectedGif} alt="Selected GIF" />
                    )}
                    https://media.tenor.com/wfdSCMP3BVEAAAAM/excited-dog.gif
                </div>
            </div> */}
        </Container>
    );
};
