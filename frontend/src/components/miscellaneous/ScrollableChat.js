import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameUser } from "../../config/chatLogics";
import { ChatState } from "./../../context/chatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { isSameSenderMargin } from "./../../config/chatLogics";

export const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, user.user._id) ||
                            isLastMessage(messages, i, user.user._id)) && (
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
                        <span
                            style={{
                                background: `${
                                    m.sender._id === user.user._id ? "#d9fdd3" : "#ffffff"
                                }`,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                                marginLeft: isSameSenderMargin(messages, m, i, user.user._id),
                                marginTop: 3,
                                height: "40px",
                                boxSizing: "border-box",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};
