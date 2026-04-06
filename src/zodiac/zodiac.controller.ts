import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { ZodiacService } from './zodiac.service';

@ApiTags('zodiac')
@ApiSecurity('api-key')
@Controller('v1/zodiac')
export class ZodiacController {
  constructor(private readonly zodiacService: ZodiacService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get daily horoscope by zodiac sign' })
  @ApiResponse({
    status: 200,
    description: 'Daily horoscope text',
    type: String,
  })
  @ApiQuery({ name: 'burc', required: true, description: 'Zodiac sign (e.g. koc, boga, ikizler, yengec, aslan, basak, terazi, akrep, yay, oglak, kova, balik)' })
  @ApiQuery({ name: 'day', required: false, description: 'Day of the month' })
  @ApiQuery({ name: 'month', required: false, description: 'Month number' })
  @ApiQuery({ name: 'year', required: false, description: 'Year' })
  async getHoroscope(
    @Query('burc') sign: string,
    @Query('day') day?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ): Promise<string> {
    if (!sign) {
      throw new BadRequestException('Burç parametresi zorunludur. (?burc=yengec)');
    }
    return this.zodiacService.getDailyHoroscope(sign, day, month, year);
  }
}
