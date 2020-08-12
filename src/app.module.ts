import { Module } from '@nestjs/common';
import { CurrencyModule } from './currency/currency.module';
import { ThirdPartyApiModule } from './third-party-api/third-party-api.module';

@Module({
  imports: [CurrencyModule, ThirdPartyApiModule],
})
export class AppModule {}
