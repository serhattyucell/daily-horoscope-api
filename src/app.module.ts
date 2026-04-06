import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ZodiacModule } from './zodiac/zodiac.module';
import { HealthModule } from './health/health.module';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { configValidationSchema } from './config/config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL_SECONDS || '60', 10) * 1000,
        limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
      },
    ]),
    ZodiacModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule { }
