import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../services/post.service';
import { PostController } from './post.controller';

describe('PostController', () => {
	let controller: PostController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PostController],
			providers: [PostService],
		}).compile();

		controller = module.get<PostController>(PostController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
