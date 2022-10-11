import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Query,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { SignUpDto } from 'src/auth/dto/SignUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() request) {
    return this.authService.login(request.user);
  }

  @Post('/signUp')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('/verify')
  async verify(
    @Query('signature') signature: string,
    @Query('expiration') expiration: string,
  ) {
    return this.authService.verify({
      signature,
      expiration,
    });
  }
}
