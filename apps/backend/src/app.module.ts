import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// imports	    the list of imported modules that export the providers which are required in this module

// controllers	the set of controllers defined in this module which have to be instantiated

// providers	  the providers (or services) that will be instantiated by the Nest injector and that may be shared at least across this module

// exports	    the subset of providers that are provided by this module and should be available in other modules which import this module.
//              Thus, you may consider the exported providers from a module as the module's public interface, or API.
