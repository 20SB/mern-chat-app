import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useGlobalToast from "../../globalFunctions/toast";

const SignUp = () => {
    // Define the backend URL using an environment variable
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // use global toast function
    const toast = useGlobalToast();

    // State variables
    const [dp, setDp] = useState(); // For storing the user's profile picture
    const [loading, setLoading] = useState(false); // For managing loading state
    const [showPass, setShowPass] = useState(false); // For toggling password visibility
    const [showConfPass, setShowConfPass] = useState(false); // For toggling confirm password visibility
    const [isPasswordValid, setIsPasswordValid] = useState(false); // For checking password validity
    const navigate = useNavigate();
    // const { setUser } = ChatState();

    // Form data state
    const [formData, setFormData] = useState({
        name: null,
        email: null,
        password: null,
        confirmPassword: null,
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: files ? files : value,
        }));
    };

    // Check if passwords match when confirmPassword changes
    useEffect(() => {
        if (formData.password !== formData.confirmPassword) {
            setIsPasswordValid(true);
        } else {
            setIsPasswordValid(false);
        }
    }, [formData.confirmPassword]);

    // Form submission handler
    const submitHandler = async () => {
        // check if all fields are filled or not
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.warning("Please Fill all the Fileds");
            return;
        }

        // Check if passwords match before submitting
        if (formData.password !== formData.confirmPassword) {
            toast.warning("Warning", "Please Fill all the Fileds");
            return;
        }

        // Create form data to send to the backend
        let formDatas = new FormData();
        formDatas.append("name", formData.name);
        formDatas.append("email", formData.email);
        formDatas.append("password", formData.password);
        formDatas.append("dp", dp);

        // set loader true
        setLoading(true);
        // Make a POST request to the backend API
        axios
            .post(`${BACKEND_URL}/api/user/signup`, formDatas)
            .then((res) => {
                console.log("res.data", res.data);
                toast.success(res.data.message, "");

                // setUser(data);
                localStorage.setItem("userInfo", JSON.stringify(res.data.data));
                navigate("/chats");
            })
            .catch((error) => {
                toast.error("Error", error.response.data.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Render the signup form
    return (
        <>
            <VStack>
                <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input name="name" placeholder="Enter your Name" onChange={handleChange} />
                </FormControl>

                <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                        <Input
                            name="password"
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

                <FormControl id="confirmPassword">
                    <FormLabel>ConfirmPassword</FormLabel>
                    <InputGroup size="md">
                        <Input
                            name="confirmPassword"
                            pr="4.5rem"
                            type={showConfPass ? "text" : "password"}
                            placeholder="Enter ConfirmPassword"
                            onChange={handleChange}
                            required
                            focusBorderColor={isPasswordValid ? "red.300" : "#3182ce"}
                        />
                        <InputRightElement width="4.5rem">
                            <Button
                                h="1.75rem"
                                size="sm"
                                onClick={() => setShowConfPass(!showConfPass)}
                            >
                                {showConfPass ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl id="dp" isRequired>
                    <FormLabel>Upload your Picture</FormLabel>
                    <Input
                        name="dp"
                        type={"file"}
                        p={"1.5"}
                        pb={"35px"}
                        accept="image/*"
                        onChange={(e) => setDp(e.target.files[0])}
                    />
                </FormControl>

                <Button
                    colorScheme="blue"
                    width={"100%"}
                    mt={"15"}
                    onClick={submitHandler}
                    isLoading={loading}
                >
                    Sign Up
                </Button>
            </VStack>
        </>
    );
};

export default SignUp;
