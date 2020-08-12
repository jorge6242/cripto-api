import { Repository, EntityRepository } from "typeorm";
import { Currency } from "./currency.entity";


@EntityRepository(Currency)
export class CurrencyRepository extends Repository<Currency> {

    async index(): Promise<Currency[]> {
        return this.find();
    }
}