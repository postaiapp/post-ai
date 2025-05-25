export interface UploadParams {
    fileName: string;
    fileType: string;
    body: string | Buffer;
}

export abstract class Uploader {
    abstract upload(params: UploadParams): Promise<{ key: string }>;

    abstract getSignedImageUrl(fileName: string): Promise<string>;

    abstract downloadAndUploadImage(url: string): Promise<{ url: string }>;

    abstract getSignedImageUrlByPath(path: string): Promise<string>;
}
