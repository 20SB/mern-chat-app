export const getFileName = (fileLink) => {
    // Split the file link by "/"
    const parts = fileLink.split("/");

    // Get the last part of the array, which will be the file name
    const fileName = parts[parts.length - 1];

    return fileName;
};
