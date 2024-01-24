import {
  Injectable,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(image: Express.Multer.File): Promise<string> {
    try {
      const originalName = path.parse(image.originalname).name;
      const filename = Date.now() + '-' + originalName + '.webp';

      // reference https://sharp.pixelplumbing.com/api-constructor

      await sharp(image.buffer)
        .greyscale()
        .resize(600, 600, {
          fit: 'cover',
        })
        .webp({ effort: 3 })
        .toFile(path.join('uploads', filename));

      return filename;
    } catch (error) {
      throw new UnsupportedMediaTypeException('Failed to process file.');
    }
  }
}
