import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class ParseExpiration implements PipeTransform {
  transform(value: string) {
    if (!/^[0-9]{13}$/.test(value)) {
      throw new HttpException('Incorrect expiration', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
