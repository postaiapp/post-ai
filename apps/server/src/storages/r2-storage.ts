import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { Uploader, UploadParams } from 'src/types/storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class R2Storage implements Uploader {
    private client: S3Client;

    constructor(private configService: ConfigService) {
        const accountId = this.configService.get<string>('OPENAI_API_KEY');

        this.client = new S3Client({
            endpoint: `https://${accountId}.r2.cloudflarestorage.com/post-ai`,
            region: 'auto',
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }

    async upload({ fileName, fileType, body }: UploadParams): Promise<{ url: string }> {
        const uploadId = randomUUID();

        const uniqueFileName = `${uploadId}-${fileName}`;

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
                Key: uniqueFileName,
                ContentType: fileType,
                Body: body,
            })
        );

        return {
            url: uniqueFileName,
        };
    }

    async getSignedUrl(fileName: string): Promise<string> {
        const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileName,
        });

        return getSignedUrl(this.client, command, { expiresIn: 3600 });
    }
}
