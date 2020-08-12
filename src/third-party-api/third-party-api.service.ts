import { Injectable, HttpService, NotFoundException } from '@nestjs/common';

@Injectable()
export class ThirdPartyApiService {
  constructor(private httpService: HttpService) {}
  async criptoApi(): Promise<any> {
    return this.httpService
      .get('https://poloniex.com/public?command=returnTicker')
      .toPromise()
      .then(res => res.data)
      .catch(err => {
        throw new NotFoundException(err);
      });
  }

  async getCurrencyApi(base: string): Promise<any> {
    return this.httpService
      .get(`https://api.exchangeratesapi.io/latest?base=${base}`)
      .toPromise()
      .then(res => res.data)
      .catch(err => {
        throw new NotFoundException(err);
      });
  }

  async getConversion(amount: number, symbol: string): Promise<any> {
    const conversions = 'USD,EUR,BTC,ETH,DASH';
    return this.httpService
      .get(
        `https://web-api.coinmarketcap.com/v1/tools/price-conversion?amount=${amount}&convert=${conversions}&symbol=${symbol}`,
      )
      .toPromise()
      .then(res => res.data.data)
      .catch(err => {
        throw new NotFoundException(err);
      });
  }
}
