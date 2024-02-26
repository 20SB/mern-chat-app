export const getFileName = (fileLink) => {
    // Split the file link by "/"
    const parts = fileLink.split("/");

    // Get the last part of the array, which will be the file name
    const fileName = parts[parts.length - 1];

    return fileName;
};

export const formatTime = (timeString) => {
    const date = new Date(timeString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
};
