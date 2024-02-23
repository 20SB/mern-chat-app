import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isLastMessageOfText,
    isSameSender,
    isSameUser,
} from "../../config/chatLogics";
import { ChatState } from "./../../context/chatProvider";
import { Avatar, Box, Image, Tooltip, position } from "@chakra-ui/react";
import { isSameSenderMargin } from "./../../config/chatLogics";
import { Player } from "video-react";
import { getFileName } from "../../config/messageLogics";
import pdfLogo from "../../assets/images/file logo/pdf.png";
import docLogo from "../../assets/images/file logo/doc.png";
import xlsLogo from "../../assets/images/file logo/xls.png";
import xmlLogo from "../../assets/images/file logo/xml.png";
import zipLogo from "../../assets/images/file logo/zip.png";
import pptLogo from "../../assets/images/file logo/ppt.png";
import otherLogo from "../../assets/images/file logo/other.png";
import csvLogo from "../../assets/images/file logo/csv.png";
import { ImArrowDown } from "react-icons/im";
import { FaChevronRight } from "react-icons/fa6";

export const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    // Suppress console logs of ScrollableFeed component
    // console.log = function () {};

    const getExtension = (fileUrl) => {
        // Split the URL by '.' to get the segments
        const segments = fileUrl.split(".");

        // Get the last segment, which should be the extension
        const extension = segments[segments.length - 1];
        return extension.toUpperCase();
    };

    const getLogo = (fileUrl) => {
        // Split the URL by '.' to get the segments
        const segments = fileUrl.split(".");

        // Get the last segment, which should be the extension
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

    return (
        <ScrollableFeed forceScroll="true">
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, user.user._id) ||
                            isLastMessageOfText(messages, i, user.user._id)) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
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

                        {m.isFileInput ? (
                            m.filesType === "img" ? (
                                <>
                                    <Image
                                        objectFit="cover"
                                        src={m.file}
                                        p={1}
                                        style={{
                                            borderRadius: "10px",
                                            maxWidth: "75%",
                                            height: "200px",
                                            boxShadow: "0px 1px 1px 0px #adadad ",
                                            marginBottom: `${
                                                isLastMessage(messages, i) ? "10px" : "2px"
                                            }`,
                                            marginTop: 3,
                                            boxSizing: "border-box",
                                            marginLeft: isSameSenderMargin(
                                                messages,
                                                m,
                                                i,
                                                user.user._id
                                            ),
                                            background: `${
                                                m.sender._id === user.user._id
                                                    ? "#d9fdd3"
                                                    : "#ffffff"
                                            }`,
                                        }}
                                    ></Image>
                                    <FaChevronRight fontSize={15} />
                                </>
                            ) : m.filesType === "vid" ? (
                                <video
                                    id="vp"
                                    preload="auto"
                                    controls
                                    src={m.file}
                                    style={{
                                        borderRadius: "10px",
                                        maxWidth: "50%",
                                        maxHeight: "350px",
                                        boxShadow: "0px 1px 1px 0px #adadad ",
                                        marginBottom: `${
                                            isLastMessage(messages, i) ? "10px" : "2px"
                                        }`,
                                        marginTop: 3,
                                        boxSizing: "border-box",
                                        marginLeft: isSameSenderMargin(
                                            messages,
                                            m,
                                            i,
                                            user.user._id
                                        ),
                                        background: `${
                                            m.sender._id === user.user._id ? "#d9fdd3" : "#ffffff"
                                        }`,
                                        padding: "4px",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        background: `${
                                            m.sender._id === user.user._id ? "#d9fdd3" : "#ffffff"
                                        }`,
                                        borderRadius: "10px",
                                        maxWidth: "50%",
                                        minHeight: "60px",
                                        marginLeft: isSameSenderMargin(
                                            messages,
                                            m,
                                            i,
                                            user.user._id
                                        ),
                                        marginTop: 3,
                                        boxSizing: "border-box",
                                        boxShadow: "0px 1px 1px 0px #adadad ",
                                        textAlign: "justify",
                                        display: "flex",
                                        flexDirection: "column",
                                        marginBottom: `${
                                            isLastMessage(messages, i) ? "10px" : "2px"
                                        }`,
                                        padding: "4px",
                                    }}
                                >
                                    <div
                                        style={{
                                            background: `${
                                                m.sender._id === user.user._id
                                                    ? "#D1F4CC"
                                                    : "#F5F6F6"
                                            }`,
                                            borderRadius: "10px",
                                            maxWidth: "100%",
                                            padding: "10px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            position: "relative",
                                        }}
                                    >
                                        <Image
                                            src={getLogo(m.file)}
                                            height={"40px"}
                                            marginRight={2}
                                        />
                                        {getLogo(m.file) === otherLogo && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    background: "#530000",
                                                    fontSize: "8px",
                                                    padding: "2px",
                                                    fontWeight: "700",
                                                    borderRadius: "4px",
                                                    color: "white",
                                                    minWidth: "32px",
                                                    textAlign: "center",
                                                    top: "26px",
                                                }}
                                            >
                                                {getExtension(m.file)}
                                            </div>
                                        )}
                                        <div
                                            style={{
                                                width: "calc(100% - 95px)",
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            {getFileName(m.file)}
                                        </div>

                                        <Box
                                            display={"flex"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                            w={8}
                                            h={8}
                                            border={"1px"}
                                            borderRadius={"50%"}
                                            cursor={"pointer"}
                                            marginLeft={"15px"}
                                        >
                                            <ImArrowDown size={15} />
                                        </Box>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div
                                style={{
                                    background: `${
                                        m.sender._id === user.user._id ? "#d9fdd3" : "#ffffff"
                                    }`,
                                    borderRadius: "10px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    marginLeft: isSameSenderMargin(messages, m, i, user.user._id),
                                    marginTop: 3,
                                    minHeight: "40px",
                                    boxSizing: "border-box",
                                    display: "flex",
                                    alignItems: "center",
                                    boxShadow: "0px 1px 1px 0px #adadad ",
                                    textAlign: "justify",
                                    marginBottom: `${isLastMessage(messages, i) ? "10px" : "2px"}`,
                                    wordBreak: "break-all",
                                }}
                            >
                                {m.content}
                            </div>
                        )}
                    </div>
                ))}
        </ScrollableFeed>
    );
};
