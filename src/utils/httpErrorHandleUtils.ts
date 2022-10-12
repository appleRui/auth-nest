import { HttpException, HttpStatus } from '@nestjs/common';

export const notFoundErrorHandle = (errorMessage = 'Not Found') => {
  throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
};

export const unAuthorizedErrorHandle = (errorMessage = 'unAuthorized') => {
  throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
};

export const badRequestErrorHandle = (errorMessage = 'Bad Request') => {
  throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
};
