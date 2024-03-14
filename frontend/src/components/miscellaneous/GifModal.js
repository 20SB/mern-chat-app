import {
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import GifPicker from "gif-picker-react";

export const GifModal = ({ children, handleGifMessage }) => {
    const GIF_KEY = process.env.REACT_APP_TENOR_API_KEY;
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton
                        zIndex={"10"}
                        top={"16px"}
                        right={"15px"}
                        bg={"#F6F6F6"}
                        p={5}
                    />
                    <GifPicker
                        tenorApiKey={GIF_KEY}
                        onGifClick={(gif) => {
                            handleGifMessage(gif);
                            onClose();
                        }}
                        width={"100%"}
                    />
                    {/* <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter> */}
                </ModalContent>
            </Modal>
        </div>
    );
};
