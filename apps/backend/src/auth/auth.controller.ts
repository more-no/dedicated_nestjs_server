import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import { AuthSignupDto, AuthLoginDto } from './dto';
import { AtGuard, RtGuard } from '../common/guards';
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
  signup(@Body() dto: AuthSignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  @ApiOkResponse({ description: 'User successfully logged in' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @ApiOkResponse({ description: 'User successfully logged out' })
  @ApiBadRequestResponse({ description: 'User not found' })
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiOkResponse({ description: 'Token successfully refreshed' })
  @ApiForbiddenResponse({ description: 'Could not refresh the Token' })
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
