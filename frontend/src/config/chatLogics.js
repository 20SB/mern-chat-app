export const getSender = (loggedUser, users) => {
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

export const formatDateForChats = (timestamp) => {
    const currentDate = new Date();
    const inputDate = new Date(timestamp);

    // Check if the input date is today
    if (inputDate.toDateString() === currentDate.toDateString()) {
        // Format the time to 12-hour format
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "pm" : "am";
        const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
        return formattedTime;
    }

    // Check if the input date is yesterday
    currentDate.setDate(currentDate.getDate() - 1);
    if (inputDate.toDateString() === currentDate.toDateString()) {
        return "Yesterday";
    }

    // Return date in the format dd/mm/yyyy
    const dd = String(inputDate.getDate()).padStart(2, "0");
    const mm = String(inputDate.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = inputDate.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};
