import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isLastMessageOfText,
    isSameSender,
    isSameUser,
    isSameSenderMargin,
} from "../../config/chatLogics";
import { ChatState } from "./../../context/chatProvider";
import { Avatar, Box, Image, Tooltip } from "@chakra-ui/react";
import { formatTime, getFileName } from "../../config/messageLogics";
import pdfLogo from "../../assets/images/file logo/pdf.png";
import docLogo from "../../assets/images/file logo/doc.png";
import xlsLogo from "../../assets/images/file logo/xls.png";
import xmlLogo from "../../assets/images/file logo/xml.png";
import zipLogo from "../../assets/images/file logo/zip.png";
import pptLogo from "../../assets/images/file logo/ppt.png";
import otherLogo from "../../assets/images/file logo/other.png";
import csvLogo from "../../assets/images/file logo/csv.png";
import videoLogo from "../../assets/images/file logo/video.png";
import { ImArrowDown } from "react-icons/im";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { getTimeAgoString } from "../../config/notificationLogics";

export const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const [messageCounter, setMessageCounter] = useState(0);

    const handleMouseEnter = (messageId) => {
        setHoveredMessageId(messageId);
    };

    const handleMouseLeave = () => {
        setHoveredMessageId(null);
    };

    const getExtension = (fileUrl) => {
        const segments = fileUrl.split(".");
        const extension = segments[segments.length - 1];
        return extension.toUpperCase();
    };

    const getLogo = (fileUrl) => {
        const segments = fileUrl.split(".");
        const extension = segments[segments.length - 1];
        let fileLogo;
        switch (extension) {
            case "pdf":
                fileLogo = pdfLogo;
                break;
            case "doc":
            case "docx":
                fileLogo = docLogo;
                break;
            case "ppt":
                fileLogo = pptLogo;
                break;
            case "csv":
                fileLogo = csvLogo;
                break;
            case "xls":
            case "xlsx":
                fileLogo = xlsLogo;
                break;
            case "xml":
                fileLogo = xmlLogo;
                break;
            case "zip":
                fileLogo = zipLogo;
                break;
            default:
                fileLogo = otherLogo;
        }
        return fileLogo;
    };

    // Group messages by date
    const groupedMessages = messages.reduce((acc, message) => {
        const date = new Date(message.createdAt).toLocaleDateString();
        acc[date] = acc[date] || [];
        acc[date].push(message);
        return acc;
    }, {});

    return (
        <ScrollableFeed>
            {Object.entries(groupedMessages).map(([date, messagesForDate]) => (
                <React.Fragment key={date}>
                    <div style={{ textAlign: "center", fontWeight: "bold", margin: "10px 0" }}>
                        {date}
                    </div>
                    {messagesForDate.map((m, index) => {
                        const messageIndex = messageCounter + index;
                        return (
                            <div style={{ display: "flex" }} key={m._id}>
                                {messageIndex}
                                {(isSameSender(messagesForDate, m, index, user.user._id) ||
                                    isLastMessageOfText(messagesForDate, index, user.user._id)) && (
                                    <Tooltip
                                        label={m.sender.name}
                                        placement="bottom-start"
                                        hasArrow
                                    >
                                        <Avatar
                                            mt={"7px"}
                                            m={1}
                                            cursor={"pointer"}
                                            name={m.sender.name}
                                            src={m.sender.dp}
                                            h={"2.5rem"}
                                            w={"2.5rem"}
                                        />
                                    </Tooltip>
                                )}
                                {/* Render message content based on its type */}
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}
        </ScrollableFeed>
    );
};
