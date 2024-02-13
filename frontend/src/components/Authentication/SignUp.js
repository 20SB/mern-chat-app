import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Button,
    useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const SignUp = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const toast = useToast();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const [formData, setFormData] = useState({
        name: null,
        email: null,
        password: null,
        confirmPassword: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: files ? files : value,
        }));
    };

    useEffect(() => {
        console.log(BACKEND_URL);
        if (formData.password !== formData.confirmPassword) {
            setIsPasswordValid(true);
        } else {
            setIsPasswordValid(false);
        }
    }, [formData.confirmPassword]);

    const submitHandler = async () => {
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Password and Confirm Password do not match.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        let formDatas = new FormData();
        formDatas.append("name", formData.name);
        formDatas.append("email", formData.email);
        formDatas.append("password", formData.password);
        formDatas.append("pic", pic);

        // for (const entry of formDatas.entries()) {
        //     console.log(entry[0], entry[1]);
        // }
        // console.log(formData);
        // console.log(pic);

        try {
            const response = await fetch(`${BACKEND_URL}/api/user/signup`, {
                method: "POST",
                body: formDatas,
            });

                console.log(response);
            if (response.ok) {
                // Handle successful response
                // For example, show a success toast
                toast({
                    title: "Success",
                    description: "User signed up successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            } else {
                // Handle error response
                // For example, show an error toast
                toast({
                    title: "Error",
                    description: "Failed to sign up user.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle any network or other errors
        }
    };


    return (
        <VStack>
            <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input name="name" placeholder="Enter your Name" onChange={handleChange} />
            </FormControl>

            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    name="email"
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

            <FormControl id="pic" isRequired>
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    name="pic"
                    type={"file"}
                    p={"1.5"}
                    pb={"35px"}
                    accept="image/*"
                    onChange={(e) => setPic(e.target.files[0])}
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
    );
};

export default SignUp;
