import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isLastMessageOfText,
    isSameSender,
    isSameUser,
} from "../../config/chatLogics";
import { ChatState } from "./../../context/chatProvider";
import { Avatar, Box, Image, Tooltip } from "@chakra-ui/react";
import { isSameSenderMargin } from "./../../config/chatLogics";
import { Player } from "video-react";
import { getFileName } from "../../config/messageLogics";
import pdfLogo from "../../assets/images/file logo/pdf.png";

export const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    // Suppress console logs of ScrollableFeed component
    console.log = function () {};

    return (
        <ScrollableFeed>
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
                                            m.sender._id === user.user._id ? "#d9fdd3" : "#ffffff"
                                        }`,
                                    }}
                                />
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
                                ></video>
                            ) : (
                                <>
                                    <div
                                        style={{
                                            background: `${
                                                m.sender._id === user.user._id
                                                    ? "#d9fdd3"
                                                    : "#ffffff"
                                            }`,
                                            borderRadius: "10px",
                                            maxWidth: "75%",
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
                                                width: "100%",
                                                height: "70px",
                                                padding: "10px",
                                                display: "flex",
                                            }}
                                        >
                                            <Image src={pdfLogo} height={"50px"} />
                                            {getFileName(m.file)}
                                        </div>
                                    </div>
                                </>
                            )
                        ) : (
                            <span
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
                                }}
                            >
                                {m.content}
                            </span>
                        )}
                    </div>
                ))}
        </ScrollableFeed>
    );
};
