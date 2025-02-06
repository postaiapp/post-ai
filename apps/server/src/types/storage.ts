export interface UploadParams {
    fileName: string;
    fileType: string;
    body: string | Buffer;
}

export abstract class Uploader {
    abstract upload(params: UploadParams): Promise<{ url: string }>;

    abstract getSignedUrl(fileName: string): Promise<string>;
}
