import { useToast } from "@chakra-ui/react";

const useGlobalToast = () => {
    const toast = useToast();

    const showToast = (status, title, description, autoClose = true) => {
        toast({
            title: title,
            description: description,
            status: status,
            duration: 5000,
            isClosable: true,
            position: "top-right",
            autoClose: autoClose,
        });
    };

    return {
        success: (title, description) => showToast("success", title, description),
        error: (title, description) => showToast("error", title, description),
        warning: (title, description) => showToast("warning", title, description),
        info: (title, description) => showToast("info", title, description),
        loading: (title, description) => showToast("loading", title, description),
    };
};

export default useGlobalToast;
