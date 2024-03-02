import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import useGlobalToast from "../../globalFunctions/toast";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export const UpdateProfileModal = ({ children }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, setUser } = ChatState();

    const [loading, setLoading] = useState(false); // For managing loading state
    const [showPass, setShowPass] = useState(false); // For toggling password visibility
    const [showConfPass, setShowConfPass] = useState(false); // For toggling confirm password visibility
    const [isPasswordValid, setIsPasswordValid] = useState(false); // For checking password validity

    // use global toast function
    const toast = useGlobalToast();

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

        // set loader true
        setLoading(true);

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };

        // Make a POST request to the backend API
        axios
            .put(`${BACKEND_URL}/api/user/update`, formDatas, config)
            .then(({ data }) => {
                toast.success(data.message, "");

                setUser((prevUser) => ({
                    ...prevUser,
                    user: {
                        ...prevUser.user,
                        name: data.data.user.name,
                        email: data.data.user.email,
                    },
                }));
            })
            .catch((error) => {
                toast.error("Error", error.response.data.message);
            })
            .finally(() => {
                // Reset formData to null values
                setFormData({
                    name: null,
                    email: null,
                    password: null,
                    confirmPassword: null,
                });
                setLoading(false);
                onClose();
            });
    };

    return (
        <>
            {children ? <span onClick={onOpen}>{children}</span> : <></>}
            <Modal isOpen={isOpen} onClose={onClose} isCentered size={"lg"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Avatar
                            mt={"7px"}
                            m={1}
                            cursor={"pointer"}
                            name={user.user.name}
                            src={user.user.dp}
                            size={"lg"}
                        />

                        <Box display={"flex"} flexDir={"column"} marginLeft={2}>
                            <Text>{user.user.name}</Text>
                            <Text>{user.user.email}</Text>
                        </Box>
                    </ModalHeader>
                    <ModalCloseButton />
                    <Divider />
                    <Box
                        display={"flex"}
                        justifyContent={"center"}
                        fontWeight={"bold"}
                        fontSize={"2xl"}
                        fontFamily={"Work sans"}
                    >
                        Update Profile
                    </Box>
                    <Divider />
                    <ModalBody>
                        <FormControl id="name" isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input
                                name="name"
                                placeholder="Enter your Name"
                                onChange={handleChange}
                            />
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
                                <InputRightElement width="2.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        onClick={() => setShowPass(!showPass)}
                                        bg={"transparent"}
                                        padding={5}
                                    >
                                        {showPass ? <ViewOffIcon /> : <ViewIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        <FormControl id="confirmPassword">
                            <FormLabel>ConfirmPassword</FormLabel>
                            <InputGroup size="md">
                                <Tooltip
                                    hasArrow
                                    label="Password Not Matching"
                                    bg="gray.300"
                                    color="black"
                                    isOpen={isPasswordValid}
                                    placement="bottom-end"
                                >
                                    <Input
                                        name="confirmPassword"
                                        pr="4.5rem"
                                        type={showConfPass ? "text" : "password"}
                                        placeholder="Enter ConfirmPassword"
                                        onChange={handleChange}
                                        required
                                        focusBorderColor={isPasswordValid ? "red.300" : "#3182ce"}
                                    />
                                </Tooltip>
                                <InputRightElement width="2.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        onClick={() => setShowConfPass(!showConfPass)}
                                        bg={"transparent"}
                                        padding={5}
                                    >
                                        {showConfPass ? <ViewOffIcon /> : <ViewIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={submitHandler}
                            isLoading={loading}
                        >
                            Update
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
