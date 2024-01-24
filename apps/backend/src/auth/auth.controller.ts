import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Public,
  GetCurrentUser,
  GetCurrentUserId,
} from 'src/common/decorators';
import { AuthSignupDto, AuthLoginDto } from './dto/auth.dto';
import { AtGuard, RtGuard } from 'src/common/guards';
import { Tokens } from '../common/types';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiResponse({ status: 201, description: 'User successfully created' })
  signup(@Body() dto: AuthSignupDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  @ApiResponse({ status: 201, description: 'User successfully logged in' })
  login(@Body() dto: AuthLoginDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @ApiResponse({ status: 201, description: 'User successfully logged out' })
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiResponse({ status: 201, description: 'Token successfully refreshed' })
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
