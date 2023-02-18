import { Logger, Module, Provider } from '@nestjs/common';
import { WalletMapper } from './wallet.mapper';

const eventHandlers: Provider[] = [];

const mappers: Provider[] = [WalletMapper];

const repositories: Provider[] = [];

@Module({
  imports: [],
  controllers: [],
  providers: [Logger, ...eventHandlers, ...mappers, ...repositories],
})
export class WalletModule {}
