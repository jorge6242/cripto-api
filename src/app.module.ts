import { Module } from '@nestjs/common';
import { CurrencyModule } from './currency/currency.module';
import { ThirdPartyApiModule } from './third-party-api/third-party-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    CurrencyModule, 
    ThirdPartyApiModule],
})
export class AppModule {}
