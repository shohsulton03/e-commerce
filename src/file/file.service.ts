import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as uuid from 'uuid';

@Injectable()
export class FileService {
  async saveFile(file: any): Promise<string> {
    try {
      if (!file || !file.mimetype) {
        console.error('Fayl mavjud emas yoki noto‘g‘ri formatda:', file);
        throw new BadRequestException(
          'Fayl mavjud emas yoki noto‘g‘ri formatda',
        );
      }

      const mimeTypesMap = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
      };

      if (!mimeTypesMap[file.mimetype]) {
        console.error('Yaroqsiz fayl turi:', file.mimetype);
        throw new BadRequestException(
          'Faqat ruxsat etilgan rasm formatlari yuklanishi mumkin (JPEG, PNG, GIF, WEBP).',
        );
      }

      const fileExtension = mimeTypesMap[file.mimetype];
      const fileName = uuid.v4() + fileExtension;
      const filePath = path.resolve(__dirname, '..', '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.join(filePath, fileName), file.buffer);

      return fileName;
    } catch (error) {
      console.error('Xatolik:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Rasmni faylga yozishda hatolik');
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Faylni o‘chirishda xatolik');
    }
  }
}
