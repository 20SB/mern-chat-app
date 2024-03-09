import React, { useState, useEffect } from "react";
import {
    Button,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import "../../assets/css/styles.css";

export const VideoPlayerModal = ({ children, video }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton bg={"white"} mt={2} mr={1} borderRadius={"lg"} zIndex={1} />
                    <ModalBody p={2}>
                        <div
                            style={{
                                overflow: "auto",
                                width: "100%",
                            }}
                        >
                            <video
                                preload="auto"
                                controls
                                src={video}
                                style={{
                                    borderRadius: "10px",
                                    width: "100%",
                                }}
                            ></video>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};
