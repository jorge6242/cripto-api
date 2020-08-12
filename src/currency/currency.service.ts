import { Injectable, HttpService, NotFoundException } from '@nestjs/common';
import * as Numeral from 'numeral';
import { GetConversionDto } from './dto/get-conversion.dto';
import { ThirdPartyApiService } from 'src/third-party-api/third-party-api.service';
import { CurrencyRepository } from './cureency.repository';
import { Currency } from './currency.entity';

@Injectable()
export class CurrencyService {
  constructor(
    private thirdPartyService: ThirdPartyApiService,
    private repository: CurrencyRepository
    ) {}

  private async initData() {
    const data: any = [
      {
        description: "Bolivares",
        price: 100000,
        symbol: "Bs"
      },
      {
        description: "Petro",
        price: 60,
        symbol: "$"
      },
    ];
    return await this.repository.save(data);
  }

  private parseCripto(cripto: any, description: string, symbol: string) {
    const format = Numeral(cripto.last).format('0,0.00');
    const price = `${symbol} ${format}`;
    const data: Balances = {
      description,
      price,
    };
    return data;
  }

  async getBalances(): Promise<any> {
    let arrayCurrencys: Array<any> = [];

    let dataService = await this.thirdPartyService.criptoApi();
    dataService = [dataService];

    const localCurrencies = await this.repository.index();

    if(localCurrencies.length === 0) {
      const response = await this.initData();
      response.forEach(element => {
        const value = this.parseCripto({ last: element.price }, element.description, element.symbol);
        arrayCurrencys.push(value);
      });
    } else {
      localCurrencies.forEach(element => {
        const value = this.parseCripto({ last: element.price }, element.description, element.symbol);
        arrayCurrencys.push(value);
      });
    }


    const euroResponse = await this.thirdPartyService.getCurrencyApi('EUR');
    const euro = this.parseCripto(
      { last: euroResponse.rates.USD },
      'Euro',
      '$',
    );
    arrayCurrencys.push(euro);

    dataService.forEach(element => {
      if (element['USDT_BTC']) {
        const data = this.parseCripto(element['USDT_BTC'], 'Bitcoin', '$');
        arrayCurrencys.push(data);
      }
      if (element['USDT_ETH']) {
        const data = this.parseCripto(element['USDT_ETH'], 'Ethereum', '$');
        arrayCurrencys.push(data);
      }
      if (element['USDT_DASH']) {
        const data = this.parseCripto(element['USDT_DASH'], 'Dash', '$');
        arrayCurrencys.push(data);
      }
    });

    return arrayCurrencys;
  }

  async getBalance(conversionDto: GetConversionDto): Promise<any> {
    const { amount, symbol } = conversionDto;
    let dataService = await this.thirdPartyService.getConversion(amount, symbol);
    const currencys = dataService.quote;
    const localCurrencies = await this.repository.index();
    const data = [
      {
        description: 'Bitcoin',
        price: currencys['BTC'].price,
      },
      {
        description: 'Dash',
        price: currencys['DASH'].price,
      },
      {
        description: 'Ethereum',
        price: currencys['ETH'].price,
      },
      {
        description: 'Euro',
        price: Numeral(currencys['EUR'].price).format('0,0.00'),
      },
      {
        description: 'Dollar',
        price: Numeral(currencys['USD'].price).format('0,0.00'),
      },
    ];

    if(localCurrencies.length === 0) {
      const res = await this.initData();
      res.forEach(element => {
        data.push({
          description: element.description,
          price: Numeral(Number(element.price) * 100000).format('0,0.00'),
        })
      });
    } else {
      localCurrencies.forEach(element => {
        data.push({
          description: element.description,
          price: Numeral(Number(element.price) * 100000).format('0,0.00'),
        })
      });
    }

    return data;
  }
}
