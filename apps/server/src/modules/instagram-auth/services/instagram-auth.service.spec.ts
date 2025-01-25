import { Test, TestingModule } from '@nestjs/testing';
import { InstagramAuthService } from './instagram-auth.service';

describe('InstagramAuthService', () => {
  let service: InstagramAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstagramAuthService],
    }).compile();

    service = module.get<InstagramAuthService>(InstagramAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
