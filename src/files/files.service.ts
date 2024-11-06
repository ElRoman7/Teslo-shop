import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class FilesService {
  getProductImage(imageName: string) {
    const path = join(__dirname, '../../static/uploads/products/', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException('No Product found with image ${imageName}');
    }

    return path;
  }

  removeProductImage(imageName: string) {
    const path = join(__dirname, '../../static/uploads/products/', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException('No Product found with image ${imageName}');
    }
    unlinkSync(path);
  }
}
