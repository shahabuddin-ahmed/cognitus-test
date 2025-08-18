import { S3Client, GetObjectCommand, GetObjectOutput } from "@aws-sdk/client-s3";
import config from "../config/config";

export class AWSClient {
    private static instance: S3Client;

    private static initialize(): S3Client {
        return new S3Client({
            region: "ap-southeast-1",
            credentials: {
                accessKeyId: config.AWS.ACCESS_KEY_ID,
                secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
            }
        });
    }

    public static getInstance(): S3Client {
        if (AWSClient.instance) {
            return this.instance;
        }
        this.instance = AWSClient.initialize();
        return this.instance;
    }

    public async getTemplateByName(name: string): Promise<GetObjectOutput> {
		return new Promise((resolve, reject) => {
			newAWSClient().send(new GetObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: name
			})).then(resolve).catch(reject);
		});
	}
}

const newAWSClient = (): S3Client => {
    return AWSClient.getInstance();
};

export default newAWSClient;
