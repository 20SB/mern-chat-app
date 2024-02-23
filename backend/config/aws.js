const AWS = require("aws-sdk");
const env = require("./environment");
const { generateRandomString } = require("./randomString");

AWS.config.update({
    accessKeyId: env.awsAccesskey,
    secretAccessKey: env.awsSecretAccessKey,
    region: env.awsRegion,
});

const s3 = new AWS.S3();
const BucketName = env.awsBucket;

module.exports.upload = async (fileType, file) => {
    var ext = file.originalname.split(".").slice(1);

    const knownExtensions = [".jpg", ".jpeg", ".png", ".gif", ".mp4", ".avi", ".mov"];

    let fileName;
    if (!knownExtensions.includes(ext)) {
        fileName = file.originalname;
    } else {
        fileName = `${Date.now() + generateRandomString(5)}.${ext}`;
    }
    const uploadParams = {
        Bucket: BucketName,
        Key: `Chit-Chaat/${fileType}/${fileName}`,
        Body: file.buffer,
    };

    try {
        // Upload file to S3 bucket
        return (data = await s3.upload(uploadParams).promise());
    } catch (err) {
        console.error("Error uploading file to S3:", err);
        res.status(500);
        throw new Error("Error in storing DP, try after sometime");
    }
};

module.exports.delete = async (fileLink) => {
    try {
        const params = {
            Bucket: BucketName,
            Key: fileLink.split("/").slice(3).join("/"), // Extract key from fileLink
        };

        // Delete object from S3 bucket
        return await s3.deleteObject(params).promise();
    } catch (err) {
        console.error("Error deleting file from S3:", err);
        throw new Error("Error deleting file from S3");
    }
};
