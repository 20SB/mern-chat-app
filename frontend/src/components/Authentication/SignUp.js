import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Button,
} from "@chakra-ui/react";
import React, { useState } from "react";

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [showPass, setShowPass] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);

    const postDetails = (pics) => {};
    const submitHandler = () => {};

    return (
        <VStack>
            <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter your Name" onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type={"email"}
                    placeholder="Enter Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        pr="4.5rem"
                        type={showPass ? "text" : "password"}
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
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
                        pr="4.5rem"
                        type={showConfPass ? "text" : "password"}
                        placeholder="Enter ConfirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    type={"file"}
                    p={"1.5"}
                    pb={"35px"}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button colorScheme="blue" width={"100%"} mt={"15"} onClick={submitHandler}>
                Sign Up
            </Button>
        </VStack>
    );
};

export default SignUp;
