const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const env = require("./environment");
const { generateRandomString } = require("./randomString");

const s3Client = new S3Client({
    credentials: {
        accessKeyId: env.awsAccesskey,
        secretAccessKey: env.awsSecretAccessKey,
    },
    region: env.awsRegion,
});

const BucketName = env.awsBucket;

module.exports.upload = async (fileType, file) => {
    try {
        var ext = file.originalname.split(".").slice(1);

        const knownExtensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".mp4",
            ".avi",
            ".mov",
        ];

        let fileName;
        if (!knownExtensions.includes(ext)) {
            fileName = file.originalname;
        } else {
            fileName = `${
                Date.now() + generateRandomString(5)
            }.${ext}`;
        }

        const uploadParams = {
            Bucket: BucketName,
            Key: `Chit-Chaat/${fileType}/${fileName}`,
            Body: file.buffer,
        };

        // Upload file to S3 bucket
        const data = await s3Client.send(
            new PutObjectCommand(uploadParams)
        );
        return data;
    } catch (err) {
        console.error("Error uploading file to S3:", err);
        throw new Error("Error in storing file, try after sometime");
    }
};

module.exports.delete = async (fileLink) => {
    try {
        const params = {
            Bucket: BucketName,
            Key: fileLink.split("/").slice(3).join("/"), // Extract key from fileLink
        };

        // Delete object from S3 bucket
        const data = await s3Client.send(
            new DeleteObjectCommand(params)
        );
        return data;
    } catch (err) {
        console.error("Error deleting file from S3:", err);
        throw new Error("Error deleting file from S3");
    }
};
