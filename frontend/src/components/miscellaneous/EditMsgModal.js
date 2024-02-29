import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";

export const EditMsgModal = ({ message, editHandler, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [updatedMsg, setUpdatedMsg] = useState();
    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Message</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            border={"1px solid #cbd5e0"}
                            borderRadius={"md"}
                            mb={3}
                            style={{ padding: "7px 15px" }}
                        >
                            Previous Message: {message.content}
                        </Box>
                        <FormControl>
                            <Input
                                value={updatedMsg ? updatedMsg : ""}
                                placeholder="Enter Updated Message"
                                mb={3}
                                onChange={(e) => {
                                    setUpdatedMsg(e.target.value);
                                }}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => {
                                editHandler(message._id, updatedMsg);
                                onClose();
                                setUpdatedMsg("");
                            }}
                        >
                            Update
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
