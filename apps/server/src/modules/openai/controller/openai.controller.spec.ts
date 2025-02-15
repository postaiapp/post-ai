import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from '../service/openai.service';
import { OpenaiController } from './openai.controller';

describe('OpenaiController', () => {
	let controller: OpenaiController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OpenaiController],
			providers: [OpenaiService],
		}).compile();

		controller = module.get<OpenaiController>(OpenaiController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
