import { Module, HttpModule } from '@nestjs/common';
import { ThirdPartyApiService } from './third-party-api.service';

@Module({
  imports:[HttpModule],
  providers: [ThirdPartyApiService],
  exports:[ThirdPartyApiService],
})
export class ThirdPartyApiModule {}
