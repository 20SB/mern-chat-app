export const getSender = (loggedUser, users) => {
    // console.log("users[0]._id", users[0]._id);
    // console.log("users[1]._id", users[1]._id);
    // console.log("loggeduser._id", loggedUser.user);
    return users[0]?._id === loggedUser?.user?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]?._id === loggedUser?.user?._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};

export const isLastMessageOfText = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

export const isLastMessage = (messages, i) => {
    return i === messages.length - 1;
};

export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 48;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

// export const isSameUser = (messages, m, i) => {
//     let res = i > 0 && messages[i - 1].sender._id === m.sender._id;
//     console.log("res", res);
//     return res;
// };
