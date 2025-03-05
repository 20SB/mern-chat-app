const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const env = require("./environment");
const { generateRandomString } = require("./randomString");

// Initialize S3 Client
const s3 = new S3Client({
  region: env.awsRegion,
  credentials: {
    accessKeyId: env.awsAccesskey,
    secretAccessKey: env.awsSecretAccessKey,
  },
});

const BucketName = env.awsBucket;

// Upload function
module.exports.upload = async (fileType, file) => {
  try {
    const ext = `.${file.originalname.split(".").pop()}`; // Get file extension

    const knownExtensions = [".jpg", ".jpeg", ".png", ".gif", ".mp4", ".avi", ".mov"];
    let fileName;

    if (!knownExtensions.includes(ext)) {
      fileName = file.originalname;
    } else {
      fileName = `${Date.now()}_${generateRandomString(5)}${ext}`;
    }

    const uploadParams = {
      Bucket: BucketName,
      Key: `Chit-Chaat/${fileType}/${fileName}`,
      Body: file.buffer,
    };

    // Upload file using AWS SDK v3
    const command = new PutObjectCommand(uploadParams);
    const data = await s3.send(command);

    // Construct the URL of the uploaded object
    const Location = `https://${BucketName}.s3.${env.awsRegion}.amazonaws.com/${encodeURIComponent(uploadParams.Key)}`;

    return { data, Location };
  } catch (err) {
    throw new Error("Error in storing file, try again later");
  }
};

// Delete function
module.exports.delete = async (fileLink) => {
  try {
    const fileKey = fileLink.split("/").slice(3).join("/"); // Extract key from URL

    const deleteParams = {
      Bucket: BucketName,
      Key: fileKey,
    };

    // Delete file using AWS SDK v3
    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);

    return { success: true, message: "File deleted successfully" };
  } catch (err) {
    throw new Error("Error deleting file from S3");
  }
};
