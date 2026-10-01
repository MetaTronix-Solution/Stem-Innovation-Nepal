import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';

@Injectable()
export class ImagekitService {
  private imagekit: ImageKit;

  constructor(private readonly configService: ConfigService) {
    this.imagekit = new ImageKit({
      publicKey: this.configService.get<string>('IMAGEKIT_PUBLIC_KEY')!,
      privateKey: this.configService.get<string>('IMAGEKIT_PRIVATE_KEY')!,
      urlEndpoint: this.configService.get<string>('IMAGEKIT_URL_ENDPOINT')!,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ) {
    const response = await this.imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder,
    });

    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    };
  }

  async deleteFile(fileId: string): Promise<void> {
  await this.imagekit.deleteFile(fileId);
}
}