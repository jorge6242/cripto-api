import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { GetConversionDto } from './dto/get-conversion.dto';

@Controller('currency')
export class CurrencyController {
    constructor(
        private currencyService: CurrencyService
    ) {}

    @Get('/balances')
    async getBalances(): Promise<Balances> {
        return this.currencyService.getBalances();
    }

    @Get('/conversion')
    @UsePipes(ValidationPipe)
    async getConversion(
        @Query() conversionDto: GetConversionDto,
    ): Promise<string>  {
        return this.currencyService.getBalance(conversionDto);
    }
}
