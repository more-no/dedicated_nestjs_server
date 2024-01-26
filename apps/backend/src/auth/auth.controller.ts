import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import { AuthSignupDto, AuthLoginDto } from './dto/auth.dto';
import { AtGuard, RtGuard } from '../common/guards';
import { Tokens } from '../common/types';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiCreatedResponse({ description: 'User successfully created' })
  @ApiBadRequestResponse({ description: 'Registration failed' })
  signup(@Body() dto: AuthSignupDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  @ApiOkResponse({ description: 'User successfully logged in' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  login(@Body() dto: AuthLoginDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @ApiOkResponse({ description: 'User successfully logged out' })
  @ApiBadRequestResponse({ description: 'User not found' })
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiOkResponse({ description: 'Token successfully refreshed' })
  @ApiForbiddenResponse({ description: 'Could not refresh the Token' })
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
