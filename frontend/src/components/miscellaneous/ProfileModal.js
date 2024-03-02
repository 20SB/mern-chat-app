import { ViewIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { DisplayProfilePicModal } from "./DisplayProfilePicModal";
import { ChatState } from "../../context/chatProvider";
import { UpdateProfileModal } from "./UpdateProfileModal";

export const ProfileModal = ({ selectedUser, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = ChatState();

    // console.log("selectedUser", selectedUser);
    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <></>
                // <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}

            <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h={"400px"}>
                    <ModalHeader
                        fontSize={"40px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        {selectedUser.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDir={"column"}
                        alignItems={"center"}
                        justifyContent={"space-evenly"}
                    >
                        <DisplayProfilePicModal selectedUser={selectedUser}>
                            <Avatar
                                size="2xl"
                                name={selectedUser.name}
                                src={selectedUser.dp}
                                cursor={"pointer"}
                            />
                        </DisplayProfilePicModal>
                        <Text fontSize={{ base: "20px", md: "30px" }} fontFamily={"Work sans"}>
                            Email: {selectedUser.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        {user.user._id === selectedUser._id && (
                            <UpdateProfileModal>
                                <Button colorScheme="blue" mr={3}>
                                    Update Profile
                                </Button>
                            </UpdateProfileModal>
                        )}
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
