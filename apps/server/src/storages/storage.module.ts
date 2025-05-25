import { Global, Module } from '@nestjs/common';
import { Uploader } from '@type/storage';
import { R2Storage } from '@storages/r2-storage';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
	providers: [
		{
			provide: Uploader,
			useClass: R2Storage,
		},
		ConfigService,
	],
	exports: [Uploader],
})
export class StorageModule {}
