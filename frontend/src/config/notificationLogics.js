import { Box, Text } from "@chakra-ui/react";
import { FaFileVideo, FaVideo } from "react-icons/fa6";
import { IoIosDocument, IoMdCamera } from "react-icons/io";

// Helper function to convert Map to plain object
export const mapToObject = (map) => {
    const obj = {};
    map.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
};

// Helper function to convert plain object to Map
export const objectToMap = (obj) => {
    const map = new Map();
    for (let key in obj) {
        map.set(key, obj[key]);
    }
    return map;
};

export const getTimeAgoString = (time) => {
    const currentTime = new Date();
    const messageTime = new Date(time);
    const timeDiffInSeconds = Math.floor((currentTime - messageTime) / 1000);

    if (timeDiffInSeconds < 60) {
        return `${timeDiffInSeconds} secs ago`;
    } else if (timeDiffInSeconds < 3600) {
        const minutes = Math.floor(timeDiffInSeconds / 60);
        return `${minutes} mins ago`;
    } else if (timeDiffInSeconds < 86400) {
        const hours = Math.floor(timeDiffInSeconds / 3600);
        return `${hours} hrs ago`;
    } else {
        const days = Math.floor(timeDiffInSeconds / 86400);
        return `${days} days ago`;
    }
};

export const shortendMsg = (text, limit) => {
    const shortenedText = text.length > limit ? text.substring(0, limit) + "..." : text;
    return shortenedText;
};

export const fileMsg = (fileType) => {
    if (fileType === "doc") {
        return (
            <Text display={"flex"} alignItems={"center"} gap={1}>
                <IoIosDocument /> Document
            </Text>
        );
    } else if (fileType === "img") {
        return (
            <Text display={"flex"} alignItems={"center"} gap={1}>
                <IoMdCamera /> Photo
            </Text>
        );
    } else {
        return (
            <Text display={"flex"} alignItems={"center"} gap={1}>
                <FaVideo /> Video
            </Text>
        );
    }
};
