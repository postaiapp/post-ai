import { Injectable } from '@nestjs/common';
import { VerifyAccountDto } from './dto/post.dto';

@Injectable()
export class PostService {
    createAccount({ password, username }: VerifyAccountDto) {}

    verify({ password, username }: VerifyAccountDto) {}
}
