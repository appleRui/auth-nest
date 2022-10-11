import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: string) {
    if (value.length !== 13) {
      throw new HttpException('Incorrect expiration', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
