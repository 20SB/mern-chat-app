export const getSender = (loggedUser, users) => {
    // console.log("users[0]._id", users[0]._id);
    // console.log("users[1]._id", users[1]._id);
    // console.log("loggeduser._id", loggedUser.user);
    return users[0]?._id === loggedUser?.user?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]?._id === loggedUser?.user?._id ? users[1] : users[0];
};
