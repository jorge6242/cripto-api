import { Module, HttpModule } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { ThirdPartyApiService } from 'src/third-party-api/third-party-api.service';


@Module({
  imports:[ HttpModule ],
  providers: [
    ThirdPartyApiService,
    CurrencyService
  ],
  controllers: [CurrencyController]
})
export class CurrencyModule {}
