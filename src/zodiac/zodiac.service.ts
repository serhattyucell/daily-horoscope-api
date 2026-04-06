import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ZodiacService {
  private readonly logger = new Logger(ZodiacService.name);

  // Supported zodiac signs based on the PHP reference
  private readonly signs = [
    'yengec',
    'kova',
    'koc',
    'oglak',
    'aslan',
    'akrep',
    'yay',
    'ikizler',
    'boga',
    'basak',
    'balik',
    'terazi',
  ];

  async getDailyHoroscope(
    sign: string,
    day?: string,
    month?: string,
    year?: string,
  ): Promise<string> {
    // Validate sign
    if (!this.signs.includes(sign)) {
      this.logger.warn(`Invalid sign requested: ${sign}`);
      throw new NotFoundException('Burç bulunamadı (Invalid zodiac sign)');
    }

    const url = `https://www.mynet.com/kadin/burclar-astroloji/${sign}-burcu-gunluk-yorumu.html`;

    // Prepare query parameters if date is provided
    const params: any = {};
    if (day) params.day = day;
    if (month) params.month = month;
    if (year) params.year = year;

    try {
      this.logger.log(`Fetching horoscope for ${sign} with params: ${JSON.stringify(params)}`);

      const response = await axios.get(url, {
        params,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const content = this.find(response.data);
      if (!content) {
        this.logger.warn(`No content found for ${sign}`);
        return 'Yorum bulunamadı.';
      }

      return content;
    } catch (error) {
      this.logger.error(`Error fetching horoscope for ${sign}: ${(error as Error).message}`);
      throw new Error('Veri çekilemedi.');
    }
  }

  private find(text: string): string | null {
    // Mimic PHP find function: matches content between <p> and </p>
    // PHP: @preg_match_all('/' . preg_quote($first, '/') . '(.*?)'. preg_quote($last, '/').'/i', $text, $m);
    // resulting in the first match
    const regex = /<p>(.*?)<\/p>/i;
    const match = regex.exec(text);

    if (match && match[1]) {
      return match[1];
    }
    return null;
  }
}
