import { S3Client } from "@aws-sdk/client-s3";

let s3: undefined | S3Client = undefined;

export const S3 = () => {
  if (s3) {
    return s3;
  }

  s3 = new S3Client({
    region: process.env.CF_REGION,
    endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CF_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CF_ACCESS_KEY_SECRET!,
    },
  });

  return s3;
};
