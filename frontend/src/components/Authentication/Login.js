import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import useGlobalToast from "../../globalFunctions/toast";
import { useHistory } from "react-router-dom";

const Login = () => {
    // Define the backend URL using an environment variable
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // use global toast function
    const toast = useGlobalToast();

    // State variables
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const history = useHistory();
    // const { setUser } = ChatState();

    // Form data state
    const [formData, setFormData] = useState({
        email: null,
        password: null,
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: files ? files : value,
        }));
    };

    // Form submission handler
    const submitHandler = async () => {
        // check if all fields are filled or not
        if (!formData.email || !formData.password) {
            toast.warning("Warning", "Please Fill all the Fileds");
            return;
        }

        // set loader true
        setLoading(true);

        // Make a POST request to the backend API
        axios
            .post(`${BACKEND_URL}/api/user/login`, formData)
            .then((res) => {
                console.log("res.data", res.data);
                toast.success(res.data.message, "");

                // setUser(data);
                localStorage.setItem("userInfo", JSON.stringify(res.data.data));
                history.push("/chats");
            })
            .catch((error) => {
                toast.error("Error", error.response.data.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Function to set guest credentials and call submitHandler
    const handleGetGuestCredentials = () => {
        // Set guest credentials
        setFormData((prevFormData) => ({
            ...prevFormData,
            email: "guest@abc.com",
            password: "abc",
        }));
    };

    return (
        <VStack>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    name="email"
                    value={formData.email ? formData.email : ""}
                    type={"email"}
                    placeholder="Enter Email"
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        name="password"
                        value={formData.password ? formData.password : ""}
                        pr="4.5rem"
                        type={showPass ? "text" : "password"}
                        placeholder="Enter password"
                        onChange={handleChange}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShowPass(!showPass)}>
                            {showPass ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme="blue"
                width={"100%"}
                mt={"15"}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>

            <Button
                colorScheme="red"
                width={"100%"}
                onClick={handleGetGuestCredentials}
                isLoading={loading}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
};

export default Login;
