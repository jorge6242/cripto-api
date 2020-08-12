import { IsNotEmpty, MaxLength, IsNumberString } from 'class-validator';

export class GetConversionDto {

  @IsNotEmpty()
  @IsNumberString()
  amount: number;

  @IsNotEmpty()
  @MaxLength(5)
  symbol: string;
  
}
