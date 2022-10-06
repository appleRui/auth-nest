import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
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
}
