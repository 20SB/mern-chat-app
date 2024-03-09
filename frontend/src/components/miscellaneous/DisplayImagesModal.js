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
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import "../../assets/css/styles.css";

export const DisplayImagesModal = ({ children, image }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [zoomLevel, setZoomLevel] = useState(1);

    const handleZoomIn = () => {
        setZoomLevel(zoomLevel * 1.2);
    };

    const handleZoomOut = () => {
        setZoomLevel(zoomLevel / 1.2);
    };

    useEffect(() => {
        if (isOpen) {
            setZoomLevel(1); // Reset zoom level when modal is opened
        }
    }, [isOpen]);

    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton bg={"white"} mt={2} mr={1} borderRadius={"lg"} zIndex={1} />
                    <ModalBody p={2}>
                        <div
                            id="modal-image-container"
                            style={{
                                overflow: "auto",
                                width: "100%",
                            }}
                        >
                            <Image
                                id="modal-image"
                                src={image}
                                alt="Image"
                                style={{
                                    borderRadius: "10px",
                                    width: "100%",
                                    transform: `scale(${zoomLevel})`,
                                }}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter position={"absolute"} gap={1} paddingLeft={4}>
                        <Button onClick={handleZoomIn} p={1}>
                            <LuZoomIn />
                        </Button>
                        <Button onClick={handleZoomOut} p={1}>
                            <LuZoomOut />
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
