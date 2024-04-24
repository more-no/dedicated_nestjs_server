import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import { AuthSignupDto, AuthLoginDto } from './dto';
import { AtGuard, RtGuard } from '../common/guards';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Public()
  @ApiOkResponse({ description: 'User successfully created' })
  @ApiBadRequestResponse({ description: 'Registration failed' })
  signup(@Body() dto: AuthSignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @Public()
  @ApiOkResponse({ description: 'User successfully logged in' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User successfully logged out' })
  @ApiBadRequestResponse({ description: 'User not found' })
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Token successfully refreshed' })
  @ApiForbiddenResponse({ description: 'Could not refresh the Token' })
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
