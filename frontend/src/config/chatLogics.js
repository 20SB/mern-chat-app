export const getSender = (loggeduser, users) => {
    return users[0]._id === loggeduser._id ? users[1].name : users[0].name;
};
