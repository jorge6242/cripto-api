import { Injectable, HttpService, NotFoundException } from '@nestjs/common';
import * as Numeral from 'numeral';
import { GetConversionDto } from './dto/get-conversion.dto';
import { ThirdPartyApiService } from 'src/third-party-api/third-party-api.service';

@Injectable()
export class CurrencyService {
  constructor(private thirdPartyService: ThirdPartyApiService) {}

  

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

    const bs = this.parseCripto({ last: 100000 }, 'Bolivares', 'Bs');
    arrayCurrencys.push(bs);

    const petro = this.parseCripto({ last: 60 }, 'Petro', '$');
    arrayCurrencys.push(petro);

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
    const data = [
      {
        description: 'Bolivares',
        price: Numeral(Number(amount) * 100000).format('0,0.00'),
      },
      {
        description: 'Petro',
        price: Numeral(Number(amount) * 60).format('0,0.00'),
      },
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

    return data;
  }
}
