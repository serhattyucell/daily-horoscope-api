import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ZodiacController } from './zodiac.controller';
import { ZodiacService } from './zodiac.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: false,
    }),
  ],
  controllers: [ZodiacController],
  providers: [ZodiacService],
})
export class ZodiacModule { }
