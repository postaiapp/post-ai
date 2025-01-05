import { Test, TestingModule } from '@nestjs/testing';
import { InstagramAuthController } from './instagram-auth.controller';
import { InstagramAuthService } from './instagram-auth.service';

describe('InstagramAuthController', () => {
  let controller: InstagramAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstagramAuthController],
      providers: [InstagramAuthService],
    }).compile();

    controller = module.get<InstagramAuthController>(InstagramAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
