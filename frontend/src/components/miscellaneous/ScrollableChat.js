import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isLastMessageOfText,
    isSameSender,
} from "../../config/chatLogics";
import { ChatState } from "./../../context/chatProvider";
import {
    Avatar,
    Box,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Tooltip,
} from "@chakra-ui/react";
import { isSameSenderMargin } from "./../../config/chatLogics";
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
import { FaChevronDown } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { EditMsgModal } from "./EditMsgModal";
import { DisplayImagesModal } from "./DisplayImagesModal";
import { VideoPlayerModal } from "./VideoPlayerModal";

export const ScrollableChat = ({
    messages,
    deleteHandler,
    editHandler,
}) => {
    const { user } = ChatState();

    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    let messageCounter = -1;

    const openDocument = (documentUrl) => {
        window.open(documentUrl, "_blank"); // Open document in a new tab
    };

    const handleMouseEnter = (messageId) => {
        setHoveredMessageId(messageId);
    };

    const handleMouseLeave = () => {
        setHoveredMessageId(null);
    };

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

    // Get today's date
    const today = new Date().toLocaleDateString();

    // Get yesterday's date
    const yesterday = (() => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toLocaleDateString();
    })();

    // Function to determine date display
    const getDateDisplay = (date) => {
        if (date === today) {
            return "TODAY";
        } else if (date === yesterday) {
            return "YESTERDAY";
        } else {
            return date;
        }
    };

    // Group messages by date
    const groupedMessages = messages.reduce((acc, message) => {
        const date = new Date(message.createdAt).toLocaleDateString();
        acc[date] = acc[date] || [];
        acc[date].push(message);
        return acc;
    }, {});
    return (
        <ScrollableFeed forceScroll={true}>
            {Object.entries(groupedMessages).map(
                ([date, messagesForDate]) => (
                    <React.Fragment key={date}>
                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                        >
                            <Box
                                padding={"5px 12px 6px"}
                                textAlign={"center"}
                                textShadow={
                                    "0 1px 0 rgb(255,255,255),.4"
                                }
                                backgroundColor={
                                    "hsla(0,0%,100%,0.95)"
                                }
                                borderRadius={"lg"}
                                boxShadow={
                                    "0 1px 0.5px rgba(11,20,26),.13"
                                }
                                boxSizing="border-box"
                                fontSize={"12.5px"}
                                lineHeight={"21px"}
                                color={"#54656f"}
                                margin={"8px 0"}
                            >
                                {getDateDisplay(date)}
                            </Box>
                        </Box>

                        {messagesForDate.map((m, index) => {
                            messageCounter++;
                            return (
                                <div
                                    style={{ display: "flex" }}
                                    key={m._id}
                                    position={"relative"}
                                >
                                    {(isSameSender(
                                        messages,
                                        m,
                                        messageCounter,
                                        user.user._id
                                    ) ||
                                        isLastMessageOfText(
                                            messages,
                                            messageCounter,
                                            user.user._id
                                        )) && (
                                        <Tooltip
                                            label={m.sender.name}
                                            placement="bottom-start"
                                            hasArrow
                                        >
                                            <Avatar
                                                mt={"7px"}
                                                m={1}
                                                name={m.sender.name}
                                                src={m.sender.dp}
                                                h={"2.5rem"}
                                                w={"2.5rem"}
                                            />
                                        </Tooltip>
                                    )}

                                    {m.isFileInput ? (
                                        m.fileType === "img" ? (
                                            <Box
                                                onMouseEnter={() =>
                                                    handleMouseEnter(
                                                        m._id
                                                    )
                                                }
                                                onMouseLeave={
                                                    handleMouseLeave
                                                }
                                                style={{
                                                    borderRadius:
                                                        "10px",
                                                    maxWidth: "75%",
                                                    boxShadow:
                                                        "0px 1px 1px 0px #adadad ",
                                                    marginBottom: `${
                                                        isLastMessage(
                                                            messages,
                                                            messageCounter
                                                        )
                                                            ? "10px"
                                                            : "2px"
                                                    }`,
                                                    marginTop: 3,
                                                    boxSizing:
                                                        "border-box",
                                                    marginLeft:
                                                        isSameSenderMargin(
                                                            messages,
                                                            m,
                                                            messageCounter,
                                                            user.user
                                                                ._id
                                                        ),
                                                    background: `${
                                                        m.sender
                                                            ._id ===
                                                        user.user._id
                                                            ? "#d9fdd3"
                                                            : "#ffffff"
                                                    }`,
                                                    position:
                                                        "relative",
                                                }}
                                            >
                                                <DisplayImagesModal
                                                    image={m.file}
                                                >
                                                    <Image
                                                        objectFit="cover"
                                                        src={m.file}
                                                        p={1}
                                                        style={{
                                                            borderRadius:
                                                                "10px",
                                                            width: "100%",
                                                            maxHeight:
                                                                "200px",
                                                            boxSizing:
                                                                "border-box",
                                                            cursor: "pointer",
                                                        }}
                                                    ></Image>
                                                </DisplayImagesModal>
                                                {m.sender._id ===
                                                    user.user._id && (
                                                    <Menu>
                                                        <div
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                right: "4px",
                                                                top: "4px",
                                                                width: "100px",
                                                                height: "40px",
                                                                padding:
                                                                    "0px 6px 0px 0px",
                                                                borderRadius:
                                                                    "0px 6px 0px 0px",
                                                                display:
                                                                    "flex",
                                                                flexDirection:
                                                                    "row-reverse",
                                                                background:
                                                                    "linear-gradient(200deg, white,white, rgb(0 0 0 / 0%),rgb(0 0 0 / 0%), transparent)",
                                                                opacity:
                                                                    hoveredMessageId ===
                                                                    m._id
                                                                        ? 1
                                                                        : 0,
                                                                transition:
                                                                    "opacity 0.3s ease",
                                                            }}
                                                        >
                                                            <MenuButton
                                                                mt={
                                                                    "-15px"
                                                                }
                                                            >
                                                                <FaChevronDown
                                                                    fontSize={
                                                                        15
                                                                    }
                                                                    cursor={
                                                                        "pointer"
                                                                    }
                                                                    style={{
                                                                        right: "8px",
                                                                        top: "3px",
                                                                    }}
                                                                />
                                                            </MenuButton>
                                                        </div>
                                                        <MenuList
                                                            minWidth={
                                                                "150px"
                                                            }
                                                            mt={
                                                                "-25px"
                                                            }
                                                            mb={
                                                                "-20px"
                                                            }
                                                            boxShadow={
                                                                "0 2px 5px 0 #737373"
                                                            }
                                                        >
                                                            <MenuItem
                                                                onClick={() =>
                                                                    deleteHandler(
                                                                        m._id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                )}
                                            </Box>
                                        ) : m.fileType === "vid" ? (
                                            <Box
                                                onMouseEnter={() =>
                                                    handleMouseEnter(
                                                        m._id
                                                    )
                                                }
                                                onMouseLeave={
                                                    handleMouseLeave
                                                }
                                                maxWidth={{
                                                    base: "85%",
                                                    lg: "75%",
                                                }}
                                                style={{
                                                    background: `${
                                                        m.sender
                                                            ._id ===
                                                        user.user._id
                                                            ? "#d9fdd3"
                                                            : "#ffffff"
                                                    }`,
                                                    borderRadius:
                                                        "10px",
                                                    minHeight: "60px",
                                                    marginLeft:
                                                        isSameSenderMargin(
                                                            messages,
                                                            m,
                                                            messageCounter,
                                                            user.user
                                                                ._id
                                                        ),
                                                    marginTop: 3,
                                                    boxSizing:
                                                        "border-box",
                                                    boxShadow:
                                                        "0px 1px 1px 0px #adadad ",
                                                    textAlign:
                                                        "justify",
                                                    display: "flex",
                                                    flexDirection:
                                                        "column",
                                                    marginBottom: `${
                                                        isLastMessage(
                                                            messages,
                                                            messageCounter
                                                        )
                                                            ? "10px"
                                                            : "2px"
                                                    }`,
                                                    padding: "4px",
                                                    position:
                                                        "relative",
                                                }}
                                            >
                                                <VideoPlayerModal
                                                    video={m.file}
                                                >
                                                    <div
                                                        style={{
                                                            background: `${
                                                                m
                                                                    .sender
                                                                    ._id ===
                                                                user
                                                                    .user
                                                                    ._id
                                                                    ? "#D1F4CC"
                                                                    : "#F5F6F6"
                                                            }`,
                                                            borderRadius:
                                                                "10px",
                                                            maxWidth:
                                                                "100%",
                                                            display:
                                                                "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "flex-start",
                                                            position:
                                                                "relative",
                                                            padding:
                                                                "10px 25px 15px 10px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <Image
                                                            src={
                                                                videoLogo
                                                            }
                                                            height={
                                                                "40px"
                                                            }
                                                            marginRight={
                                                                2
                                                            }
                                                        />
                                                        <div
                                                            style={{
                                                                width: "calc(100% - 95px)",
                                                                wordWrap:
                                                                    "break-word",
                                                                fontSize:
                                                                    {
                                                                        base: "12.5px",
                                                                        lg: "inherit",
                                                                    },
                                                            }}
                                                        >
                                                            {getFileName(
                                                                m.file
                                                            )}
                                                        </div>

                                                        <Box
                                                            display={
                                                                "flex"
                                                            }
                                                            justifyContent={
                                                                "center"
                                                            }
                                                            alignItems={
                                                                "center"
                                                            }
                                                            w={8}
                                                            h={8}
                                                            border={
                                                                "1px"
                                                            }
                                                            borderRadius={
                                                                "50%"
                                                            }
                                                            cursor={
                                                                "pointer"
                                                            }
                                                            marginLeft={
                                                                "15px"
                                                            }
                                                            zIndex={1}
                                                        >
                                                            <FaPlay
                                                                size={
                                                                    15
                                                                }
                                                                style={{
                                                                    paddingLeft:
                                                                        "2px",
                                                                }}
                                                            />
                                                        </Box>
                                                    </div>
                                                </VideoPlayerModal>

                                                <Box
                                                    style={{
                                                        position:
                                                            "absolute",
                                                        right: "10px",
                                                        bottom: "5px",
                                                        fontSize:
                                                            "0.7rem",
                                                    }}
                                                >
                                                    {formatTime(
                                                        m.updatedAt
                                                    )}
                                                </Box>
                                                {m.sender._id ===
                                                    user.user._id && (
                                                    <Menu>
                                                        <div
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                right: "4px",
                                                                width: "100px",
                                                                height: "40px",
                                                                padding:
                                                                    "0px 6px 0px 0px",
                                                                borderRadius:
                                                                    "0px 6px 0px 0px",
                                                                display:
                                                                    "flex",
                                                                flexDirection:
                                                                    "row-reverse",
                                                                opacity:
                                                                    hoveredMessageId ===
                                                                    m._id
                                                                        ? 1
                                                                        : 0,
                                                                transition:
                                                                    "opacity 0.3s ease",
                                                            }}
                                                        >
                                                            <MenuButton
                                                                mt={
                                                                    "-15px"
                                                                }
                                                            >
                                                                <FaChevronDown
                                                                    fontSize={
                                                                        15
                                                                    }
                                                                    cursor={
                                                                        "pointer"
                                                                    }
                                                                    style={{
                                                                        right: "8px",
                                                                        top: "3px",
                                                                    }}
                                                                />
                                                            </MenuButton>
                                                        </div>
                                                        <MenuList
                                                            minWidth={
                                                                "150px"
                                                            }
                                                            mt={
                                                                "-25px"
                                                            }
                                                            mb={
                                                                "-20px"
                                                            }
                                                            boxShadow={
                                                                "0 2px 5px 0 #737373"
                                                            }
                                                        >
                                                            <MenuItem
                                                                onClick={() =>
                                                                    deleteHandler(
                                                                        m._id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                )}
                                            </Box>
                                        ) : (
                                            <Box
                                                onMouseEnter={() =>
                                                    handleMouseEnter(
                                                        m._id
                                                    )
                                                }
                                                onMouseLeave={
                                                    handleMouseLeave
                                                }
                                                maxWidth={{
                                                    base: "85%",
                                                    lg: "75%",
                                                }}
                                                style={{
                                                    background: `${
                                                        m.sender
                                                            ._id ===
                                                        user.user._id
                                                            ? "#d9fdd3"
                                                            : "#ffffff"
                                                    }`,
                                                    borderRadius:
                                                        "10px",
                                                    minHeight: "60px",
                                                    marginLeft:
                                                        isSameSenderMargin(
                                                            messages,
                                                            m,
                                                            messageCounter,
                                                            user.user
                                                                ._id
                                                        ),
                                                    marginTop: 3,
                                                    boxSizing:
                                                        "border-box",
                                                    boxShadow:
                                                        "0px 1px 1px 0px #adadad ",
                                                    textAlign:
                                                        "justify",
                                                    display: "flex",
                                                    flexDirection:
                                                        "column",
                                                    marginBottom: `${
                                                        isLastMessage(
                                                            messages,
                                                            messageCounter
                                                        )
                                                            ? "10px"
                                                            : "2px"
                                                    }`,
                                                    padding: "4px",
                                                    position:
                                                        "relative",
                                                }}
                                            >
                                                <div
                                                    onClick={() =>
                                                        openDocument(
                                                            m.file
                                                        )
                                                    }
                                                    style={{
                                                        background: `${
                                                            m.sender
                                                                ._id ===
                                                            user.user
                                                                ._id
                                                                ? "#D1F4CC"
                                                                : "#F5F6F6"
                                                        }`,
                                                        borderRadius:
                                                            "10px",
                                                        maxWidth:
                                                            "100%",
                                                        padding:
                                                            "10px 25px 15px 10px",
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "flex-start",
                                                        position:
                                                            "relative",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <Image
                                                        src={getLogo(
                                                            m.file
                                                        )}
                                                        height={
                                                            "40px"
                                                        }
                                                        marginRight={
                                                            2
                                                        }
                                                    />
                                                    {getLogo(
                                                        m.file
                                                    ) ===
                                                        otherLogo && (
                                                        <div
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                background:
                                                                    "#530000",
                                                                fontSize:
                                                                    "8px",
                                                                padding:
                                                                    "2px",
                                                                fontWeight:
                                                                    "700",
                                                                borderRadius:
                                                                    "4px",
                                                                color: "white",
                                                                minWidth:
                                                                    "32px",
                                                                textAlign:
                                                                    "center",
                                                                top: "26px",
                                                            }}
                                                        >
                                                            {getExtension(
                                                                m.file
                                                            )}
                                                        </div>
                                                    )}
                                                    <div
                                                        style={{
                                                            width: "calc(100% - 95px)",
                                                            wordWrap:
                                                                "break-word",
                                                            fontSize:
                                                                {
                                                                    base: "12.5px",
                                                                    lg: "inherit",
                                                                },
                                                        }}
                                                    >
                                                        {getFileName(
                                                            m.file
                                                        )}
                                                    </div>

                                                    <Box
                                                        display={
                                                            "flex"
                                                        }
                                                        justifyContent={
                                                            "center"
                                                        }
                                                        alignItems={
                                                            "center"
                                                        }
                                                        w={8}
                                                        h={8}
                                                        border={"1px"}
                                                        borderRadius={
                                                            "50%"
                                                        }
                                                        cursor={
                                                            "pointer"
                                                        }
                                                        marginLeft={
                                                            "15px"
                                                        }
                                                        zIndex={1}
                                                    >
                                                        <ImArrowDown
                                                            size={15}
                                                        />
                                                    </Box>
                                                </div>
                                                <Box
                                                    style={{
                                                        position:
                                                            "absolute",
                                                        right: "10px",
                                                        bottom: "5px",
                                                        fontSize:
                                                            "0.7rem",
                                                    }}
                                                >
                                                    {formatTime(
                                                        m.updatedAt
                                                    )}
                                                </Box>
                                                {m.sender._id ===
                                                    user.user._id && (
                                                    <Menu>
                                                        <div
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                right: "4px",
                                                                width: "100px",
                                                                height: "40px",
                                                                padding:
                                                                    "0px 6px 0px 0px",
                                                                borderRadius:
                                                                    "0px 6px 0px 0px",
                                                                display:
                                                                    "flex",
                                                                flexDirection:
                                                                    "row-reverse",
                                                                opacity:
                                                                    hoveredMessageId ===
                                                                    m._id
                                                                        ? 1
                                                                        : 0,
                                                                transition:
                                                                    "opacity 0.3s ease",
                                                            }}
                                                        >
                                                            <MenuButton
                                                                mt={
                                                                    "-15px"
                                                                }
                                                            >
                                                                <FaChevronDown
                                                                    fontSize={
                                                                        15
                                                                    }
                                                                    cursor={
                                                                        "pointer"
                                                                    }
                                                                    style={{
                                                                        right: "8px",
                                                                        top: "3px",
                                                                    }}
                                                                />
                                                            </MenuButton>
                                                        </div>
                                                        <MenuList
                                                            minWidth={
                                                                "150px"
                                                            }
                                                            mt={
                                                                "-25px"
                                                            }
                                                            mb={
                                                                "-20px"
                                                            }
                                                            boxShadow={
                                                                "0 2px 5px 0 #737373"
                                                            }
                                                        >
                                                            <MenuItem
                                                                onClick={() =>
                                                                    deleteHandler(
                                                                        m._id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                )}
                                            </Box>
                                        )
                                    ) : (
                                        <div
                                            onMouseEnter={() =>
                                                handleMouseEnter(
                                                    m._id
                                                )
                                            }
                                            onMouseLeave={
                                                handleMouseLeave
                                            }
                                            style={{
                                                background: `${
                                                    m.sender._id ===
                                                    user.user._id
                                                        ? "#d9fdd3"
                                                        : "#ffffff"
                                                }`,
                                                borderRadius: "10px",
                                                padding: "5px 15px",
                                                maxWidth: "75%",
                                                marginLeft:
                                                    isSameSenderMargin(
                                                        messages,
                                                        m,
                                                        messageCounter,
                                                        user.user._id
                                                    ),
                                                marginTop: 3,
                                                minHeight: "40px",
                                                boxSizing:
                                                    "border-box",
                                                display: "flex",
                                                alignItems: "center",
                                                boxShadow:
                                                    "0px 1px 1px 0px #adadad ",
                                                textAlign: "justify",
                                                marginBottom: `${
                                                    isLastMessage(
                                                        messages,
                                                        messageCounter
                                                    )
                                                        ? "10px"
                                                        : "2px"
                                                }`,
                                                wordBreak:
                                                    "break-all",
                                                position: "relative",
                                                paddingRight: "65px",
                                            }}
                                        >
                                            {m.content}
                                            {m.sender._id ===
                                                user.user._id && (
                                                <Menu>
                                                    <div
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            right: "4px",
                                                            width: "100px",
                                                            height: "40px",
                                                            padding:
                                                                "0px 6px 0px 0px",
                                                            borderRadius:
                                                                "0px 6px 0px 0px",
                                                            display:
                                                                "flex",
                                                            flexDirection:
                                                                "row-reverse",
                                                            opacity:
                                                                hoveredMessageId ===
                                                                m._id
                                                                    ? 1
                                                                    : 0,
                                                            transition:
                                                                "opacity 0.3s ease",
                                                        }}
                                                    >
                                                        <MenuButton
                                                            mt={
                                                                "-15px"
                                                            }
                                                        >
                                                            <FaChevronDown
                                                                fontSize={
                                                                    15
                                                                }
                                                                cursor={
                                                                    "pointer"
                                                                }
                                                                style={{
                                                                    right: "8px",
                                                                    top: "2px",
                                                                }}
                                                            />
                                                        </MenuButton>
                                                    </div>
                                                    <MenuList
                                                        minWidth={
                                                            "150px"
                                                        }
                                                        mt={"-25px"}
                                                        mb={"-20px"}
                                                        boxShadow={
                                                            "0 2px 5px 0 #737373"
                                                        }
                                                    >
                                                        <EditMsgModal
                                                            message={
                                                                m
                                                            }
                                                            editHandler={
                                                                editHandler
                                                            }
                                                        >
                                                            <MenuItem>
                                                                Edit
                                                            </MenuItem>
                                                        </EditMsgModal>

                                                        <MenuItem
                                                            onClick={() =>
                                                                deleteHandler(
                                                                    m._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            )}

                                            <Box
                                                style={{
                                                    position:
                                                        "absolute",
                                                    right: "10px",
                                                    bottom: "5px",
                                                    fontSize:
                                                        "0.7rem",
                                                }}
                                            >
                                                {formatTime(
                                                    m.updatedAt
                                                )}
                                            </Box>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                )
            )}
        </ScrollableFeed>
    );
};
