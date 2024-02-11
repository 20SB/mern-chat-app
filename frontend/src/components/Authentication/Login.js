import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPass, setShowPass] = useState(false);

    const submitHandler = () => {};

    return (
        <VStack>
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

            <Button colorScheme="blue" width={"100%"} mt={"15"} onClick={submitHandler}>
                Login
            </Button>

            <Button
                colorScheme="red"
                width={"100%"}
                onClick={() => {
                    setEmail("guest@abc.com");
                    setPassword("1233345");
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
};

export default Login;
