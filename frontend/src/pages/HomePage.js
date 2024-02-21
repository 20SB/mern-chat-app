import React, { useEffect } from "react";
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";

export const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        console.log(user ? "user found" : "user not found");
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
                m={"40px 0 15px 0"}
                borderRadius={"lg"}
                borderWidth={"1px"}
            >
                <Text fontSize={"4xl"} fontFamily={"Work sans"} textAlign={"center"}>
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
        </Container>
    );
};
