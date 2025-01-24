import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; 
import path from 'path'; 

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

async function uploadToS3(file: Express.Multer.File) {
  const uniqueID = uuidv4(); 
  const fileExtension = path.extname(file.originalname); 
  const filename = `${uniqueID}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: filename, 
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);
    return params.Key;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error((error as Error).message);
  }
}

export default uploadToS3;