import {
    Button,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { ChatState } from "../../context/chatProvider";
import axios from "axios";
import useGlobalToast from "../../globalFunctions/toast";

export const DisplayProfilePicModal = ({ children, selectedUser }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const fileInputImgRef = useRef(null);
    const { user, setUser } = ChatState();
    const toast = useGlobalToast();

    const handleFileInput = (ref) => {
        ref.current.click();
    };

    const handleFileSelection = (e, fileType) => {
        console.log("fileType", fileType);

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("userId", selectedUser._id);
        formData.append("dp", file);
        console.log("dp", file);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios
            .put(`${BACKEND_URL}/api/user/update_dp`, formData, config)
            .then(({ data }) => {
                setUser((prevUser) => ({
                    ...prevUser,
                    user: {
                        ...prevUser.user,
                        dp: data.data.dp,
                    },
                }));
                // console.log("updatedUser", data.data);
                toast.success(data.message, "");
            })
            .catch((error) => {
                toast.error(
                    "Error",
                    error.response ? error.response.data.message : "Something Went Wrong"
                );
            })
            .finally(() => {
                onClose();
            });
    };
    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedUser.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Image src={selectedUser.dp} alt={selectedUser.name} w={"100%"} />
                    </ModalBody>

                    {user.user._id === selectedUser._id && (
                        <ModalFooter>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={() => {
                                    handleFileInput(fileInputImgRef);
                                }}
                            >
                                Update
                                <input
                                    ref={fileInputImgRef}
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={(e) => handleFileSelection(e, "img")}
                                    accept="image/*"
                                    multiple
                                />
                            </Button>
                        </ModalFooter>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};
