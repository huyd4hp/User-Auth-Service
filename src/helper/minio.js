const Minio = require("minio");
const axios = require("axios");
const UserService = require("../service/user.services");
const {
  APP_PORT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_HOST,
} = require("../config");
class MinIO {
  constructor(
    accessKey,
    secretKey,
    { endPoint = "localhost", port = 9000, useSSL = false, buckets = [] } = {}
  ) {
    this.minioClient = new Minio.Client({
      endPoint: endPoint,
      port: port,
      useSSL: useSSL,
      accessKey: accessKey,
      secretKey: secretKey,
    });
    buckets.forEach(async (bucket) => {
      if (!(await this.minioClient.bucketExists(bucket))) {
        await this.minioClient.makeBucket(bucket);
      }
    });
  }
  uploadAvatar = async (image, CLIENT_ID) => {
    const fileExtension = image.originalname.split(".").pop();
    const fileName = `${CLIENT_ID}.${fileExtension}`;
    await this.minioClient.putObject("avatars", fileName, image.buffer);
    const avatarURL = `http://localhost:${APP_PORT}/api/v1/avatar/${fileName}`;
    UserService.UpdateProfile(CLIENT_ID, {
      avatar: avatarURL,
    });
    return true;
  };
  uploadNetworkImage = async (imageUrl, bucketName, objectName) => {
    const response = await axios.get(imageUrl, { responseType: "stream" });
    const imageStream = response.data;
    const contentLength = response.headers["content-length"];
    const contentType = response.headers["content-type"];
    await this.minioClient.putObject(
      bucketName,
      `${objectName}.${contentType.split("/")[1]}`,
      imageStream,
      contentLength,
      contentType
    );
  };
  getImageByUser = async (user) => {
    const avatar = user.avatar.split("/avatar/")[1];
    let contentType = "image/jpeg";
    const fileType = avatar.split(".")[1];
    console.log(fileType);
    const imageData = await this.minioClient.getObject("avatars", avatar);
    if (fileType == "png") {
      contentType = "image/png";
    }
    return { imageData, contentType };
  };
  getDefaultAvatar = async () => {
    const imageData = await this.minioClient.getObject(
      "avatars",
      "default.png"
    );
    const contentType = "image/png";
    return { imageData, contentType };
  };
}
// Initialize
const minio = new MinIO(MINIO_ACCESS_KEY, MINIO_SECRET_KEY, {
  endPoint: MINIO_HOST,
  useSSL: false,
  buckets: ["avatars"],
});
minio.uploadNetworkImage(
  "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1",
  "avatars",
  "default"
);
// Export
module.exports = minio;
